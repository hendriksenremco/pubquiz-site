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
