#!/usr/bin/env node
// Controleert na `nuxt generate` dat er geen vraag of antwoord uit de bibliotheek in de site staat
// (issue #100): niet in de HTML, de payload, de JSON-LD, de sitemap of de JavaScript. Alleen de
// .quiznoteronde-bestanden mogen ze bevatten. Faalt de controle, dan faalt `pnpm generate`, en dus de deploy.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { readLibrary } from './bibliotheek.mjs'

const root = new URL('..', import.meta.url).pathname
const output = join(root, process.argv[2] || '.output/public')
const TEXT = new Set(['.html', '.json', '.js', '.mjs', '.css', '.xml', '.txt', '.webmanifest'])

/** Kleine letters, zonder accenten en met enkele spaties, zodat een andere schrijfwijze niet ontsnapt. */
function normalize(s) {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/&#39;|&#x27;|&apos;|\\u0027/g, "'")
    .replace(/&quot;|\\u0022/g, '"')
    .replace(/&amp;|\\u0026/g, '&')
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

// Antwoorden zonder lidwoord ("De Titanic" → "titanic"). Te korte of alleen cijfers (zoals "6" of "1989")
// slaan we over: die komen ook zomaar in code voor. Vragen zoeken we overal; antwoorden alleen in wat de
// bibliotheek zelf toont (de pagina's, hun payload en de metadata), want woorden als "vijf" of "Italië"
// staan ook gewoon in de teksten van de voorpagina.
function answerNeedle(answer) {
  const s = normalize(answer).replace(/^(de|het|een|om de) /, '')
  return s.length >= 4 && !/^[\d\s.,]+$/.test(s) ? s : null
}

const needles = []
for (const theme of readLibrary()) {
  for (const round of theme.rounds) {
    const where = `${theme.slug}/${round.slug}`
    round.questions.forEach((q, i) => {
      needles.push({ text: normalize(q.question), what: `vraag ${i + 1} van ${where}` })
      const a = answerNeedle(q.answer)
      if (a)
        needles.push({
          text: a,
          what: `antwoord ${i + 1} van ${where} ("${q.answer}")`,
          answer: true
        })
    })
  }
}

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* files(path)
    else if (TEXT.has(extname(name))) yield path
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const word = (text) => new RegExp(`(^|[^\\p{L}\\p{N}])${escape(text)}($|[^\\p{L}\\p{N}])`, 'u')
const leaks = []
let checked = 0

function check(name, raw, { answers }) {
  const content = normalize(raw)
  checked++
  for (const n of needles) {
    if (n.answer && !answers) continue
    if (n.answer ? word(n.text).test(content) : content.includes(n.text))
      leaks.push(`${name}: ${n.what}`)
  }
}

for (const file of files(output)) {
  const name = file.slice(output.length + 1)
  check(name, readFileSync(file, 'utf8'), { answers: name.startsWith('bibliotheek') })
}
// De metadata komt ook in de JavaScript van de site; daar zoeken we de antwoorden dus apart.
check(
  'app/content/bibliotheek.json',
  readFileSync(join(root, 'app/content/bibliotheek.json'), 'utf8'),
  {
    answers: true
  }
)

if (leaks.length) {
  console.error(
    `check-bibliotheek: ${leaks.length} keer staat er een vraag of antwoord in de site:`
  )
  for (const l of leaks) console.error(`  ${l}`)
  process.exit(1)
}
console.log(
  `check-bibliotheek: ${needles.length} vragen en antwoorden, ${checked} bestanden, niets gelekt`
)
