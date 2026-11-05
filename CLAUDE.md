# QuizNote-site

Promotiesite voor **QuizNote**, een macOS-app van Remco Hendriksen om een pubquiz in elkaar te klikken en live te draaien. Deze map is alleen voor de site; de app zelf staat in `../pubquiz` (GitHub: `hendriksenremco/pubquiz`).

**Naam:** de app heet QuizNote, met een hoofdletter N (sinds 25 oktober 2026). Daarvoor heette hij even Quizmeister; die naam viel af omdat quizmeister.nl een Nederlands pubquizbedrijf is. "Pubquiz" was de werknaam: die staat nog in de repo en de code. Op de site heet de app altijd QuizNote; "pubquiz" is gewoon het woord voor de quiz zelf ("maak je pubquiz met QuizNote"). Gebruik "Keynote" niet in teksten op de site: dat is een merk van Apple.

Stand op 31 oktober 2026:

- **Site:** gemaakt met Nuxt (zie Techniek), met een Nederlandse en een Engelse versie.
- **Repo:** op GitHub, `git@github.com:hendriksenremco/pubquiz-site.git`, met de branches `master` en `develop`.
- **Hosting:** Firebase Hosting, project `quiznote-4c3e8`. De site staat live op https://quiznote.app.
  - Deployen gaat automatisch: elke push naar `master` zet de site live (`.github/workflows/deploy-site.yml`).
  - Claude mag op `develop` werken en pushen, en `develop` naar `master` mergen als er iets live moet.
  - `pnpm deploy:site` vanaf de Mac kan nog steeds, als noodweg.
- **quiznote.nl:** staat nog op de parkeerpagina van TransIP.
- **Mail:** Google Workspace, ingericht voor quiznote.app. DMARC moet nog strenger; zie `HERINNERINGEN.md`.
- **Nog niet ingericht:** PostHog (EU), voor analytics van de site en de app.
- **Download:** waar die komt te staan is nog open. Het advies is GitHub Releases.
- **Wat er nog moet gebeuren voor de release** staat in `../pubquiz/TODO.md`.

## Werkafspraken

- **Taal:** Remco schrijft meestal Nederlands; antwoord in zijn taal. Schrijf de site-teksten in het Nederlands, met "je", korte zinnen, gewone werkwoorden en hoofdletters alleen aan het begin van een zin.
- **Kort en bondig:** de site laat zien wat de app is, met zo min mogelijk tekst: per onderdeel één korte zin, en laat de screenshots het werk doen. Uitgebreide uitleg komt later in een handleiding (25 oktober: "het mag qua teksten een stuk minder en bondiger").
- **Commit:** na elke afgeronde wijziging een eigen commit, met een Engelse commit-message. Werk op `develop`; `master` is de standaardbranch. Remco gebruikt altijd `master` en `develop`, nooit `main`. Pushen naar `develop` mag altijd; zie Hosting voor `master`.
- **Zichtbaar:** geen acties achter een ⋯-menu of knoppen die pas bij hover verschijnen. Dat geldt in de app en ook hier: navigatie en de downloadknop staan gewoon in beeld.
- **App-repo alleen lezen:** `../pubquiz` is je bron voor feiten, teksten en screenshots. Wijzig daar niets zonder dat hij erom vraagt; app-werk hoort in een sessie in die map.
- **App niet zichtbaar starten:** start `pnpm dev` of `pnpm start` van de app niet om iets te bekijken. Remco heeft de app vaak zelf open, en opspringende vensters storen hem. Screenshots maak je headless (zie hieronder).
- **Niet aankomen:** `../pubquiz/fixtures/demo.pubquiz` bevat echt werk van Remco (zijn video's en rondes). Nooit overschrijven, opruimen of bewerken.
- **Geen AirPlay:** op zijn netwerk staan echte AirPlay-schermen in de kroeg. Verbind er nooit mee.

## Wat de app is

Eén laptop stuurt de hele quizavond aan: de beamers en tv's in de zaal, de speakers en de quizmaster zelf. Geen PowerPoint, Spotify en losse filmpjes meer naast elkaar; je klikt de quiz één keer in elkaar en speelt hem af met een paar toetsen. Alles werkt offline met bestanden op je eigen Mac.

**Doelgroep:** quizmasters in cafés, kroegen, sportkantines, verenigingen en bij bedrijfsuitjes.

### Functies

Dit is wat er nu echt in de app zit. De namen tussen aanhalingstekens zijn de woorden in de app zelf; gebruik die op de site.

**Schermen**
- Meerdere schermen tegelijk: beamer, tv's, ook een AirPlay-scherm zoals een Apple TV (als uitgebreid beeldscherm van de Mac).
- Elk scherm laat de hele avond een eigen video in een loop zien; een ronde kan dat vervangen door een andere video, een afbeelding of zwart. Na "Einde ronde" valt alles vanzelf terug.
- Wisselen gaat met een overvloeier, zonder zwart beeld ertussen.
- Een video kan zijn geluid laten horen via de speakers van dat scherm zelf (HDMI wordt op naam herkend). Per ronde kan dat geluid uit.
- "Beeld op zwart" per scherm of voor alle schermen.

**Geluid**
- Achtergrondmuziek die de hele avond doorloopt en vanzelf zachter wordt zodra er een fragment speelt. Per ronde kan hij doorspelen, zachter, pauzeren of door andere muziek vervangen worden.
- Meerdere audio-uitgangen: bijvoorbeeld de muziek naar de zaal en de fragmenten naar een andere speaker.
- Mixer met een volume per uitgang en per scherm, en "Geluid uit" voor noodgevallen.

**Rondes** ("Gewone ronde", "Muziekronde", "Afbeeldingenronde", "Pauze", "Antwoorden")
- Vragenronde met slides: een titel, een vraag (met of zonder afbeelding) of alleen het vraagnummer in beeld terwijl de quizmaster voorleest.
- Muziekronde: fragmenten met begin, eind en fade, met de hand te starten (toets 1–9) of als "automatische reeks" met aftellen tussen de fragmenten. Het fragmentnummer staat in beeld, op de schermen die je kiest.
- Afbeeldingenronde: een reeks plaatjes, genummerd in beeld, in één keer toe te voegen uit een map. Kan eindeloos rondgaan ("Loop").
- Antwoordenronde: zet je waar je wilt in de avond, ook pas aan het eind. Per vraag, afbeelding of fragment eerst de vraag zelf (een fragment speelt opnieuw), dan het antwoord groot in beeld, eventueel met een eigen afbeelding (bijvoorbeeld de albumhoes of de hele foto na een uitsnede).

**Tijdens de show**
- De laptop is het bedieningsscherm: previews van elk scherm, de rondes, de fragmenten, de mixer en notities.
- Sneltoetsen, en een presenter-clicker werkt ook. ← → gaan door de slides, in een muziekronde door de fragmenten en in een antwoordenronde door de antwoorden. Verder: Enter = volgende ronde, R = ronde opnieuw, E = einde ronde, 1–9 = fragment, spatie = stop fragment, A = reeks starten of pauzeren, B = beeld op zwart, M = geluid uit, L = loop pauzeren.
- "Ronde opnieuw": de ronde vanaf het begin, met de fragmenten weer ongespeeld. Bijvoorbeeld om een muziekronde twee keer te laten horen.
- Loopt de app vast of valt hij uit, dan kun je bij het opnieuw openen de show hervatten waar hij was.
- "Show starten": schermen en speakers koppelen, een testtoon afspelen en vooraf zien of er bestanden ontbreken. De app onthoudt de koppeling voor de volgende keer.

**Afdrukken** (pdf, daarna klaar om te printen)
- "Antwoordformulier" voor de teams: tot vier rondes per A4, elke ronde in een eigen vak om los te knippen, één regel voor de teamnaam.
- "Nakijkformulier": precies dezelfde opmaak met de antwoorden op de regels, om naast een ingevuld formulier te leggen.
- "Vragenkaarten" voor de quizmaster: kaarten op ansichtkaartformaat met de vragen en antwoorden, vier per liggende A4, met snijlijnen.

**Voorbereiden**
- Media importeren door te slepen, ordenen in mappen, video's en geluid vooraf beluisteren.
- Een quiz is één map (`.pubquiz`) met alles erin, dus makkelijk mee te nemen. "Exporteer als zip" om hem te delen.
- "Nieuwe quiz op basis van deze": de schermen, de sfeer en eventueel de rondes van vorige keer hergebruiken.
- Slaat automatisch op; ongedaan maken met ⌘Z.

**Quiz maken met je AI** (MCP, sinds 25 oktober)
- Je vraagt je eigen AI-assistent bijvoorbeeld: "Maak een pubquiz in QuizNote met zes rondes over Italië." De quiz verschijnt dan in de app, met vragen, antwoorden en een antwoordenronde. De AI kan quizzen ook opzoeken en rondes aanpassen ("maak ronde 3 moeilijker").
- Werkt via MCP. Claude Desktop koppel je met één knop ("Nieuwe quiz → Met je AI…"); voor andere AI-apps die MCP ondersteunen staan de instellingen erbij om te kopiëren. ChatGPT ondersteunt voor zover bekend alleen MCP-servers op internet, dus noem ChatGPT niet als werkend.
- Eerlijk zijn: liedjes en foto's maakt de AI niet zelf, die moeten als bestanden op de Mac staan. De AI doet het denkwerk (vragen, antwoorden, opbouw), de quizmaster houdt de controle. Tijdens een show past de AI niets aan.
- De gebruiker gebruikt zijn eigen AI-abonnement; QuizNote stuurt zelf niets naar internet.
- Screenshots: `ai-music-round.png` (de quiz die de AI maakte) staat als `public/screens/ai-quiz.webp` op de site. Gebruik `ai-dialog.png` niet: daarin staan in de MCP-instellingen de lokale paden van Remco's Mac.

### Niet beloven

Dit zit er (nog) niet in. Noem het niet op de site, ook niet als "binnenkort", tenzij Remco dat zegt:
- Windows of Linux: alleen macOS.
- YouTube of Spotify: staat gepland voor later, maar is niet gebouwd.
- Scorebord of tussenstand, en teams die antwoorden via hun telefoon.

Sinds 29 en 30 oktober zitten er twee plug-ins in de app. Ze staan standaard uit en de gebruiker zet ze aan bij Instellingen:

- **Afstandsbediening:** de show bedienen met een telefoon of tablet via een QR-code.
- **MagicHome-licht:** een kleur of effect op een ledstrip per ronde of slide.

Beide zijn nog niet getest met echte telefoons of op een andere locatie. Vraag Remco of ze op de site mogen voordat je ze noemt.

Wees voorzichtig met AirPlay en met videogeluid via de speakers van een tv: allebei gebouwd en getest met nep-apparaten, maar nog niet met echte hardware. Noem ze gerust, maar maak ze niet tot hoofdpunt zonder het eerst aan Remco te vragen.

### Download en installatie

- Versie 0.1.0. Er is een build voor Macs met Apple Silicon (`pnpm build:mac` in `../pubquiz` maakt `dist/QuizNote-0.1.0.dmg`); een build voor Intel-Macs kan ook.
- Bij de eerste start staat er een **rondleiding** op het dashboard: een korte quiz die laat zien wat de app kan. Goed om op de site te noemen ("start de app en volg de rondleiding").
- De app is (nog) niet ondertekend door Apple. Bij de eerste keer openen blokkeert macOS hem; de gebruiker gaat dan naar Systeeminstellingen › Privacy en beveiliging en klikt op "Open toch". Zet dat duidelijk bij de download.
- Waar de download komt te staan (GitHub Releases, eigen hosting) is nog niet besloten. Of de repo openbaar is, is ook niet bekend; vraag het.

## Uitstraling

De site hoort bij de app. Neem de beeldtaal over in plaats van iets nieuws te verzinnen.

- **Sfeer:** nachtblauw met één amber accent, als bierlicht of een podiumlamp. Rustig: vlakken onderscheiden zich door toon, niet door lijnen. Achter beeld van een quiz zit in de app een zachte gloed in de kleuren van dat beeld.
- **Kleuren** (uit `../pubquiz/src/renderer/src/styles/base.css`):

  | Rol | Waarde |
  |---|---|
  | Achtergrond (night) | `#0f1420` |
  | Vlakken, van donker naar licht | `#141a27`, `#1a2131`, `#232b3e`, `#2c3550` |
  | Tekst / gedempt / zwak | `#e8ecf5` / `#8b94aa` / `#5c6579` |
  | Accent (amber) / tekst op accent | `#ffa53d` / `#231300` |
  | Live (rood) | `#ff4d6a` |
  | Oké (groen) | `#4fd69c` |

- **Letters:** koppen in Bricolage Grotesque (variabel, ook via Google Fonts), lopende tekst in de systeemletter (SF Pro). Grote koppen zijn vet (700–800) met iets krappere letterafstand.
- **Vormen:** afgeronde hoeken (9, 14 en 20 px), knoppen en "chips" als pillen.
- **Logo en icoon:** staan in `brand/quiznote/`. Het icoon is de Q uit het woordmerk, in amber op nachtblauw. Het woordmerk is "QuizNote" in Bricolage Grotesque, "Quiz" in crème en "Note" in amber, met het puntje op de i in amber. `brand/quiznote/bron/maak.py` (of `pnpm brand`) maakt alle bestanden opnieuw (icoon, woordmerk, lockups, de app-iconen en de favicons en deelafbeelding) en zet de kopieën voor de site in `public/`. De schetsrondes staan in `brand/concepten/quiznote/`. Remco wil vlakke vormen zonder gloed, verloop of schaduw in het logo, en het icoon in één kleur. Het icoon zit ook in de app (`../pubquiz/build/` en `../pubquiz/resources/`).

## Screenshots

- De end-to-endtests van de app maken screenshots in `../pubquiz/test-results/`. Opnieuw maken: `npm run test:e2e` in `../pubquiz`. Dat draait onzichtbaar (headless) en laat de demo-quiz ongemoeid. Playwright leegt die map bij elke run, dus kopieer wat je wilt houden naar deze map.
- De screenshots zijn 2880 × 1800 (retina). Bruikbaar voor de site, bijvoorbeeld: `show-live.png` (bediening tijdens de show), `editor-round.png` en `editor-setup.png` (editor), `show-prepare.png` (koppelen), `answers-live.png`, `answers-question.png` en `answers-picture.png` (antwoordenronde), `pictures-editor.png` (afbeeldingenronde), `screen-countdown.png` (beeld op de beamer), `print-page.png` (afdrukken), `home.png` (startscherm). Daarnaast staan er pdf's van de drie formulieren.
- Gebruik bij voorkeur de screenshots van de **rondleiding**: `tour-*.png` (de laptop) en `tour-*-beamer.png` (wat de zaal ziet). Die laten een echte quiz zien: vragen, een muziekronde met bekende melodietjes, vlaggen, een antwoordenronde met hoesjes, in de kleuren van de app. De rondleiding zelf (`../pubquiz/fixtures/rondleiding.pubquiz`, gemaakt met `pnpm tour`) legt op zijn slides uit wat de app kan, dus het is ook een goede bron voor teksten.
- De gewone demo-quiz gebruikt testbeelden (kleurbalken met "STANDAARD LOOP") en neptitels als "Antwoord 1". Die screenshots zijn niet mooi voor de site.

## Techniek

- **Nuxt 4** met `@nuxtjs/i18n`, gebouwd als statische site: `pnpm generate` zet alles in `.output/public`, klaar voor elke host. Verder: `pnpm dev`, `pnpm typecheck` (vue-tsc; TypeScript staat op 5.9, want vue-tsc kan nog niet met 7).
- **Talen:** Nederlands op `/`, Engels op `/en` (`prefix_except_default`). De teksten staan per taal in `app/content/site.ts`, niet in losse i18n-bestanden. De app zelf is alleen Nederlands: de Engelse teksten noemen daarom geen knoppen bij naam, en de Engelse FAQ zegt dat de app Nederlands is.
- **Opbouw:** één pagina (`app/pages/index.vue`) met de secties, `SiteHeader` en `SiteFooter` in `app/layouts/default.vue`, screenshots via `AppShot`. Kleuren en letters staan als tokens in `app/assets/css/main.css`, overgenomen uit de app. De letter komt uit `@fontsource-variable/bricolage-grotesque` (zelf gehost, geen Google).
- **Instellingen** (`nuxt.config.ts`, ook via env): `NUXT_PUBLIC_SITE_URL` (standaard `https://quiznote.app`, voor canonical, hreflang en de deelafbeelding) en `NUXT_PUBLIC_DOWNLOAD_URL`. Is de download-URL leeg, dan toont de site een melding in plaats van de downloadknop.
- **Screenshots** staan als WebP in `public/screens/` (1600 px breed, beamerbeelden 1200 px), omgezet uit `../pubquiz/test-results/tour-*.png` met `magick … -resize 1600x -quality 82`. Naast elk beeld staat een versie half zo breed (`<naam>-sm.webp`, 800 px, beamerbeelden 600 px) voor telefoons; `AppShot` zet ze in `srcset`. Maak die opnieuw als je een screenshot vervangt.
- **Bekijken zonder vensters:** bouw met `pnpm generate`, serveer `.output/public` en maak screenshots met headless Chromium (Playwright). Scroll eerst door de pagina, anders laden de afbeeldingen met `loading="lazy"` niet.

## Meer achtergrond

- `../pubquiz/README.md`: gebruik, ontwikkelen en de opbouw van de app. Hij loopt achter: de nieuwste functies hierboven (antwoordenrondes, afbeeldingenrondes, afdrukken, videogeluid) staan er nog niet in.
- `../pubquiz/src/shared/quiz-schema.ts`: hoe een quiz in elkaar zit, als je wilt nagaan wat de app precies kan.
- `../pubquiz/CLAUDE.md`: hoe de app in elkaar zit en de werkafspraken daar.
