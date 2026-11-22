#!/usr/bin/env node
// Bouwt de bibliotheek met vragenrondes (issue #100) uit content/bibliotheek/:
//   - public/bibliotheek/<thema>/<ronde>.quiznoteronde: de rondebestanden voor de app (een zip met ronde.json);
//   - app/content/bibliotheek.json: alleen de metadata voor de pagina's (titel, thema, aantal vragen,
//     moeilijkheid, beschrijving). Nooit vragen of antwoorden: die mogen niet in de site komen.
//   - de URL's van de pagina's in public/sitemap.xml, tussen de markeringen.
// Draait vóór `nuxt generate`; scripts/check-bibliotheek.mjs controleert daarna dat er niets lekt.
// Het formaat van het rondebestand staat in ../pubquiz/docs/rondebestand.md.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { deflateRawSync } from 'node:zlib'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'content/bibliotheek')
const out = join(root, 'public/bibliotheek')
const meta = join(root, 'app/content/bibliotheek.json')
const sitemap = join(root, 'public/sitemap.xml')
const site = process.env.NUXT_PUBLIC_SITE_URL || 'https://quiznote.app'

export const DIFFICULTIES = ['makkelijk', 'gemiddeld', 'moeilijk']
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/

function fail(message) {
  console.error(`bibliotheek: ${message}`)
  process.exit(1)
}

function text(value, where, { min = 1, max = 500 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min || value.length > max) {
    fail(`${where} moet tekst zijn van ${min} tot ${max} tekens`)
  }
  return value.trim()
}

/** Leest en controleert alle thema's en rondes. */
export function readLibrary() {
  const themes = JSON.parse(readFileSync(join(source, 'themas.json'), 'utf8'))
  const seen = new Set()
  return themes.map((t) => {
    if (!SLUG.test(t.slug) || seen.has(t.slug)) fail(`thema-slug "${t.slug}" is ongeldig of dubbel`)
    seen.add(t.slug)
    const dir = join(source, t.slug)
    const files = existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith('.json'))
          .sort()
      : []
    const rounds = files.map((file) => {
      const slug = file.replace(/\.json$/, '')
      const where = `${t.slug}/${file}`
      if (!SLUG.test(slug)) fail(`${where}: de bestandsnaam is geen geldige slug`)
      const r = JSON.parse(readFileSync(join(dir, file), 'utf8'))
      if (!DIFFICULTIES.includes(r.difficulty))
        fail(`${where}: moeilijkheid moet ${DIFFICULTIES.join(', ')} zijn`)
      if (!Array.isArray(r.questions) || r.questions.length === 0) fail(`${where}: geen vragen`)
      return {
        slug,
        title: text(r.title, `${where}: title`, { max: 60 }),
        difficulty: r.difficulty,
        description: text(r.description, `${where}: description`, { min: 50, max: 160 }),
        questions: r.questions.map((q, i) => ({
          question: text(q.question, `${where}: vraag ${i + 1}`),
          answer: text(q.answer, `${where}: antwoord ${i + 1}`, { max: 200 })
        }))
      }
    })
    return {
      slug: t.slug,
      name: text(t.name, `thema ${t.slug}: name`, { max: 40 }),
      description: text(t.description, `thema ${t.slug}: description`, { max: 120 }),
      rounds
    }
  })
}

// --- Een kleine zip-schrijver: alleen deflate, vaste datum, zodat dezelfde ronde altijd dezelfde bytes geeft.

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

const DOS_TIME = 0
const DOS_DATE = (0 << 9) | (1 << 5) | 1 // 1 januari 1980

export function zip(files) {
  const parts = []
  const central = []
  let offset = 0
  for (const { name, data } of files) {
    const nameBuf = Buffer.from(name, 'utf8')
    const packed = deflateRawSync(data, { level: 9 })
    const crc = crc32(data)
    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x800, 6) // namen in UTF-8
    local.writeUInt16LE(8, 8)
    local.writeUInt16LE(DOS_TIME, 10)
    local.writeUInt16LE(DOS_DATE, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(packed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(nameBuf.length, 26)
    parts.push(local, nameBuf, packed)

    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014b50, 0)
    entry.writeUInt16LE(20, 4)
    entry.writeUInt16LE(20, 6)
    entry.writeUInt16LE(0x800, 8)
    entry.writeUInt16LE(8, 10)
    entry.writeUInt16LE(DOS_TIME, 12)
    entry.writeUInt16LE(DOS_DATE, 14)
    entry.writeUInt32LE(crc, 16)
    entry.writeUInt32LE(packed.length, 20)
    entry.writeUInt32LE(data.length, 24)
    entry.writeUInt16LE(nameBuf.length, 28)
    entry.writeUInt32LE(offset, 42)
    central.push(entry, nameBuf)
    offset += local.length + nameBuf.length + packed.length
  }
  const dir = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(dir.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...parts, dir, end])
}

/** De inhoud van ronde.json voor één ronde. */
export function roundJson(round) {
  return {
    formatVersion: 1,
    type: 'questions',
    title: round.title,
    notes: `Uit de bibliotheek op ${site.replace(/^https?:\/\//, '')}`,
    questions: round.questions
  }
}

function build() {
  const library = readLibrary()

  rmSync(out, { recursive: true, force: true })
  for (const theme of library) {
    for (const round of theme.rounds) {
      const json = JSON.stringify(roundJson(round), null, 2) + '\n'
      const file = join(out, theme.slug, `${round.slug}.quiznoteronde`)
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, zip([{ name: 'ronde.json', data: Buffer.from(json, 'utf8') }]))
    }
  }

  // Alleen metadata naar de site. Geen vragen, geen antwoorden.
  const pages = {
    themes: library
      .filter((t) => t.rounds.length > 0)
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        description: t.description,
        rounds: t.rounds.map((r) => ({
          slug: r.slug,
          title: r.title,
          difficulty: r.difficulty,
          description: r.description,
          questionCount: r.questions.length
        }))
      }))
  }
  writeFileSync(meta, JSON.stringify(pages, null, 2) + '\n')

  // De pagina's in de sitemap, tussen de markeringen.
  const urls = [`${site}/bibliotheek`]
  for (const t of pages.themes)
    for (const r of t.rounds) urls.push(`${site}/bibliotheek/${t.slug}/${r.slug}`)
  const block = urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`).join('\n')
  const xml = readFileSync(sitemap, 'utf8')
  const re = /( *<!-- bibliotheek:begin[^>]*-->\n)[\s\S]*?( *<!-- bibliotheek:end -->)/
  if (!re.test(xml))
    fail('public/sitemap.xml mist de markeringen bibliotheek:begin en bibliotheek:end')
  writeFileSync(sitemap, xml.replace(re, `$1${block}\n$2`))

  const count = pages.themes.reduce((n, t) => n + t.rounds.length, 0)
  console.log(`bibliotheek: ${pages.themes.length} thema's, ${count} rondes`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) build()
