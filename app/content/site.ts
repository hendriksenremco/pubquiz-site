// Alle teksten van de site, per taal. Kort en bondig: de site laat zien wat de app is, de uitleg komt
// later in een handleiding. Nederlands: "je", korte zinnen, gewone werkwoorden.
// De app is (nog) alleen Nederlands, dus de Engelse teksten noemen geen knoppen bij naam.

export type Locale = 'nl' | 'en'

export interface Shot {
  src: string
  alt: string
}

export interface SiteContent {
  meta: { title: string; description: string }
  skip: string
  nav: { ai: string; rounds: string; show: string; print: string; download: string; language: string }
  cta: { download: string; downloadShort: string }
  hero: {
    eyebrow: string
    title: string
    lead: string
    facts: string[]
    laptop: Shot
    beamer: Shot
    beamerLabel: string
  }
  room: { title: string; items: { title: string; text: string }[] }
  ai: { eyebrow: string; title: string; prompt: string; text: string; shot: Shot }
  rounds: { eyebrow: string; title: string; items: { title: string; text: string; shot: Shot; beamer?: Shot }[] }
  show: { eyebrow: string; title: string; lead: string; keys: { keys: string[]; label: string }[] }
  print: { eyebrow: string; title: string; shot: Shot; items: { title: string; text: string }[] }
  download: {
    eyebrow: string
    title: string
    lead: string
    button: string
    pending: string
    installTitle: string
    install: string[]
  }
  footer: { madeBy: string }
}

export const site: Record<Locale, SiteContent> = {
  nl: {
    meta: {
      title: 'Quizmeister · de hele quizavond vanaf één Mac',
      description: "Quizmeister is een Mac-app voor quizmasters: beamer, tv's en speakers vanuit één laptop."
    },
    skip: 'Naar de inhoud',
    nav: {
      ai: 'Met je AI',
      rounds: 'Rondes',
      show: 'Tijdens de show',
      print: 'Afdrukken',
      download: 'Download',
      language: 'Taal'
    },
    cta: { download: 'Download voor Mac', downloadShort: 'Download' },
    hero: {
      eyebrow: 'Voor quizmasters met een Mac',
      title: 'De hele quizavond vanaf één laptop',
      lead: "Beamer, tv's en speakers vanuit één app. Je klikt je quiz één keer in elkaar en speelt hem af met een paar toetsen.",
      facts: ['Voor macOS', 'Werkt offline', 'Eén map per quiz'],
      laptop: {
        src: '/screens/muziek.webp',
        alt: 'Quizmeister tijdens de show: de muziekronde loopt, met previews van de beamer en de tv, de fragmenten en de mixer.'
      },
      beamer: {
        src: '/screens/muziek-beamer.webp',
        alt: 'Op de beamer: de titelslide van ronde 2, muziek, met het nummer van het eerste fragment.'
      },
      beamerLabel: 'Op de beamer'
    },
    room: {
      title: 'Eén laptop, de hele zaal',
      items: [
        { title: 'Schermen', text: 'Elke beamer en tv een eigen beeld.' },
        { title: 'Geluid', text: 'Muziek voor de zaal, fragmenten op een eigen speaker.' },
        { title: 'Jij', text: 'Alles in één overzicht, met een paar toetsen.' }
      ]
    },
    ai: {
      eyebrow: 'Met je AI',
      title: 'Laat je AI de quiz maken',
      prompt: 'Maak een pubquiz over Italië, met een muziekronde en een vlaggenronde.',
      text: "De quiz staat daarna in Quizmeister, met vragen en antwoorden. Werkt met Claude Desktop en andere AI-apps met MCP. Liedjes en foto's komen uit je eigen mappen.",
      shot: {
        src: '/screens/ai-quiz.webp',
        alt: 'Een quiz over Italië die een AI heeft gemaakt, in de editor van Quizmeister: vijf rondes, waaronder muziek en vlaggen.'
      }
    },
    rounds: {
      eyebrow: 'Rondes',
      title: 'Vragen, muziek, plaatjes en antwoorden',
      items: [
        {
          title: 'Vragen en slides',
          text: 'Een vraag, een afbeelding of alleen het nummer in beeld.',
          shot: {
            src: '/screens/vragen.webp',
            alt: 'Een vragenronde tijdens de show: vraag 2 staat op de beamer en de tv, de slides staan eronder.'
          },
          beamer: {
            src: '/screens/vragen-beamer.webp',
            alt: 'Op de beamer: vraag 2, welke kleur krijg je als je blauw en geel mengt?'
          }
        },
        {
          title: 'Muziekronde',
          text: 'Fragmenten op de toetsen 1 tot en met 9, of na elkaar als reeks.',
          shot: {
            src: '/screens/editor.webp',
            alt: 'De muziekronde in de editor: de titelslide, de schermen en de fragmenten met hun lengte.'
          }
        },
        {
          title: 'Afbeeldingenronde',
          text: "Een hele map foto's in één keer, genummerd in beeld.",
          shot: {
            src: '/screens/vlaggen.webp',
            alt: 'Een afbeeldingenronde met vlaggen: op de beamer en de tv staat dezelfde genummerde vlag.'
          }
        },
        {
          title: 'Antwoorden',
          text: 'Eerst de vraag, dan het antwoord groot in beeld.',
          shot: {
            src: '/screens/antwoorden.webp',
            alt: 'De antwoordenronde tijdens de show, met per vraag de vraag en het antwoord.'
          },
          beamer: {
            src: '/screens/antwoorden-beamer.webp',
            alt: 'Op de beamer: het antwoord op vraag 2, groen.'
          }
        }
      ]
    },
    show: {
      eyebrow: 'Tijdens de show',
      title: 'Een paar toetsen, de hele avond',
      lead: 'Een presenter-clicker werkt ook.',
      keys: [
        { keys: ['Enter'], label: 'Volgende ronde' },
        { keys: ['E'], label: 'Einde ronde' },
        { keys: ['←', '→'], label: 'Vorige, volgende' },
        { keys: ['1–9'], label: 'Fragment spelen' },
        { keys: ['Spatie'], label: 'Fragment stoppen' },
        { keys: ['A'], label: 'Reeks starten' },
        { keys: ['B'], label: 'Beeld op zwart' },
        { keys: ['M'], label: 'Geluid uit' }
      ]
    },
    print: {
      eyebrow: 'Afdrukken',
      title: 'Ook op papier',
      shot: {
        src: '/screens/afdrukken.webp',
        alt: 'Het scherm Afdrukken: kies de rondes en maak een antwoordformulier, een nakijkformulier of vragenkaarten.'
      },
      items: [
        { title: 'Antwoordformulier', text: 'Voor de teams.' },
        { title: 'Nakijkformulier', text: 'Met de antwoorden erop.' },
        { title: 'Vragenkaarten', text: 'Voor jezelf, op ansichtkaartformaat.' }
      ]
    },
    download: {
      eyebrow: 'Download',
      title: 'Quizmeister voor je Mac',
      lead: 'Versie 0.1.0, voor Macs met Apple Silicon.',
      button: 'Download voor Mac',
      pending: 'De downloadlink volgt.',
      installTitle: 'De eerste keer openen',
      install: [
        "Sleep Quizmeister naar Programma's.",
        'macOS blokkeert de app de eerste keer: hij is nog niet door Apple ondertekend.',
        'Klik in Systeeminstellingen › Privacy en beveiliging op "Open toch".',
        'Begin met de rondleiding op het dashboard.'
      ]
    },
    footer: { madeBy: 'Quizmeister is gemaakt door Remco Hendriksen.' }
  },

  en: {
    meta: {
      title: 'Quizmeister · run the whole quiz night from one Mac',
      description: 'Quizmeister is a Mac app for quizmasters: projector, TVs and speakers from one laptop.'
    },
    skip: 'Skip to content',
    nav: {
      ai: 'With your AI',
      rounds: 'Rounds',
      show: 'During the show',
      print: 'Printing',
      download: 'Download',
      language: 'Language'
    },
    cta: { download: 'Download for Mac', downloadShort: 'Download' },
    hero: {
      eyebrow: 'For quizmasters with a Mac',
      title: 'Run the whole quiz night from one laptop',
      lead: 'Projector, TVs and speakers from one app. Build your quiz once and play it with a few keys.',
      facts: ['For macOS', 'Works offline', 'One folder per quiz'],
      laptop: {
        src: '/screens/muziek.webp',
        alt: 'Quizmeister during the show: the music round is on, with previews of the projector and the TV, the clips and the mixer.'
      },
      beamer: {
        src: '/screens/muziek-beamer.webp',
        alt: 'On the projector: the title slide of round 2, music, with the number of the first clip.'
      },
      beamerLabel: 'On the projector'
    },
    room: {
      title: 'One laptop, the whole room',
      items: [
        { title: 'Screens', text: 'Every projector and TV its own picture.' },
        { title: 'Sound', text: 'Music for the room, clips on their own speaker.' },
        { title: 'You', text: 'Everything in one view, with a few keys.' }
      ]
    },
    ai: {
      eyebrow: 'With your AI',
      title: 'Let your AI make the quiz',
      prompt: 'Make a pub quiz about Italy, with a music round and a flags round.',
      text: 'The quiz then appears in Quizmeister, with questions and answers. Works with Claude Desktop and other AI apps that support MCP. Songs and photos come from your own folders.',
      shot: {
        src: '/screens/ai-quiz.webp',
        alt: 'A quiz about Italy made by an AI, in the Quizmeister editor: five rounds, including music and flags.'
      }
    },
    rounds: {
      eyebrow: 'Rounds',
      title: 'Questions, music, pictures and answers',
      items: [
        {
          title: 'Questions and slides',
          text: 'A question, a picture or just the number on screen.',
          shot: {
            src: '/screens/vragen.webp',
            alt: 'A question round during the show: question 2 is on the projector and the TV, the slides are below.'
          },
          beamer: {
            src: '/screens/vragen-beamer.webp',
            alt: 'On the projector: question 2, which colour do you get when you mix blue and yellow?'
          }
        },
        {
          title: 'Music round',
          text: 'Clips on the keys 1 to 9, or one after another.',
          shot: {
            src: '/screens/editor.webp',
            alt: 'The music round in the editor: the title slide, the screens and the clips with their length.'
          }
        },
        {
          title: 'Picture round',
          text: 'A whole folder of photos at once, numbered on screen.',
          shot: {
            src: '/screens/vlaggen.webp',
            alt: 'A picture round with flags: the projector and the TV show the same numbered flag.'
          }
        },
        {
          title: 'Answers',
          text: 'First the question, then the answer, big on screen.',
          shot: {
            src: '/screens/antwoorden.webp',
            alt: 'The answer round during the show, with the question and the answer for each item.'
          },
          beamer: {
            src: '/screens/antwoorden-beamer.webp',
            alt: 'On the projector: the answer to question 2, green.'
          }
        }
      ]
    },
    show: {
      eyebrow: 'During the show',
      title: 'A few keys, all night',
      lead: 'Works with a presenter clicker too.',
      keys: [
        { keys: ['Enter'], label: 'Next round' },
        { keys: ['E'], label: 'End the round' },
        { keys: ['←', '→'], label: 'Back, forward' },
        { keys: ['1–9'], label: 'Play a clip' },
        { keys: ['Space'], label: 'Stop the clip' },
        { keys: ['A'], label: 'Start the sequence' },
        { keys: ['B'], label: 'Screens to black' },
        { keys: ['M'], label: 'Sound off' }
      ]
    },
    print: {
      eyebrow: 'Printing',
      title: 'On paper too',
      shot: {
        src: '/screens/afdrukken.webp',
        alt: 'The print screen: choose the rounds and make an answer sheet, a marking sheet or question cards.'
      },
      items: [
        { title: 'Answer sheet', text: 'For the teams.' },
        { title: 'Marking sheet', text: 'With the answers on it.' },
        { title: 'Question cards', text: 'For you, postcard size.' }
      ]
    },
    download: {
      eyebrow: 'Download',
      title: 'Quizmeister for your Mac',
      lead: 'Version 0.1.0, for Macs with Apple Silicon. The app is in Dutch.',
      button: 'Download for Mac',
      pending: 'The download link is coming.',
      installTitle: 'Opening it the first time',
      install: [
        'Drag Quizmeister to Applications.',
        "macOS blocks it the first time: it isn't signed by Apple yet.",
        'In System Settings › Privacy & Security, click "Open Anyway".',
        'Start with the tour on the dashboard.'
      ]
    },
    footer: { madeBy: 'Quizmeister is made by Remco Hendriksen.' }
  }
}
