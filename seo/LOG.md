# SEO-logboek quiznote.app

Elke nacht één entry: meten, één verbetering, resultaat. Nieuwste onderaan.

## Vaste zoekopdrachten

Houd deze lijst gelijk; voeg alleen toe, met een reden.

1. QuizNote
2. QuizNote app
3. pubquiz app mac
4. pubquiz maken
5. pubquiz software
6. quiz night software mac

Let op: de zoektool van de nachtelijke taak is een webzoekmachine (VS), geen echte Google-ranking. Een echte meting komt pas met Google Search Console (moet Remco instellen).

---

## 2026-11-01

**PostHog** (project 328999, testaccounts uitgefilterd). Eerste meting: tracking staat sinds 31 oktober aan, dus 24 uur ≈ 7 dagen.

| | 24 uur | 7 dagen |
|---|---|---|
| Bezoekers | 46 | 46 |
| Pageviews | 52 | 52 |
| Bouncerate | 61% | 61% |
| Gem. sessieduur | 53 s | 53 s |
| Bezoekers via Google | 0 | 0 |

Pagina's (7 dagen, bezoekers): `/` 15 · `/en` 13 · `/privacy` 7 · `/en/privacy` 6 · `/200` 6 · `/404` 2.
Verwijzers: direct 40, quiznote.app 4, quiznote-4c3e8.web.app 2. Geen zoekmachines.

**Zoekresultaten:** quiznote.app staat bij geen van de 6 zoekopdrachten in de resultaten. Bij "QuizNote" staan andere producten met (bijna) dezelfde naam bovenaan (QuizNotes AI, een devpost-project, Quiz Notes-nieuwsbrief). De site is pas een paar dagen live en waarschijnlijk nog niet geïndexeerd.

**PageSpeed Insights:** niet bereikbaar vanuit de nachtelijke taak (de URL vraagt om toestemming). Overgeslagen.

**Technische check** (`pnpm generate`, .output/public):
- Titel, meta description, canonical, hreflang (nl, nl-NL, en, x-default), og:url, og:locale, Open Graph-afbeelding 1200×630 en twitter:card: in orde op `/` en `/en`.
- Structured data: `SoftwareApplication` op `/` en `/en`. Geen prijs/offers (nog niet besloten).
- Eén h1 per pagina, h2's logisch. Alle afbeeldingen hebben alt (alleen het decoratieve downloadicoon heeft `alt=""`, terecht).
- robots.txt en sitemap.xml (4 URL's met hreflang) in orde. Geen kapotte interne links.
- Screenshots 52–72 KB (WebP), prima.
- Kleine punten: `og:locale` voor Engels is `en` (zou `en_GB`/`en_US` moeten zijn); `/200` en `/404` geven status 200 (Firebase `cleanUrls`) zonder noindex; de privacypagina's hebben geen og:title/og:image. `quiznote-4c3e8.web.app` is ook bereikbaar, maar heeft canonical naar quiznote.app: in orde.
- Grootste gat: het woord "pubquiz" stond niet in de titel of description, en maar één keer in de tekst. Mensen zoeken op "pubquiz maken" en "pubquiz software", niet op "quizavond".

**Verbetering:** titel en description op `/` en `/en` bevatten nu "pubquiz" / "pub quiz".
- NL: "QuizNote · pubquiz maken en presenteren op je Mac" / "Maak je pubquiz met QuizNote en speel hem af vanaf één Mac: vragen, muziekfragmenten en antwoorden op beamer, tv's en speakers."
- EN: "QuizNote · make and run your pub quiz on a Mac" / "Make your pub quiz with QuizNote and run it from one Mac: questions, music clips and answers on projector, TVs and speakers."

**Volgende ideeën:** Google Search Console (Remco: domein verifiëren, sitemap indienen); og:locale en noindex op /200 en /404; "pubquiz" ook in de lopende tekst.

---

## 2026-11-02

**PostHog** (project 328999). Overzicht met testaccounts uitgefilterd; pagina's en verwijzers zonder filter.

| | 24 uur | 7 dagen | gisteren (7 d) |
|---|---|---|---|
| Bezoekers | 45 | 91 | 46 |
| Pageviews | 61 | 113 | 52 |
| Bouncerate | 62% | 62% | 61% |
| Gem. sessieduur | 19 s | 36 s | 53 s |
| Bezoekers via Google | 0 | 0 | 0 |

Pagina's (7 dagen, bezoekers): `/` 34 · `/en` 29 · `/voorwaarden` 12 (nieuw) · `/privacy` 10 · `/en/voorwaarden` 7 · `/en/privacy` 7 · `/200` 6 · `/404` 2.
Verwijzers (7 dagen): direct 74, quiznote.app 12, quiznote-4c3e8.web.app 4, **bing.com 1** (eerste bezoek via een zoekmachine). Geen Google.

**Zoekresultaten:** quiznote.app staat nog bij geen van de 6 zoekopdrachten. Zelfde beeld als gisteren: bij "QuizNote" en "QuizNote app" staan andere producten (QuizNotes AI, devpost, Quiz Notes-nieuwsbrief); bij "pubquiz software" en "quiz night software mac" vooral Quizado, KwizzBit en lijstjessites ("best pub quiz software"); bij "pubquiz maken" artikelen (id.nl over PowerPoint, AhaSlides, Amnesty).

**PageSpeed Insights:** opnieuw niet bereikbaar (URL vraagt om toestemming die in een nachtelijke run niemand geeft). Overgeslagen.

**Technische check** (`pnpm generate`):
- Titel, description, canonical, hreflang, og:image en `SoftwareApplication` op `/` en `/en`: in orde. Voorwaarden-pagina's (nieuw) hebben titel, description, canonical en hreflang en staan in de sitemap.
- Nog open van gisteren: `og:locale` op Engels is `en` (beter `en_GB`); `/200` en `/404` geven status 200 zonder noindex (oplossing: `X-Robots-Tag: noindex` in `firebase.json`); privacy- en voorwaardenpagina's zonder og:title/og:image.
- Lopende tekst: "pubquiz" kwam op `/` maar 2 keer voor (324 woorden), niet in de h1.

**Verbetering:** de h1 bevat nu het zoekwoord.
- NL: "De hele quizavond vanaf één laptop" → "De hele pubquiz vanaf één laptop".
- EN: "Run the whole quiz night from one laptop" → "Run the whole pub quiz from one laptop".

**Volgende ideeën:** noindex-header op `/200` en `/404` plus `og:locale` `en_GB`; Google Search Console (Remco); vermelding op lijstjes/vergelijkingssites voor backlinks (Remco).

---

## 2026-11-03

**PostHog** (project 328999). Overzicht met testaccounts uitgefilterd; pagina's en verwijzers zonder filter.

| | 24 uur | 7 dagen | gisteren (24 u / 7 d) |
|---|---|---|---|
| Bezoekers | 21 | 112 | 45 / 91 |
| Pageviews | 29 | 142 | 61 / 113 |
| Bouncerate | 43% | 58% | 62% / 62% |
| Gem. sessieduur | 127 s | 53 s | 19 s / 36 s |
| Bezoekers via Google | 0 | 0 | 0 / 0 |

Pagina's (7 dagen, bezoekers): `/` 46 · `/en` 37 · `/voorwaarden` 13 · `/privacy` 11 · `/en/privacy` 8 · `/en/voorwaarden` 7 · `/200` 6 · `/404` 6.
Verwijzers (7 dagen): direct 95, quiznote.app 12, quiznote-4c3e8.web.app 4, bing.com 1. Geen Google. Minder bezoekers in 24 uur dan gisteren, maar ze blijven langer.

**Zoekresultaten:** quiznote.app staat nog bij geen van de 6 zoekopdrachten. "QuizNote"/"QuizNote app": QuizNotes AI, devpost, Quiz Notes-nieuwsbrief, studie-apps. "pubquiz app mac"/"pubquiz software"/"quiz night software mac": App Store-apps, Quizado, KwizzBit en lijstjessites (gitnux, wifitalents, zipdo, worldmetrics: "best pub quiz software"). "pubquiz maken": id.nl (PowerPoint), AhaSlides, Amnesty-handleiding.

**PageSpeed Insights:** niet bereikbaar (toestemming voor de URL wordt in een nachtelijke run niet gegeven). Overgeslagen.

**Technische check** (`pnpm generate`): titel, description, canonical, hreflang, og:image, `SoftwareApplication` en één h1 op `/` en `/en` in orde; robots.txt en sitemap in orde; screenshots 8–72 KB. Nog open: `og:locale` op Engels is `en` (beter `en_GB`); privacy- en voorwaardenpagina's zonder og:title/og:image.

**Verbetering:** `X-Robots-Tag: noindex` voor `/200` en `/404` (en `.html`) in `firebase.json`. Die pagina's gaven status 200 en konden als lege pagina's in Google komen. Echte 404's (status 404) veranderen niet.

**Volgende ideeën:** `og:locale` `en_GB`; Google Search Console (Remco: domein verifiëren, sitemap indienen) — zonder Search Console blijft de ranking gissen; vermelding op de lijstjessites voor "pub quiz software" (Remco).
