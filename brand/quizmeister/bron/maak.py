#!/usr/bin/env python3
"""Maakt het Quizmeister-icoon, het woordmerk en alle afgeleide bestanden.

Draaien vanuit deze map:  python3 -P maak.py
Nodig: fontTools (user site-packages), hb-shape (HarfBuzz) en rsvg-convert, magick en iconutil voor de pixelbestanden.

Het teken: een q en een m die één stam delen; de laatste boog van de m krult om tot een vraagteken.
In één kleur: amber op nachtblauw.
Alles is plat: effen kleuren, geen gloed, verlopen of schaduwen.
"""
import json
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HIER = os.path.dirname(os.path.abspath(__file__))
UIT = os.path.dirname(HIER)

NACHT = '#0f1420'
CREME = '#fff3df'
AMBER = '#ffa53d'
AMBER_OP_LICHT = '#e07b0c'  # donkerder amber, leesbaar op crème en wit
TEKEN_KLEUR = AMBER  # het teken in het icoon heeft één kleur; meerdere kleuren werkten niet

# --- Het teken -------------------------------------------------------------------------------------------------

# Basis: qm in Bricolage Grotesque (smal en zwaar), uit de schetsen. De laatste poot van de m vervangen we door een
# vraagteken met dezelfde dikte als de poten: de boog krult terug naar een korte steel, de punt staat op de basislijn.
HAAK_OUD = ('Q700.8 315.4 726.2 315.4C764.8 315.4 812 352.6 812 423.5C812 474.2 786.7 469.1 786.7 507.1L786.7 513.4'
            'L712.1 513.4L712.1 475.9Q712.1 452.3 709.7 436.9Q707.3 421.5 701.7 414.2Q696.2 406.8 686.5 406.8')
HAAK_NIEUW = ('Q700.8 315.4 726.2 315.4C776 315.4 828 352 828 424C828 486 782 498 772 522L772 540L688 540L688 528'
              'C688 488 742 478 742 446C742 420 716 406.8 686.5 406.8')
basis = open(os.path.join(HIER, 'qm-basis.txt')).read().strip()
assert HAAK_OUD in basis, 'haakje niet gevonden in qm-basis.txt'
QM = basis.replace(HAAK_OUD, HAAK_NIEUW)
PUNT = (730, 613.7, 44)  # midden onder de steel, onderkant op de basislijn (657,7)
SPLITS = 488.1  # rechterkant van de gedeelde stam: links crème (q), rechts amber (m)
VERSCHUIF = (-8, -12)  # optisch midden in het icoonvlak


def teken(q, m, punt, ids='t'):
    """Het teken in icoon-coördinaten (1024-raster). q, m en punt zijn kleuren."""
    dx, dy = VERSCHUIF
    cx, cy, r = PUNT
    return f'''<g transform="translate({dx} {dy})">
    <clipPath id="{ids}l"><rect x="0" y="0" width="{SPLITS}" height="1024"/></clipPath>
    <clipPath id="{ids}r"><rect x="{SPLITS}" y="0" width="{1024 - SPLITS}" height="1024"/></clipPath>
    <path clip-path="url(#{ids}r)" fill="{m}" d="{QM}"/>
    <path clip-path="url(#{ids}l)" fill="{q}" d="{QM}"/>
    <circle cx="{cx}" cy="{cy}" r="{r}" fill="{punt}"/>
  </g>'''


def squircle(x, y, w, h, r, s=0.6):
    """Afgeronde rechthoek met 'doorlopende' hoeken (zoals de iconen van macOS): de bocht loopt geleidelijk over in de zijde."""
    p = (1 + s) * r
    budget = min(w, h) / 2
    if p > budget:
        s = min(s, budget / r - 1)
        p = min(p, budget)
    boog = 90 * (1 - s)
    lengte = math.sin(math.radians(boog / 2)) * r * math.sqrt(2)
    alfa = (90 - boog) / 2
    p3p4 = r * math.tan(math.radians(alfa / 2))
    beta = 45 * s
    c = p3p4 * math.cos(math.radians(beta))
    d = c * math.tan(math.radians(beta))
    b = (p - lengte - c - d) / 3
    a = 2 * b
    f = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
    return (f'M{f(x + w - p)} {f(y)}'
            f'c{f(a)} 0 {f(a + b)} 0 {f(a + b + c)} {f(d)}a{f(r)} {f(r)} 0 0 1 {f(lengte)} {f(lengte)}'
            f'c{f(d)} {f(c)} {f(d)} {f(b + c)} {f(d)} {f(a + b + c)}'
            f'L{f(x + w)} {f(y + h - p)}'
            f'c0 {f(a)} 0 {f(a + b)} {f(-d)} {f(a + b + c)}a{f(r)} {f(r)} 0 0 1 {f(-lengte)} {f(lengte)}'
            f'c{f(-c)} {f(d)} {f(-(b + c))} {f(d)} {f(-(a + b + c))} {f(d)}'
            f'L{f(x + p)} {f(y + h)}'
            f'c{f(-a)} 0 {f(-(a + b))} 0 {f(-(a + b + c))} {f(-d)}a{f(r)} {f(r)} 0 0 1 {f(-lengte)} {f(-lengte)}'
            f'c{f(-d)} {f(-c)} {f(-d)} {f(-(b + c))} {f(-d)} {f(-(a + b + c))}'
            f'L{f(x)} {f(y + p)}'
            f'c0 {f(-a)} 0 {f(-(a + b))} {f(d)} {f(-(a + b + c))}a{f(r)} {f(r)} 0 0 1 {f(lengte)} {f(-lengte)}'
            f'c{f(c)} {f(-d)} {f(b + c)} {f(-d)} {f(a + b + c)} {f(-d)}Z')


VORM = squircle(100, 100, 824, 824, 185.4)  # het macOS-raster: 824 px vlak in een canvas van 1024
TEKEN_VAK = '190 280 650 470'  # het teken alleen, met wat lucht


def svg(viewbox, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">\n  {body}\n</svg>\n'


icoon = svg('0 0 1024 1024', f'<path fill="{NACHT}" d="{VORM}"/>\n  {teken(TEKEN_KLEUR, TEKEN_KLEUR, TEKEN_KLEUR)}')
icoon_vlak = icoon.replace('viewBox="0 0 1024 1024"', 'viewBox="100 100 824 824"')  # zonder marge: favicon, lockup
icoon_vierkant = svg('100 100 824 824', f'<rect x="100" y="100" width="824" height="824" fill="{NACHT}"/>\n  {teken(TEKEN_KLEUR, TEKEN_KLEUR, TEKEN_KLEUR)}')

# --- Het woordmerk ---------------------------------------------------------------------------------------------

font = TTFont(os.path.join(HIER, 'BricolageGrotesque.woff2'))
font.flavor = None
tmp = tempfile.mkdtemp()
ttf = os.path.join(tmp, 'BricolageGrotesque.ttf')
font.save(ttf)  # standaardstand van het variabele font: wght 800, wdth 100, opsz 96
gs = font.getGlyphSet()
upm = font['head'].unitsPerEm
XH = font['OS/2'].sxHeight


def vorm(naam, x, basislijn, k):
    pen = SVGPathPen(gs, lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
    gs[naam].draw(TransformPen(pen, (k, 0, 0, -k, x, basislijn)))
    return pen.getCommands()


def grenzen(naam, x, basislijn, k):
    pen = BoundsPen(gs)
    gs[naam].draw(TransformPen(pen, (k, 0, 0, -k, x, basislijn)))
    return pen.bounds


def woordmerk(kleur_quiz, kleur_meister, punt_quiz, punt_meister, maat=200, spatie=-0.035):
    """quizmeister met kerning (HarfBuzz) en -0,035 em letterafstand; de puntjes op de i wisselen van kleur."""
    tekst = 'quizmeister'
    uit = subprocess.run(['hb-shape', '--output-format=json', ttf, tekst], capture_output=True, text=True, check=True).stdout
    glyphs = json.loads(uit)
    k = maat / upm
    x, b = 0.0, 0.0
    delen = {'quiz': [], 'meister': [], 'punt_quiz': [], 'punt_meister': []}
    vakken = []
    for i, g in enumerate(glyphs):
        naam = g['g']
        gx = x + g.get('dx', 0) * k
        groep = 'quiz' if g['cl'] < 4 else 'meister'
        lichaam = 'dotlessi' if naam == 'i' else naam
        delen[groep].append(vorm(lichaam, gx, b, k))
        vakken.append(grenzen(naam, gx, b, k))
        if naam == 'i':
            delen['punt_' + groep].append(vorm('i', gx, b, k))
        x += g['ax'] * k + (spatie * maat if i < len(glyphs) - 1 else 0)
    x0 = min(v[0] for v in vakken); y0 = min(v[1] for v in vakken)
    x1 = max(v[2] for v in vakken); y1 = max(v[3] for v in vakken)
    boven = b - XH * k - 6  # alles hierboven is het puntje van de i
    vb = f'{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}'
    body = (f'<defs><clipPath id="punt"><rect x="{x0 - 10:.1f}" y="{y0 - 10:.1f}" width="{x1 - x0 + 20:.1f}" height="{boven - y0 + 10:.1f}"/></clipPath></defs>\n'
            f'  <path fill="{kleur_quiz}" d="{" ".join(delen["quiz"])}"/>\n'
            f'  <path fill="{kleur_meister}" d="{" ".join(delen["meister"])}"/>\n'
            f'  <g clip-path="url(#punt)"><path fill="{punt_quiz}" d="{" ".join(delen["punt_quiz"])}"/>'
            f'<path fill="{punt_meister}" d="{" ".join(delen["punt_meister"])}"/></g>')
    return svg(vb, body), (x0, y0, x1, y1), b, k


woord_donker, wvak, _, wk = woordmerk(CREME, AMBER, AMBER, CREME)
woord_licht, _, _, _ = woordmerk(NACHT, AMBER_OP_LICHT, AMBER_OP_LICHT, NACHT)


def lockup(woord, hoogte=300, tussen=72, rand=12):
    """Icoon links, woordmerk rechts; de x-hoogte van het woordmerk staat midden naast het icoon."""
    x0, y0, x1, y1 = wvak
    basislijn = hoogte / 2 + XH * wk / 2
    breedte = hoogte + tussen + (x1 - x0)
    boven = min(0, basislijn + y0) - rand
    onder = max(hoogte, basislijn + y1) + rand
    binnen = re.sub(r'^<svg[^>]*>|</svg>\s*$', '', woord.strip())
    ikoon = re.sub(r'^<svg[^>]*>|</svg>\s*$', '', icoon_vlak.strip())
    return svg(f'{-rand} {boven:.1f} {breedte + 2 * rand:.1f} {onder - boven:.1f}',
               f'<svg x="0" y="0" width="{hoogte}" height="{hoogte}" viewBox="100 100 824 824">{ikoon}</svg>\n'
               f'  <g transform="translate({hoogte + tussen - x0:.1f} {basislijn:.1f})">{binnen}</g>')


# --- Wegschrijven ----------------------------------------------------------------------------------------------

def schrijf(pad, inhoud):
    pad = os.path.join(UIT, pad)
    with open(pad, 'w') as f:
        f.write(inhoud)
    return pad


schrijf('icoon/quizmeister-icoon.svg', icoon)
schrijf('icoon/quizmeister-icoon-vlak.svg', icoon_vlak)
schrijf('logo/quizmeister-teken.svg', svg(TEKEN_VAK, teken(TEKEN_KLEUR, TEKEN_KLEUR, TEKEN_KLEUR)))
schrijf('logo/quizmeister-teken-zwart.svg', svg(TEKEN_VAK, teken('#000', '#000', '#000')))
schrijf('logo/quizmeister-teken-wit.svg', svg(TEKEN_VAK, teken('#fff', '#fff', '#fff')))
schrijf('logo/quizmeister-woordmerk-donker.svg', woord_donker)
schrijf('logo/quizmeister-woordmerk-licht.svg', woord_licht)
schrijf('logo/quizmeister-lockup-donker.svg', lockup(woord_donker))
schrijf('logo/quizmeister-lockup-licht.svg', lockup(woord_licht))
schrijf('site/favicon.svg', icoon_vlak)


def png(bron, doel, breedte, achtergrond=None):
    cmd = ['rsvg-convert', '-w', str(breedte), bron, '-o', doel]
    if achtergrond:
        cmd[1:1] = ['-b', achtergrond]
    subprocess.run(cmd, check=True)


i = lambda p: os.path.join(UIT, p)
# App: icns uit een iconset (16 t/m 1024, met @2x), plus icon.png en een ico voor de volledigheid.
iconset = os.path.join(tmp, 'icon.iconset')
os.makedirs(iconset)
for maat in (16, 32, 128, 256, 512):
    png(i('icoon/quizmeister-icoon.svg'), os.path.join(iconset, f'icon_{maat}x{maat}.png'), maat)
    png(i('icoon/quizmeister-icoon.svg'), os.path.join(iconset, f'icon_{maat}x{maat}@2x.png'), maat * 2)
subprocess.run(['iconutil', '-c', 'icns', iconset, '-o', i('app/icon.icns')], check=True)
png(i('icoon/quizmeister-icoon.svg'), i('app/icon.png'), 1024)
png(i('icoon/quizmeister-icoon.svg'), i('icoon/quizmeister-icoon-1024.png'), 1024)
ico_delen = []
for maat in (16, 24, 32, 48, 64, 128, 256):
    doel = os.path.join(tmp, f'ico-{maat}.png')
    png(i('icoon/quizmeister-icoon-vlak.svg'), doel, maat)
    ico_delen.append(doel)
subprocess.run(['magick', *ico_delen, i('app/icon.ico')], check=True)
# Site: favicons, Apple-touch (iOS rondt zelf af, dus vierkant) en een afbeelding voor gedeelde links.
png(i('site/favicon.svg'), i('site/favicon-32.png'), 32)
png(i('site/favicon.svg'), i('site/favicon-16.png'), 16)
apple = os.path.join(tmp, 'apple.svg')
open(apple, 'w').write(icoon_vierkant)
png(apple, i('site/apple-touch-icon.png'), 180)
# De achtergrond is een tint lichter dan het icoon, zodat het nachtblauwe vlak van het icoon zichtbaar blijft.
og = os.path.join(tmp, 'og.svg')
lock = re.sub(r'^<svg[^>]*viewBox="([^"]+)"[^>]*>', '', lockup(woord_donker).strip())
vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', lockup(woord_donker)).group(1).split()]
w = 980
h = w * vb[3] / vb[2]
open(og, 'w').write(svg('0 0 1200 630', f'<rect width="1200" height="630" fill="#1a2131"/>\n  '
                                         f'<svg x="{(1200 - w) / 2:.1f}" y="{(630 - h) / 2:.1f}" width="{w}" height="{h:.1f}" '
                                         f'viewBox="{" ".join(f"{v:.1f}" for v in vb)}">{lock}'))
png(og, i('site/og-image.png'), 1200)
shutil.rmtree(tmp)
print('klaar:', UIT)
