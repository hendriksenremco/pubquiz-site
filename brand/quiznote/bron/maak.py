#!/usr/bin/env python3
"""Maakt het QuizNote-icoon, het woordmerk en alle afgeleide bestanden, en zet die van de site in public/.

Draaien vanuit deze map:  python3 -P maak.py
Nodig: fontTools (user site-packages), hb-shape (HarfBuzz) en rsvg-convert, magick en iconutil voor de pixelbestanden.

Het teken: de Q uit het woordmerk (Bricolage Grotesque), in amber op nachtblauw.
Alles is plat: effen kleuren, geen gloed, verlopen of schaduwen.
"""
import json
import math
import os
import re
import shutil
import subprocess
import tempfile

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HIER = os.path.dirname(os.path.abspath(__file__))
UIT = os.path.dirname(HIER)
PUBLIC = os.path.join(UIT, '..', '..', 'public')

NACHT = '#0f1420'
CREME = '#fff3df'
AMBER = '#ffa53d'
AMBER_OP_LICHT = '#e07b0c'  # donkerder amber, leesbaar op crème en wit

font = TTFont(os.path.join(HIER, 'BricolageGrotesque.woff2'))
font.flavor = None
tmp = tempfile.mkdtemp()
ttf = os.path.join(tmp, 'BricolageGrotesque.ttf')
font.save(ttf)  # standaardstand van het variabele font: wght 800, wdth 100, opsz 96
gs = font.getGlyphSet()
upm = font['head'].unitsPerEm
XH = font['OS/2'].sxHeight
getal = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')

# --- Het teken -------------------------------------------------------------------------------------------------

# De Q staat midden in het icoonvlak (824 px in een canvas van 1024) en vult 72% ervan, gemeten over de hoogte
# van de Q inclusief zijn staart.
pen = BoundsPen(gs)
gs['Q'].draw(pen)
QX0, QY0, QX1, QY1 = pen.bounds
VULLING = 0.72
K = 824 * VULLING / max(QX1 - QX0, QY1 - QY0)
TX = 512 - (QX0 + QX1) / 2 * K
TY = 512 + (QY0 + QY1) / 2 * K
pen = SVGPathPen(gs, getal)
gs['Q'].draw(TransformPen(pen, (K, 0, 0, -K, TX, TY)))
Q = pen.getCommands()


def teken(kleur):
    """Het teken in icoon-coördinaten (1024-raster)."""
    return f'<path fill="{kleur}" d="{Q}"/>'


# Het teken alleen, met wat lucht: de omtrek van de Q in icoon-coördinaten.
LUCHT = 24
TEKEN_VAK = (f'{TX + QX0 * K - LUCHT:.1f} {TY - QY1 * K - LUCHT:.1f} '
             f'{(QX1 - QX0) * K + 2 * LUCHT:.1f} {(QY1 - QY0) * K + 2 * LUCHT:.1f}')


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


def svg(viewbox, body):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">\n  {body}\n</svg>\n'


icoon = svg('0 0 1024 1024', f'<path fill="{NACHT}" d="{VORM}"/>\n  {teken(AMBER)}')
icoon_vlak = icoon.replace('viewBox="0 0 1024 1024"', 'viewBox="100 100 824 824"')  # zonder marge: favicon, lockup
icoon_vierkant = svg('100 100 824 824', f'<rect x="100" y="100" width="824" height="824" fill="{NACHT}"/>\n  {teken(AMBER)}')

# --- Het woordmerk ---------------------------------------------------------------------------------------------


def vorm(naam, x, basislijn, k):
    pen = SVGPathPen(gs, getal)
    gs[naam].draw(TransformPen(pen, (k, 0, 0, -k, x, basislijn)))
    return pen.getCommands()


def grenzen(naam, x, basislijn, k):
    pen = BoundsPen(gs)
    gs[naam].draw(TransformPen(pen, (k, 0, 0, -k, x, basislijn)))
    return pen.bounds


def woordmerk(kleur_quiz, kleur_note, maat=200, spatie=-0.02):
    """QuizNote met kerning (HarfBuzz) en -0,02 em letterafstand: Quiz en Note in twee kleuren, het puntje op de i in
    de kleur van Note."""
    tekst = 'QuizNote'
    uit = subprocess.run(['hb-shape', '--output-format=json', ttf, tekst], capture_output=True, text=True, check=True).stdout
    glyphs = json.loads(uit)
    k = maat / upm
    x, b = 0.0, 0.0
    delen = {'quiz': [], 'note': [], 'punt': []}
    vakken = []
    for i, g in enumerate(glyphs):
        naam = g['g']
        gx = x + g.get('dx', 0) * k
        lichaam = 'dotlessi' if naam == 'i' else naam
        delen['quiz' if g['cl'] < 4 else 'note'].append(vorm(lichaam, gx, b, k))
        vakken.append(grenzen(naam, gx, b, k))
        if naam == 'i':
            delen['punt'].append(vorm('i', gx, b, k))
        x += g['ax'] * k + (spatie * maat if i < len(glyphs) - 1 else 0)
    x0 = min(v[0] for v in vakken); y0 = min(v[1] for v in vakken)
    x1 = max(v[2] for v in vakken); y1 = max(v[3] for v in vakken)
    boven = b - XH * k - 6  # alles hierboven is het puntje van de i
    vb = f'{x0:.1f} {y0:.1f} {x1 - x0:.1f} {y1 - y0:.1f}'
    body = (f'<defs><clipPath id="punt"><rect x="{x0 - 10:.1f}" y="{y0 - 10:.1f}" width="{x1 - x0 + 20:.1f}" height="{boven - y0 + 10:.1f}"/></clipPath></defs>\n'
            f'  <path fill="{kleur_quiz}" d="{" ".join(delen["quiz"])}"/>\n'
            f'  <path fill="{kleur_note}" d="{" ".join(delen["note"])}"/>\n'
            f'  <g clip-path="url(#punt)"><path fill="{kleur_note}" d="{" ".join(delen["punt"])}"/></g>')
    return svg(vb, body), (x0, y0, x1, y1), b, k


woord_donker, wvak, _, wk = woordmerk(CREME, AMBER)
woord_licht, _, _, _ = woordmerk(NACHT, AMBER_OP_LICHT)


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
    os.makedirs(os.path.dirname(pad), exist_ok=True)
    with open(pad, 'w') as f:
        f.write(inhoud)
    return pad


schrijf('icoon/quiznote-icoon.svg', icoon)
schrijf('icoon/quiznote-icoon-vlak.svg', icoon_vlak)
schrijf('logo/quiznote-teken.svg', svg(TEKEN_VAK, teken(AMBER)))
schrijf('logo/quiznote-teken-zwart.svg', svg(TEKEN_VAK, teken('#000')))
schrijf('logo/quiznote-teken-wit.svg', svg(TEKEN_VAK, teken('#fff')))
schrijf('logo/quiznote-woordmerk-donker.svg', woord_donker)
schrijf('logo/quiznote-woordmerk-licht.svg', woord_licht)
schrijf('logo/quiznote-lockup-donker.svg', lockup(woord_donker))
schrijf('logo/quiznote-lockup-licht.svg', lockup(woord_licht))
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
os.makedirs(i('app'), exist_ok=True)
for maat in (16, 32, 128, 256, 512):
    png(i('icoon/quiznote-icoon.svg'), os.path.join(iconset, f'icon_{maat}x{maat}.png'), maat)
    png(i('icoon/quiznote-icoon.svg'), os.path.join(iconset, f'icon_{maat}x{maat}@2x.png'), maat * 2)
subprocess.run(['iconutil', '-c', 'icns', iconset, '-o', i('app/icon.icns')], check=True)
png(i('icoon/quiznote-icoon.svg'), i('app/icon.png'), 1024)
png(i('icoon/quiznote-icoon.svg'), i('icoon/quiznote-icoon-1024.png'), 1024)
ico_delen = []
for maat in (16, 24, 32, 48, 64, 128, 256):
    doel = os.path.join(tmp, f'ico-{maat}.png')
    png(i('icoon/quiznote-icoon-vlak.svg'), doel, maat)
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
w = 900
h = w * vb[3] / vb[2]
open(og, 'w').write(svg('0 0 1200 630', f'<rect width="1200" height="630" fill="#1a2131"/>\n  '
                                         f'<svg x="{(1200 - w) / 2:.1f}" y="{(630 - h) / 2:.1f}" width="{w}" height="{h:.1f}" '
                                         f'viewBox="{" ".join(f"{v:.1f}" for v in vb)}">{lock}'))
png(og, i('site/og-image.png'), 1200)
shutil.rmtree(tmp)

# De site gebruikt kopieën in public/: de favicons en de afbeelding voor gedeelde links in de root, en het icoon, de
# lockup en het woordmerk in public/brand.
for naam in ('favicon.svg', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'og-image.png'):
    shutil.copyfile(i(f'site/{naam}'), os.path.join(PUBLIC, naam))
os.makedirs(os.path.join(PUBLIC, 'brand'), exist_ok=True)
for pad in ('icoon/quiznote-icoon-vlak.svg', 'logo/quiznote-lockup-donker.svg', 'logo/quiznote-woordmerk-donker.svg'):
    shutil.copyfile(i(pad), os.path.join(PUBLIC, 'brand', os.path.basename(pad)))
print('klaar:', UIT)
