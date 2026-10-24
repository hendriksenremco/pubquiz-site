"""Woordmerk "quizmeister" als vormen: quiz in crème, meister in amber, de puntjes op de i in de andere kleur."""
import re
import subprocess
import sys

TOOL = '../tools/glyph.py'
SIZE, BASE, TRACK = 200, 200, '-0.035'
CREAM, AMBER = '#fff3df', '#ffa53d'


def split(text):
    out = subprocess.run([sys.executable, '-P', TOOL, '--text', text, '--size', str(SIZE), '--x', '0', '--y', str(BASE),
                          '--anchor', 'start', '--tracking', TRACK, '--split'], capture_output=True, text=True, check=True).stdout
    bbox = re.search(r'bbox x (\S+)–(\S+), y (\S+)–(\S+)', out).groups()
    return re.findall(r'<path id="g\d+" d="([^"]+)"/>', out), [float(v) for v in bbox]


def build(quiz, meister, dot_quiz, dot_meister):
    plain, _ = split('quızmeıster')
    dotted, (x0, x1, y0, y1) = split('quizmeister')  # de puntjes zijn het hoogste punt
    top = BASE - 528 * SIZE / 1000 - 6  # alles boven de x-hoogte is het puntje
    pad = 8
    vb = f'{x0 - pad:.0f} {y0 - pad:.0f} {x1 - x0 + 2 * pad:.0f} {y1 - y0 + 2 * pad:.0f}'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">
  <defs><clipPath id="dots"><rect x="-100" y="-100" width="4000" height="{top + 100:.1f}"/></clipPath></defs>
  <path fill="{quiz}" d="{' '.join(plain[:4])}"/>
  <path fill="{meister}" d="{' '.join(plain[4:])}"/>
  <g clip-path="url(#dots)"><path fill="{dot_quiz}" d="{dotted[2]}"/><path fill="{dot_meister}" d="{dotted[6]}"/></g>
</svg>
'''


open('wordmark-donker.svg', 'w').write(build(CREAM, AMBER, AMBER, CREAM))
open('wordmark-licht.svg', 'w').write(build('#0f1420', '#e8890f', '#e8890f', '#0f1420'))
print('ok')
