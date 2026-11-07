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

---

## 2026-11-05

(Geen entry voor 4 november: die nacht is er niets gelogd. Vergelijking hieronder is met 3 november.)

**PostHog** (project 328999). Overzicht met testaccounts uitgefilterd; pagina's en verwijzers zonder filter.

| | 24 uur | 7 dagen | 3 nov (24 u / 7 d) |
|---|---|---|---|
| Bezoekers | 6 | 120 | 21 / 112 |
| Pageviews | 8 | 152 | 29 / 142 |
| Bouncerate | 67% | 58% | 43% / 58% |
| Gem. sessieduur | 8 s | 50 s | 127 s / 53 s |
| Bezoekers via Google | 0 | 0 | 0 / 0 |

Pagina's (7 dagen, bezoekers): `/` 54 · `/en` 38 · `/voorwaarden` 13 · `/privacy` 11 · `/en/privacy` 8 · `/en/voorwaarden` 7 · `/200` 6 · `/404` 6.
Verwijzers (7 dagen): direct 103, quiznote.app 12, quiznote-4c3e8.web.app 4, bing.com 1. Geen Google. De eerste drukte na de lancering ebt weg: nog maar 6 bezoekers in 24 uur.

**Zoekresultaten:** quiznote.app staat bij geen van de 6 zoekopdrachten, ook niet bij een losse zoekopdracht op "quiznote.app". Zelfde concurrenten als eerder: QuizNotes AI, devpost/GitHub-projecten "quiznote", Quiz Notes-nieuwsbrief; bij "pubquiz software"/"quiz night software mac" Quizado, KwizzBit, QuizControl, Games Night en lijstjessites (gitnux, wifitalents, zipdo, worldmetrics); bij "pubquiz maken" id.nl, AhaSlides en de Amnesty-handleiding. De site lijkt nog niet geïndexeerd; zonder Search Console (issue #71) is dat niet na te gaan.

**PageSpeed Insights:** niet bereikbaar (toestemming voor de URL wordt in een nachtelijke run niet gegeven). In plaats daarvan Lighthouse 12 lokaal gedraaid op de gebouwde site (mobiel, gesimuleerde throttling; zonder de cache-headers van Firebase):
- vóór: performance 74, toegankelijkheid 100, best practices 100, SEO 100; LCP 4,2 s, TBT 440 ms, 695 KiB.
- grootste punten: het LCP-beeld (laptop-screenshot bovenaan) had geen `fetchpriority`; telefoons laadden de 1600 px-screenshots ("Properly size images", ~300 KiB); ongebruikte JS (~200 KiB in de hoofdbundel, ~30 KiB PostHog-surveys).

**Technische check** (`pnpm generate`): titel, description, canonical, hreflang, og:url, og:image en `SoftwareApplication` op `/` en `/en` in orde; één h1 per pagina; alle afbeeldingen met alt; robots.txt en sitemap (6 URL's) in orde. Nog open: `og:locale` op Engels is `en` (beter `en_GB`); privacy- en voorwaardenpagina's zonder og:title/og:image; `SoftwareApplication` zonder `offers` (geen rich result mogelijk zolang de prijs niet vaststaat).

Let op: de lockfile is van pnpm 8; met pnpm 10 faalt `pnpm install`. Gebruik `npx pnpm@8`.

**Verbetering:** snellere screenshots op mobiel.
- Naast elk beeld in `public/screens/` een versie half zo breed (`-sm.webp`, 800 px / beamer 600 px, 3–22 KB); `AppShot` zet ze in `srcset` met `sizes`.
- Het laptop-screenshot bovenaan krijgt `fetchpriority="high"`.
- Lighthouse daarna (2 runs): performance 89–91, LCP 3,2–3,3 s, 451 KiB (was 74, 4,2 s, 695 KiB).

**Volgende ideeën:** Google Search Console (#71, Remco: domein verifiëren) blijft het belangrijkste; `og:locale` `en_GB`; PostHog-surveys niet laden (scheelt ~30 KiB JS, `disable_surveys`); vermelding op lijstjessites voor "pub quiz software" (Remco).

---

## 2026-11-06

**PostHog** (project 328999). Overzicht met testaccounts uitgefilterd; pagina's, verwijzers en landen zonder filter.

| | 24 uur | 7 dagen | 5 nov (24 u / 7 d) |
|---|---|---|---|
| Bezoekers | 36 | 156 | 6 / 120 |
| Pageviews | 37 | 189 | 8 / 152 |
| Bouncerate | 61% | 59% | 67% / 58% |
| Gem. sessieduur | 4 s | 39 s | 8 s / 50 s |
| Bezoekers via Google | 0 | 0 | 0 / 0 |

Pagina's (7 dagen, bezoekers): `/` 66 · `/en` 49 · `/voorwaarden` 17 · `/en/privacy` 14 · `/privacy` 13 · `/en/voorwaarden` 9 · `/200` 6 · `/404` 6.
Verwijzers (7 dagen): direct 132, quiznote.app 17, quiznote-4c3e8.web.app 6, bing.com 1. Geen Google.
Let op: van de 36 bezoekers in 24 uur komen er 32 uit de VS, met 1 pageview en gemiddeld 4 s. Dat lijken bots of link-previews, geen echte bezoekers; NL had er 4.

**Zoekresultaten** (zelfde 6 zoekopdrachten): quiznote.app staat nog nergens. "QuizNote"/"QuizNote app": devpost, GitHub-projecten "quiznote", QuizNotes AI, Quiz Notes-nieuwsbrief, studie-apps. "pubquiz app mac": App Store-quizspellen, Quizado. "pubquiz maken": id.nl (PowerPoint), AhaSlides, Amnesty-handleiding. "pubquiz software"/"quiz night software mac": Quizado, KwizzBit, QuizControl, Games Night en lijstjessites (gitnux, wifitalents, zipdo, worldmetrics).

**PageSpeed Insights:** niet bereikbaar (toestemming voor de URL wordt in een nachtelijke run niet gegeven). Overgeslagen; de Lighthouse-meting van 5 november blijft de laatste.

**Technische check** (`pnpm generate`): titel, description, canonical, hreflang, og:image op `/` en `/en` in orde; één h1 per pagina; alle afbeeldingen met alt; robots.txt en sitemap (6 URL's) in orde. Nog open: `og:locale` op Engels is `en` (beter `en_GB`); privacy- en voorwaardenpagina's zonder og:title/og:image; canonical van de homepage is `https://quiznote.app` en in de sitemap `https://quiznote.app/` (Google ziet die als gelijk, geen probleem).

**Verbetering:** gestructureerde gegevens uitgebreid (`app/pages/index.vue`).
- Nieuw: `WebSite` met naam "QuizNote" en `alternateName` "quiznote.app". Google gebruikt dat voor de sitenaam in de zoekresultaten; nuttig omdat "QuizNote" een drukke naam is (QuizNotes AI, GitHub-projecten).
- `SoftwareApplication` krijgt `softwareVersion` (uit `release.json`, gaat dus mee met een release), `downloadUrl`, `inLanguage` en de URL van de eigen taal (`/en` op Engels; was altijd `/`).
- Gedaan op een branch vanaf `master`, omdat `develop` de nog niet goedgekeurde privacyverklaring bevat.

**Volgende ideeën:** Google Search Console (#71, Remco) blijft het belangrijkste: zonder indexering helpt de rest weinig; `og:locale` `en_GB`; PostHog-surveys niet laden (`disable_surveys`, ~30 KiB JS); vermelding op lijstjessites voor "pub quiz software" (Remco).

---

## 2026-11-07

**PostHog** (project 328999). Overzicht met testaccounts uitgefilterd; pagina's, verwijzers en landen zonder filter.

| | 24 uur | 7 dagen | 6 nov (24 u / 7 d) |
|---|---|---|---|
| Bezoekers | 7 | 163 | 36 / 156 |
| Pageviews | 7 | 196 | 37 / 189 |
| Bouncerate | 86% | 60% | 61% / 59% |
| Gem. sessieduur | 1 s | 38 s | 4 s / 39 s |
| Bezoekers via Google | 0 | 0 | 0 / 0 |

Pagina's (7 dagen, bezoekers): `/` 67 · `/en` 49 · `/voorwaarden` 17 · `/en/privacy` 14 · `/privacy` 13 · `/404` 10 · `/en/voorwaarden` 9 · `/200` 8.
Verwijzers (7 dagen): direct 139, quiznote.app 17, quiznote-4c3e8.web.app 6, bing.com 1. Geen Google.
Alle 7 bezoekers van de afgelopen 24 uur komen uit de VS, met 1 pageview en ~1 s: vrijwel zeker bots of link-previews. Echte bezoekers uit NL: 0 in 24 uur.

**Zoekresultaten** (zelfde 6 zoekopdrachten): quiznote.app staat nog nergens. "QuizNote"/"QuizNote app": GitHub-projecten "quiznote" (Evavic44, BrainyPad), devpost, QuizNotes AI, Quiz Notes-nieuwsbrief, studie-apps. "pubquiz app mac": App Store-quizspellen (Pub Quiz, Millionaire Pub Quiz), Quizado. "pubquiz maken": id.nl (PowerPoint), AhaSlides, Amnesty-handleiding, dagjeweg. "pubquiz software": Quizado ("best pub quiz software"), KwizzBit, AhaSlides, lijstjessites (gitnux, wifitalents, zipdo, worldmetrics). "quiz night software mac": Games Night, QuizControl, Quizado, SourceForge-pagina's.

**PageSpeed Insights:** niet bereikbaar (toestemming voor de URL wordt in een nachtelijke run niet gegeven). Overgeslagen; de Lighthouse-meting van 5 november blijft de laatste.

**Technische check** (`pnpm generate`): titel, description, canonical, hreflang, og:url, og:image en `WebSite`/`SoftwareApplication` op `/` en `/en` in orde; één h1 per pagina; alle afbeeldingen met alt; robots.txt en sitemap (6 URL's) in orde; screenshots samen 580 KB.

**Verbetering:** Open Graph compleet op alle pagina's.
- Privacy- en voorwaardenpagina's (NL en EN) krijgen og:title, og:description, og:image en een Twitter-kaart (`LegalPage.vue`); een gedeelde link toont nu titel en deelafbeelding.
- `og:locale` op Engels is `en_GB` (was `en`, geen geldig formaat); hreflang blijft `en` voor alle Engelstaligen.
- `og:site_name` "QuizNote" op alle pagina's.
- Weer op een branch vanaf `master`, omdat `develop` de nog niet goedgekeurde privacyverklaring bevat.

**Volgende ideeën:** Google Search Console (#71, Remco) blijft veruit het belangrijkste: na een week staat de site nog nergens en komt er niemand via Google; PostHog-surveys niet laden (`disable_surveys`, ~30 KiB JS); vermelding op lijstjessites voor "pub quiz software" en een link vanaf de GitHub-release naar quiznote.app (Remco).
