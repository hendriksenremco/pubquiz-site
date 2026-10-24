// Genereert de icoonschetsen voor Quizmeister als losse SVG's (1024×1024, macOS-raster).
import { readFileSync, writeFileSync } from 'node:fs'

const QM = 'M384 404 C384 304 446 246 516 246 C590 246 644 296 644 366 C644 430 602 458 566 482 C530 506 512 532 512 582 L512 604'

const wrap = ({ glow = [512, 512, 440, 0.4], defs = '', body }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232b3f"/><stop offset="1" stop-color="#0d121c"/></linearGradient>
    <radialGradient id="glow" cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffa53d" stop-opacity="${glow[3]}"/><stop offset=".4" stop-color="#ffa53d" stop-opacity="${glow[3] / 3}"/><stop offset="1" stop-color="#ffa53d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe2ad"/><stop offset=".45" stop-color="#ffa53d"/><stop offset="1" stop-color="#b85f08"/></linearGradient>
    <radialGradient id="bulb" cx=".42" cy=".38" r=".66"><stop offset="0" stop-color="#fffaf0"/><stop offset=".38" stop-color="#ffd596"/><stop offset="1" stop-color="#ff9b2c"/></radialGradient>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="24"/></filter>
    <filter id="drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".45"/></filter>
    <clipPath id="clip"><rect x="100" y="100" width="824" height="824" rx="185"/></clipPath>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000" flood-opacity=".35"/></filter>
    ${defs}
  </defs>
  <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#bg)" filter="url(#shadow)"/>
  <g clip-path="url(#clip)">
    <circle cx="${glow[0]}" cy="${glow[1]}" r="${glow[2]}" fill="url(#glow)"/>
    ${body}
  </g>
  <rect x="100.5" y="100.5" width="823" height="823" rx="184.5" fill="none" stroke="#fff" stroke-opacity=".07"/>
</svg>
`

const star = (cx, cy, n, r1, r2) => {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2
    const r = i % 2 ? r2 : r1
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

const G = JSON.parse(readFileSync('glyphs.json', 'utf8')).glyphs
// Zet een letter uit Bricolage Grotesque gecentreerd op (cx, cy) met de gegeven hoogte.
const glyph = (ch, cx, cy, h, attrs) => {
  const { d, bounds: [x0, y0, x1, y1] } = G[ch]
  const k = h / (y1 - y0)
  return `<path d="${d}" transform="translate(${cx - ((x0 + x1) / 2) * k} ${cy + ((y0 + y1) / 2) * k}) scale(${k} ${-k})" ${attrs}/>`
}

// Snor: een middellijn met een breedte die naar de punt toe afneemt, gespiegeld in x = 512.
const mustache = (color) => {
  const segs = [
    [[512, 616], [466, 582], [404, 638], [350, 642]],
    [[350, 642], [306, 645], [284, 610], [304, 582]],
  ]
  const bez = ([a, b, c, d], t) => {
    const u = 1 - t
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k])
  }
  const pts = segs.flatMap((seg, si) => Array.from({ length: 40 }, (_, i) => bez(seg, (i + (si ? 1 : 0)) / 40)))
  const n = pts.length
  const top = [], bottom = []
  pts.forEach((p, i) => {
    const q = pts[Math.min(i + 1, n - 1)], o = pts[Math.max(i - 1, 0)]
    const tx = q[0] - o[0], ty = q[1] - o[1], len = Math.hypot(tx, ty)
    const f = i / (n - 1)
    const w = 5 + 46 * Math.pow(1 - f, 1.1) * (0.72 + 0.28 * Math.min(1, f * 6))
    top.push([p[0] - (ty / len) * w, p[1] + (tx / len) * w])
    bottom.push([p[0] + (ty / len) * w, p[1] - (tx / len) * w])
  })
  const ring = [...top, ...bottom.reverse()]
  const d = (xs) => 'M' + xs.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + ' Z'
  const tip = pts[n - 1]
  return `<g fill="${color}"><path d="${d(ring)}"/><path d="${d(ring.map(([x, y]) => [1024 - x, y]))}"/>
    <circle cx="${tip[0]}" cy="${tip[1]}" r="5"/><circle cx="${1024 - tip[0]}" cy="${tip[1]}" r="5"/></g>`
}

const icons = {
  // 1. Monocle: de ring en het kettinkje vormen samen een Q.
  monocle: wrap({
    glow: [520, 560, 460, 0.42],
    defs: `<radialGradient id="lens" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#3b4a6b"/><stop offset=".6" stop-color="#1c2436"/><stop offset="1" stop-color="#121826"/></radialGradient>`,
    body: `
    <path d="M655 655 C705 715 645 790 705 850 C745 890 805 878 850 935" fill="none" stroke="url(#gold)" stroke-width="24" stroke-linecap="round" stroke-dasharray="0 33"/>
    <circle cx="637" cy="637" r="24" fill="none" stroke="#ffb860" stroke-width="15"/>
    <circle cx="470" cy="470" r="190" fill="url(#lens)"/>
    <circle cx="470" cy="470" r="190" fill="none" stroke="#9a4c05" stroke-width="68"/>
    <circle cx="470" cy="470" r="190" fill="none" stroke="url(#gold)" stroke-width="52"/>
    <path d="M338 422 A140 140 0 0 1 422 338" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="22" stroke-linecap="round"/>
    <circle cx="372" cy="470" r="11" fill="#fff" fill-opacity=".5"/>`,
  }),

  // 1b. Meneer Meister: monocle en snor, verder niets.
  gent: wrap({
    glow: [512, 560, 460, 0.4],
    defs: `<radialGradient id="lens" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#3b4a6b"/><stop offset=".6" stop-color="#1c2436"/><stop offset="1" stop-color="#121826"/></radialGradient>`,
    body: `
    <path d="M708 470 C740 530 700 600 748 660 C780 700 820 720 860 760" fill="none" stroke="url(#gold)" stroke-width="18" stroke-linecap="round" stroke-dasharray="0 26"/>
    <circle cx="616" cy="388" r="120" fill="url(#lens)"/>
    <circle cx="616" cy="388" r="120" fill="none" stroke="#9a4c05" stroke-width="48"/>
    <circle cx="616" cy="388" r="120" fill="none" stroke="url(#gold)" stroke-width="36"/>
    <path d="M532 358 A90 90 0 0 1 586 304" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="16" stroke-linecap="round"/>
    <circle cx="410" cy="388" r="34" fill="#e8ecf5"/>
    ${mustache('#f3e6d0')}`,
  }),

  // 2. Rozet: de prijs voor de winnaar, met een vraagteken in het hart.
  rosette: wrap({
    glow: [512, 430, 440, 0.4],
    defs: `<radialGradient id="pleat" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffd08a"/><stop offset=".6" stop-color="#ffa53d"/><stop offset="1" stop-color="#d9740d"/></radialGradient>`,
    body: `
    <g filter="url(#drop)">
      <path d="M440 560 L530 600 L450 880 L412 846 L356 862 Z" fill="#c9650a"/>
      <path d="M584 560 L494 600 L574 880 L612 846 L668 862 Z" fill="#e8800f"/>
      <polygon points="${star(512, 430, 30, 274, 246)}" fill="url(#pleat)"/>
    </g>
    <circle cx="512" cy="430" r="226" fill="none" stroke="#b85f08" stroke-opacity=".5" stroke-width="6"/>
    <circle cx="512" cy="430" r="190" fill="#fff3df"/>
    <circle cx="512" cy="430" r="166" fill="none" stroke="#ffa53d" stroke-width="10"/>
    ${glyph('?', 512, 432, 250, 'fill="#1a2131"')}`,
  }),


  // 4. Dirigeerstokje dat een vraagteken in de lucht tekent.
  baton: wrap({
    glow: [512, 470, 440, 0.32],
    defs: `<linearGradient id="trail" x1="0" y1="246" x2="0" y2="604" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffd596"/><stop offset="1" stop-color="#ffa53d"/></linearGradient>
    <radialGradient id="cork" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f3d3a4"/><stop offset="1" stop-color="#a86f34"/></radialGradient>`,
    body: `
    <path d="${QM}" fill="none" stroke="#ffa53d" stroke-opacity=".55" stroke-width="130" stroke-linecap="round" filter="url(#soft)"/>
    <path d="${QM}" fill="none" stroke="url(#trail)" stroke-width="70" stroke-linecap="round"/>
    <circle cx="512" cy="742" r="100" fill="#ffb24f" fill-opacity=".45" filter="url(#soft)"/>
    <circle cx="512" cy="742" r="50" fill="url(#bulb)"/>
    <g filter="url(#drop)" transform="translate(512 604) rotate(45)">
      <polygon points="0,-3.5 0,3.5 268,9 268,-9" fill="#f6f1e8"/>
      <rect x="262" y="-12" width="16" height="24" rx="4" fill="#cfd5e2"/>
      <path d="M276 -13 C304 -16 336 -30 364 -24 C392 -18 396 18 364 24 C336 30 304 16 276 13 Z" fill="url(#cork)"/>
    </g>
    <g stroke="#fff3df" stroke-width="10" stroke-linecap="round" stroke-opacity=".9">
      <path d="M470 640 L452 658"/><path d="M548 640 L566 658"/><path d="M509 652 L509 672"/>
    </g>`,
  }),

  // 5. Vragenkaarten: de kaarten die de app voor de quizmaster afdrukt.
  cards: wrap({
    glow: [512, 520, 440, 0.38],
    body: `
    <g filter="url(#drop)">
      <rect x="362" y="290" width="300" height="420" rx="30" fill="#3a4462" transform="rotate(-16 512 860)"/>
      <rect x="362" y="290" width="300" height="420" rx="30" fill="#ffa53d" transform="rotate(13 512 860)"/>
      <g transform="rotate(-3 512 860)">
        <rect x="362" y="290" width="300" height="420" rx="30" fill="#fff3df"/>
        <rect x="394" y="322" width="92" height="34" rx="17" fill="#ffa53d"/>
        ${glyph('?', 512, 492, 220, 'fill="#1a2131"')}
        <rect x="402" y="636" width="220" height="14" rx="7" fill="#1a2131" fill-opacity=".18"/>
        <rect x="402" y="664" width="150" height="14" rx="7" fill="#1a2131" fill-opacity=".18"/>
      </g>
    </g>`,
  }),

  // 6. Een Q in de spot: de letter als ster van de avond.
  spotq: wrap({
    glow: [512, 520, 420, 0.25],
    defs: `<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd596" stop-opacity=".55"/><stop offset="1" stop-color="#ffa53d" stop-opacity="0"/></linearGradient>
    <linearGradient id="ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#e9dcc6"/></linearGradient>`,
    body: `
    <polygon points="452,100 572,100 860,924 164,924" fill="url(#beam)"/>
    <ellipse cx="512" cy="800" rx="290" ry="56" fill="#ffa53d" fill-opacity=".28" filter="url(#soft)"/>
    ${glyph('Q', 512, 540, 600, 'fill="url(#ring)"')}
    <clipPath id="tail"><rect x="0" y="668" width="1024" height="356"/></clipPath>
    <g clip-path="url(#tail)">${glyph('Q', 512, 540, 600, 'fill="#ffa53d"')}</g>`,
  }),
}

for (const [name, svg] of Object.entries(icons)) writeFileSync(`${name}.svg`, svg)
console.log(Object.keys(icons).join(' '))
