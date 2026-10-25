#!/usr/bin/env python3
"""Schetsen voor het QuizNote-icoon en -woordmerk (ronde 1).

Draaien vanuit deze map:  python3 -P schets.py
Nodig: fontTools, hb-shape en rsvg-convert. Het font komt uit ../../quizmeister/bron.

Alles is plat: effen kleuren, geen gloed, verlopen of schaduwen. Elk teken staat ook in één kleur op 64, 32 en 16 px.
"""
import json
import math
import os
import re
import subprocess
import tempfile

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.ttLib import TTFont

HIER = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HIER, '..', '..', 'quizmeister', 'bron', 'BricolageGrotesque.woff2')

NACHT = '#0f1420'
CREME = '#fff3df'
AMBER = '#ffa53d'
AMBER_OP_LICHT = '#e07b0c'

font = TTFont(FONT)
font.flavor = None
tmp = tempfile.mkdtemp()
ttf = os.path.join(tmp, 'BricolageGrotesque.ttf')
font.save(ttf)  # standaardstand van het variabele font: wght 800, wdth 100, opsz 96
gs = font.getGlyphSet()
upm = font['head'].unitsPerEm
XH = font['OS/2'].sxHeight

getal = lambda v: f'{v:.1f}'.rstrip('0').rstrip('.')


def glyph(naam, contouren=None):
    """Glyph-omtrek in fonteenheden (y omhoog); optioneel alleen de genoemde contouren."""
    if contouren is None:
        pen = SVGPathPen(gs, getal)
        gs[naam].draw(pen)
        return pen.getCommands()
    rec = RecordingPen()
    gs[naam].draw(rec)
    delen, huidig = [], []
    for op, args in rec.value:
        huidig.append((op, args))
        if op in ('closePath', 'endPath'):
            delen.append(huidig)
            huidig = []
    pen = SVGPathPen(gs, getal)
    for i in contouren:
        for op, args in delen[i]:
            getattr(pen, op)(*args)
    return pen.getCommands()


# --- De tekens, in fonteenheden met y omhoog ---------------------------------------------------------------------
# Elk teken is een functie (voorgrond, achtergrond) -> SVG-elementen, plus de omtrekken (x0, y0, x1, y1).

VRAAG_HAAK = glyph('question', [0])  # het vraagteken zonder punt; de steel eindigt op y=209, x 84..215
KOP = dict(rx=165, ry=115, hoek=20)  # nootkop: schuine ellips, rechterkant gelijk met de steel


def nootkop_midden():
    rx, ry, a = KOP['rx'], KOP['ry'], math.radians(KOP['hoek'])
    breed = math.sqrt((rx * math.cos(a)) ** 2 + (ry * math.sin(a)) ** 2)
    hoog = math.sqrt((rx * math.sin(a)) ** 2 + (ry * math.cos(a)) ** 2)
    return 215 - breed, -13 + hoog, breed, hoog  # onderkant op de onderkant van de oude punt


def rechterpunt_y():
    """Hoogte van het meest rechtse punt van de nootkop: daar sluit de steel aan zonder hoekje."""
    rx, ry, a = KOP['rx'], KOP['ry'], math.radians(KOP['hoek'])
    cx, cy, _, _ = nootkop_midden()
    t = math.atan2(-ry * math.sin(a), rx * math.cos(a))
    return cy + rx * math.cos(t) * math.sin(a) + ry * math.sin(t) * math.cos(a)


def noot_vraagteken(vg, ag):
    cx, cy, _, _ = nootkop_midden()
    return (f'<path fill="{vg}" d="{VRAAG_HAAK}"/>'
            f'<rect fill="{vg}" x="84" y="{rechterpunt_y():.1f}" width="131" height="{211 - rechterpunt_y():.1f}"/>'
            f'<ellipse fill="{vg}" cx="{cx:.1f}" cy="{cy:.1f}" rx="{KOP["rx"]}" ry="{KOP["ry"]}" transform="rotate({KOP["hoek"]} {cx:.1f} {cy:.1f})"/>')


def q_staart(vg, ag):
    return f'<path fill="{vg}" d="{GROTE_Q}"/>'


GROTE_Q = glyph('Q')


def open_noot(vg, ag):
    cx, cy, _, _ = nootkop_midden()
    return (f'<path fill="{vg}" d="{VRAAG_HAAK}"/>'
            f'<rect fill="{vg}" x="84" y="{cy + 40:.1f}" width="131" height="{209 - cy - 38:.1f}"/>'
            f'<ellipse fill="{vg}" cx="{cx:.1f}" cy="{cy:.1f}" rx="{KOP["rx"]}" ry="{KOP["ry"]}" transform="rotate({KOP["hoek"]} {cx:.1f} {cy:.1f})"/>'
            f'<ellipse fill="{ag}" cx="{cx - 4:.1f}" cy="{cy:.1f}" rx="92" ry="50" transform="rotate(35 {cx - 4:.1f} {cy:.1f})"/>')


def bounds_noot():
    cx, _, breed, _ = nootkop_midden()
    return (cx - breed, -13, 386, 676)


Q = glyph('q')  # steel x 376..538, onderkant y=-148


def q_noot(vg, ag):
    # Een vlaggetje aan de onderkant van de steel, zoals bij een achtste noot met de steel omlaag: naar rechts en omhoog.
    vlag = ('M528 -148 L538 -148 C610 -128 720 -64 722 52 C723 104 704 146 676 182 '
            'C688 128 690 84 668 40 C640 -14 590 -40 538 -48 L528 -48 Z')
    return f'<path fill="{vg}" d="{Q}"/><path fill="{vg}" d="{vlag}"/>'


TEKENS = [
    ('noot-vraagteken', 'Noot-vraagteken', noot_vraagteken, bounds_noot()),
    ('q-noot', 'q-noot', q_noot, (22, -148, 722, 542)),
    ('q-staart', 'Q uit het woordmerk', q_staart, (27, -177, 632, 674)),
]


def geplaatst(fn, vak, vg, ag, x, y, maat, vulling=0.62):
    """Het teken optisch gecentreerd in een vierkant van `maat`, op (x, y), met y omlaag."""
    x0, y0, x1, y1 = vak
    k = maat * vulling / max(x1 - x0, y1 - y0)
    tx = x + maat / 2 - (x0 + x1) / 2 * k
    ty = y + maat / 2 + (y0 + y1) / 2 * k
    return f'<g transform="matrix({k:.4f} 0 0 {-k:.4f} {tx:.2f} {ty:.2f})">{fn(vg, ag)}</g>'


def squircle(x, y, w, h, r, s=0.6):
    """Afgeronde rechthoek met doorlopende hoeken, zoals de iconen van macOS (zelfde vorm als in maak.py)."""
    p = (1 + s) * r
    boog = 90 * (1 - s)
    lengte = math.sin(math.radians(boog / 2)) * r * math.sqrt(2)
    alfa = (90 - boog) / 2
    p3p4 = r * math.tan(math.radians(alfa / 2))
    beta = 45 * s
    c = p3p4 * math.cos(math.radians(beta))
    d = c * math.tan(math.radians(beta))
    b = (p - lengte - c - d) / 3
    a = 2 * b
    f = getal
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


def icoon(fn, vak, x=0, y=0, maat=1024):
    """macOS-icoon: nachtblauw vlak (824 van 1024) met het teken in amber."""
    k = maat / 1024
    vlak = squircle(x + 100 * k, y + 100 * k, 824 * k, 824 * k, 185.4 * k)
    return f'<path fill="{NACHT}" d="{vlak}"/>' + geplaatst(fn, vak, AMBER, NACHT, x + 100 * k, y + 100 * k, 824 * k)


def svg(breedte, hoogte, body, viewbox=None):
    vb = viewbox or f'0 0 {breedte} {hoogte}'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{breedte}" height="{hoogte}" viewBox="{vb}">\n{body}\n</svg>\n'


# --- Woordmerk ---------------------------------------------------------------------------------------------------

def woordmerk(kleur_quiz, kleur_note, kleur_punt, maat=200, spatie=-0.02):
    """QuizNote: Quiz en Note in twee kleuren; het puntje op de i in de kleur van Note. Geeft (body, vak)."""
    uit = subprocess.run(['hb-shape', '--output-format=json', ttf, 'QuizNote'], capture_output=True, text=True, check=True).stdout
    k = maat / upm
    x = 0.0
    quiz, note, punt = [], [], []
    for i, g in enumerate(json.loads(uit)):
        naam = g['g']
        pen = SVGPathPen(gs, getal)
        from fontTools.pens.transformPen import TransformPen
        lichaam = 'dotlessi' if naam == 'i' else naam
        gs[lichaam].draw(TransformPen(pen, (k, 0, 0, -k, x + g.get('dx', 0) * k, 0)))
        (quiz if g['cl'] < 4 else note).append(pen.getCommands())
        if naam == 'i':
            pen = SVGPathPen(gs, getal)
            gs['i'].draw(TransformPen(pen, (k, 0, 0, -k, x + g.get('dx', 0) * k, 0)))
            punt.append(pen.getCommands())
        x += g['ax'] * k + spatie * maat
    boven = -XH * k - 6
    body = (f'<defs><clipPath id="p{kleur_quiz[1:]}"><rect x="-50" y="-400" width="3000" height="{400 + boven:.1f}"/></clipPath></defs>'
            f'<path fill="{kleur_quiz}" d="{" ".join(quiz)}"/><path fill="{kleur_note}" d="{" ".join(note)}"/>'
            f'<g clip-path="url(#p{kleur_quiz[1:]})"><path fill="{kleur_punt}" d="{" ".join(punt)}"/></g>')
    return body, (0, -0.68 * maat, x - spatie * maat, 0.02 * maat)


# --- Overzicht ---------------------------------------------------------------------------------------------------

PAPIER = '#e7e3da'
TEKST = '#3a3f4b'


def label(x, y, tekst, maat=15, kleur=TEKST, gewicht=600):
    return f'<text x="{x}" y="{y}" font-family="Helvetica, Arial, sans-serif" font-size="{maat}" font-weight="{gewicht}" fill="{kleur}">{tekst}</text>'


def overzicht():
    B, rij = 1380, 300
    delen = [f'<rect width="{B}" height="{len(TEKENS) * rij + 470}" fill="{PAPIER}"/>']
    delen.append(label(40, 44, 'QuizNote — icoon, ronde 1', 24, NACHT, 700))
    delen.append(label(40, 70, 'Plat en in één kleur. Rechts: het teken los in zwart en wit, en het icoon op 32 en 16 px.', 14))
    y = 100
    for _, titel, fn, vak in TEKENS:
        delen.append(label(40, y + 18, titel, 17, NACHT, 700))
        delen.append(icoon(fn, vak, 30, y + 26, 256))
        x = 330
        for vg, ag in (('#000', '#fff'), ('#fff', '#000')):
            for m in (128, 64, 32, 16):
                delen.append(f'<rect x="{x}" y="{y + 90}" width="{m}" height="{m}" fill="{ag}"/>')
                delen.append(geplaatst(fn, vak, vg, ag, x, y + 90, m, 0.8))
                x += m + 18
            x += 20
        for m in (64, 32, 16):
            delen.append(icoon(fn, vak, x, y + 90, m))
            x += m + 16
        y += rij
    # Woordmerk en lockup
    delen.append(label(40, y + 18, 'Woordmerk', 17, NACHT, 700))
    donker, vak = woordmerk(CREME, AMBER, AMBER)
    licht, _ = woordmerk(NACHT, AMBER_OP_LICHT, AMBER_OP_LICHT)
    breed = vak[2] - vak[0]
    delen.append(f'<rect x="30" y="{y + 30}" width="640" height="170" rx="18" fill="{NACHT}"/>')
    k = 520 / breed
    delen.append(f'<g transform="translate(90 {y + 150}) scale({k:.4f})">{donker}</g>')
    delen.append(f'<rect x="700" y="{y + 30}" width="640" height="170" rx="18" fill="#fff"/>')
    delen.append(f'<g transform="translate(760 {y + 150}) scale({k:.4f})">{licht}</g>')
    y += 230
    delen.append(label(40, y + 18, 'Lockup (met het eerste teken)', 17, NACHT, 700))
    delen.append(f'<rect x="30" y="{y + 30}" width="640" height="150" rx="18" fill="#1a2131"/>')
    delen.append(icoon(TEKENS[0][2], TEKENS[0][3], 60, y + 45, 120))
    k2 = 400 / breed
    delen.append(f'<g transform="translate(200 {y + 130}) scale({k2:.4f})">{donker}</g>')
    return svg(B, y + 210, '\n'.join(delen))


if __name__ == '__main__':
    for slug, _, fn, vak in TEKENS:
        open(os.path.join(HIER, f'{slug}.svg'), 'w').write(svg(1024, 1024, icoon(fn, vak)))
        for naam, vg, ag in (('zwart', '#000', '#fff'), ('wit', '#fff', '#000')):
            open(os.path.join(HIER, f'{slug}-{naam}.svg'), 'w').write(
                svg(1024, 1024, f'<rect width="1024" height="1024" fill="{ag}"/>' + geplaatst(fn, vak, vg, ag, 0, 0, 1024, 0.8)))
    donker, vak = woordmerk(CREME, AMBER, AMBER)
    licht, _ = woordmerk(NACHT, AMBER_OP_LICHT, AMBER_OP_LICHT)
    vb = f'{vak[0] - 8:.1f} {vak[1] - 8:.1f} {vak[2] - vak[0] + 16:.1f} {vak[3] - vak[1] + 16:.1f}'
    w, h = vak[2] - vak[0] + 16, vak[3] - vak[1] + 16
    open(os.path.join(HIER, 'woordmerk-donker.svg'), 'w').write(svg(round(w), round(h), donker, vb))
    open(os.path.join(HIER, 'woordmerk-licht.svg'), 'w').write(svg(round(w), round(h), licht, vb))
    open(os.path.join(HIER, 'overzicht.svg'), 'w').write(overzicht())
    subprocess.run(['rsvg-convert', os.path.join(HIER, 'overzicht.svg'), '-o', os.path.join(HIER, 'overzicht.png')], check=True)
    print('klaar:', HIER)
