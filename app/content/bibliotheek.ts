// De bibliotheek met vragenrondes (issue #100). bibliotheek.json maakt scripts/bibliotheek.mjs uit
// content/bibliotheek/; er staat alleen metadata in, nooit vragen of antwoorden.
import data from './bibliotheek.json'

export type Difficulty = 'makkelijk' | 'gemiddeld' | 'moeilijk'

export interface LibraryRound {
  slug: string
  title: string
  difficulty: Difficulty
  description: string
  questionCount: number
}

export interface LibraryTheme {
  slug: string
  name: string
  description: string
  rounds: LibraryRound[]
}

export const themes = data.themes as LibraryTheme[]

export function findRound(themeSlug: string, roundSlug: string) {
  const theme = themes.find((t) => t.slug === themeSlug)
  const round = theme?.rounds.find((r) => r.slug === roundSlug)
  return theme && round ? { theme, round } : undefined
}

export const libraryText = {
  eyebrow: 'Bibliotheek',
  title: 'Vragenrondes voor je pubquiz',
  lead: 'Kant-en-klare rondes, op thema. Open een ronde met één klik in QuizNote, pas aan wat je wilt en speel hem op de beamer.',
  metaTitle: 'Bibliotheek met pubquizrondes · QuizNote',
  metaDescription:
    'Kant-en-klare vragenrondes voor je pubquiz, op thema: aardrijkskunde, geschiedenis, sport, muziek, kerst en meer. Gratis te openen in QuizNote.',
  questions: (n: number) => (n === 1 ? '1 vraag' : `${n} vragen`),
  open: 'Openen in QuizNote',
  download: 'Downloaden',
  needsApp: 'Werkt met QuizNote 0.2.0 of nieuwer, op de Mac.',
  getApp: 'Nog geen QuizNote? Download de app',
  howTitle: 'Zo werkt het',
  how: [
    'Klik op Openen in QuizNote. De ronde komt in de quiz die open staat, of de app vraagt in welke.',
    'Of download het rondebestand en sleep het op de editor van QuizNote.',
    'De ronde staat daarna gewoon in je quiz. Pas de vragen aan zoals je wilt.'
  ],
  more: (theme: string) => `Meer rondes: ${theme}`,
  other: 'Andere rondes',
  back: 'Alle rondes'
}

/** De korte naam voor in de titel van een pagina, bijvoorbeeld "10 vragen, makkelijk". */
export function roundSummary(r: LibraryRound) {
  return `${libraryText.questions(r.questionCount)}, ${r.difficulty}`
}

export function roundFileUrl(site: string, theme: string, round: string) {
  return `${site}/bibliotheek/${theme}/${round}.quiznoteronde`
}

/** De link die QuizNote opent; de app haalt het bestand zelf op (alleen van https://quiznote.app). */
export function roundAppLink(site: string, theme: string, round: string) {
  return `quiznote://ronde?url=${encodeURIComponent(roundFileUrl(site, theme, round))}`
}
