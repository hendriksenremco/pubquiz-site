// Ronde 3: dezelfde ideeën, maar plat. Effen kleuren, geen gloed, geen verlopen, geen schaduwen.
// Per icoon ook het teken zelf in één kleur (zwart en wit), om te toetsen of de vorm sterk genoeg is.
import { readFileSync, writeFileSync } from 'node:fs'

const NIGHT = '#0f1420'
const CREAM = '#fff3df'
const AMBER = '#ffa53d'

// Het pad van versie 8: qm waarvan de laatste poot van de m een vraagteken is.
const QM8 = readFileSync('../final/vraagteken.svg', 'utf8').match(/<path fill="url\(#cream\)" d="([^"]+)"/)[1]
// Plat leest de oude laatste poot als "r:": hij krulde niet terug. Hier buigt de boog naar binnen tot een kort steeltje,
// zoals bij een echt vraagteken; de punt staat eronder, op de basislijn.
const HOOK_OLD = 'Q700.8 315.4 726.2 315.4C764.8 315.4 812 352.6 812 423.5C812 474.2 786.7 469.1 786.7 507.1L786.7 513.4L712.1 513.4L712.1 475.9Q712.1 452.3 709.7 436.9Q707.3 421.5 701.7 414.2Q696.2 406.8 686.5 406.8'
const HOOK_NEW = 'Q700.8 315.4 726.2 315.4C772 315.4 822 352 822 420C822 478 776 492 761 520L760 546L690 546L690 530C690 492 740 484 740 446C740 420 716 406.8 686.5 406.8'
if (!QM8.includes(HOOK_OLD)) throw new Error('haakje niet gevonden')
const QMQ = QM8.replace(HOOK_OLD, HOOK_NEW)

const icon = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect x="100" y="100" width="824" height="824" rx="185" fill="${bg}"/>
  ${body}
</svg>
`
// Alleen het teken, ingezoomd, voor de toets in één kleur.
const mark = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="172 190 680 680">
  ${body}
</svg>
`

// Versie 1, geometrisch: stam, eerste boog, en een tweede boog die als vraagteken eindigt; de punt onder de basislijn
// houdt de staart van de q in evenwicht. `eye` bepaalt wat er in de bol van de q staat.
const geo = ({ ink, paper, eye }) => {
  const eyes = {
    look: `<circle cx="330" cy="467" r="62" fill="${paper}"/><circle cx="352" cy="448" r="27" fill="${ink}"/>`,
    wink: `<path d="M284 478 Q330 520 376 478" fill="none" stroke="${paper}" stroke-width="30" stroke-linecap="round"/>`,
  }
  return `<g fill="none" stroke="${ink}" stroke-width="82">
    <path d="M421 335V717.8M421 599V467A91 91 0 0 1 603 467V599"/>
    <path d="M603 599V467A91 91 0 0 1 785 467C785 528 694 524 694 586"/>
  </g>
  <circle cx="694" cy="676" r="47" fill="${ink}"/>
  <circle cx="330" cy="467" r="132" fill="${ink}"/>
  ${eyes[eye]}`
}

// Versie 2 en 8: de letters van versie 8, met een effen punt.
const qm8 = ({ q, m, dot, tilt = 0 }) => `<g transform="rotate(${tilt} 512 530)">
    <clipPath id="l"><rect x="0" y="0" width="488.1" height="1024"/></clipPath>
    <clipPath id="r"><rect x="488.1" y="0" width="600" height="1024"/></clipPath>
    <path clip-path="url(#r)" fill="${m}" d="${QMQ}"/>
    <path clip-path="url(#l)" fill="${q}" d="${QMQ}"/>
    <circle cx="725" cy="614" r="42" fill="${dot}"/>
  </g>`

const out = {
  nieuwsgierig: icon(AMBER, geo({ ink: NIGHT, paper: CREAM, eye: 'look' })),
  knipoog: icon(AMBER, geo({ ink: NIGHT, paper: CREAM, eye: 'wink' })),
  'vraagteken-m': icon(NIGHT, qm8({ q: CREAM, m: AMBER, dot: AMBER })),
  schuin: icon(NIGHT, qm8({ q: CREAM, m: CREAM, dot: AMBER, tilt: -6 })),
}
for (const [ink, paper, suffix] of [['#000', '#fff', 'zwart'], ['#fff', '#000', 'wit']]) {
  out[`nieuwsgierig-${suffix}`] = mark(geo({ ink, paper, eye: 'look' }))
  out[`knipoog-${suffix}`] = mark(geo({ ink, paper, eye: 'wink' }))
  out[`vraagteken-m-${suffix}`] = mark(qm8({ q: ink, m: ink, dot: ink }))
  out[`schuin-${suffix}`] = mark(qm8({ q: ink, m: ink, dot: ink, tilt: -6 }))
}
for (const [name, svg] of Object.entries(out)) writeFileSync(`${name}.svg`, svg)
console.log(Object.keys(out).length + ' bestanden')
