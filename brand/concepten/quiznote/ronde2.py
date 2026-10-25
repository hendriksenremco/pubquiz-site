#!/usr/bin/env python3
"""Ronde 2: alleen de Q uit het woordmerk, in een paar kleuren en maten.

Draaien vanuit deze map:  python3 -P ronde2.py   (gebruikt de hulpfuncties uit schets.py)
"""
import os
import subprocess
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HIER)
from schets import (AMBER, AMBER_OP_LICHT, CREME, NACHT, PAPIER, geplaatst, label, q_staart, squircle, svg,
                    woordmerk)

Q_VAK = (27, -177, 632, 674)

VARIANTEN = [
    ('q-amber', 'Amber op nachtblauw', AMBER, NACHT, 0.62),
    ('q-amber-groot', 'Amber op nachtblauw, groter', AMBER, NACHT, 0.72),
    ('q-creme', 'Crème op nachtblauw', CREME, NACHT, 0.62),
    ('q-nacht-op-amber', 'Nachtblauw op amber', NACHT, AMBER, 0.62),
]


def icoon(vg, ag, vulling, x=0, y=0, maat=1024):
    k = maat / 1024
    vlak = squircle(x + 100 * k, y + 100 * k, 824 * k, 824 * k, 185.4 * k)
    return f'<path fill="{ag}" d="{vlak}"/>' + geplaatst(q_staart, Q_VAK, vg, ag, x + 100 * k, y + 100 * k, 824 * k, vulling)


def overzicht():
    B = 1380
    delen = [f'<rect width="{B}" height="2000" fill="{PAPIER}"/>',
             label(40, 44, 'QuizNote — de Q, ronde 2', 24, NACHT, 700),
             label(40, 70, 'Zelfde Q, verschillende kleuren en maten. Rechts: het icoon op 64, 32 en 16 px.', 14)]
    x0, y = 30, 100
    for i, (_, titel, vg, ag, vulling) in enumerate(VARIANTEN):
        x = x0 + (i % 2) * 680
        if i % 2 == 0 and i:
            y += 330
        delen.append(label(x + 10, y + 18, titel, 17, NACHT, 700))
        delen.append(icoon(vg, ag, vulling, x, y + 26, 280))
        kx = x + 300
        for m in (64, 32, 16):
            delen.append(icoon(vg, ag, vulling, kx, y + 120, m))
            kx += m + 18
    y += 340
    # Lockup met de eerste variant, donker en licht
    donker, vak = woordmerk(CREME, AMBER, AMBER)
    licht, _ = woordmerk(NACHT, AMBER_OP_LICHT, AMBER_OP_LICHT)
    breed = vak[2] - vak[0]
    delen.append(label(40, y + 18, 'Lockup', 17, NACHT, 700))
    for i, (achter, woord) in enumerate((('#1a2131', donker), ('#ffffff', licht))):
        x = 30 + i * 680
        delen.append(f'<rect x="{x}" y="{y + 30}" width="640" height="160" rx="18" fill="{achter}"/>')
        delen.append(icoon(AMBER, NACHT, 0.62, x + 26, y + 46, 128))
        delen.append(f'<g transform="translate({x + 170} {y + 140}) scale({420 / breed:.4f})">{woord}</g>')
    hoogte = y + 220
    return svg(B, hoogte, '\n'.join(delen).replace('height="2000"', f'height="{hoogte}"', 1))


if __name__ == '__main__':
    for slug, _, vg, ag, vulling in VARIANTEN:
        open(os.path.join(HIER, f'{slug}.svg'), 'w').write(svg(1024, 1024, icoon(vg, ag, vulling)))
    open(os.path.join(HIER, 'ronde2.svg'), 'w').write(overzicht())
    subprocess.run(['rsvg-convert', os.path.join(HIER, 'ronde2.svg'), '-o', os.path.join(HIER, 'ronde2.png')], check=True)
    print('klaar:', HIER)
