// Alle teksten van de site, per taal. Nederlands: "je", korte zinnen, gewone werkwoorden.
// De woorden tussen aanhalingstekens zijn de woorden in de app zelf. De app is (nog) alleen Nederlands,
// dus de Engelse teksten noemen geen knoppen bij naam.

export type Locale = 'nl' | 'en'

export interface Shot {
  src: string
  alt: string
}

export interface SiteContent {
  meta: { title: string; description: string }
  skip: string
  nav: { how: string; features: string; show: string; download: string; language: string }
  cta: { download: string; downloadShort: string; how: string }
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
  how: { eyebrow: string; title: string; items: { title: string; text: string }[] }
  rounds: {
    eyebrow: string
    title: string
    lead: string
    items: { title: string; text: string; shot: Shot; beamer?: Shot }[]
  }
  show: {
    eyebrow: string
    title: string
    lead: string
    keys: { keys: string[]; label: string }[]
    extra: string
  }
  prepare: { eyebrow: string; title: string; items: { title: string; text: string }[] }
  print: { eyebrow: string; title: string; lead: string; shot: Shot; items: { title: string; text: string }[] }
  download: {
    eyebrow: string
    title: string
    lead: string
    button: string
    pending: string
    installTitle: string
    install: string[]
  }
  faq: { title: string; items: { q: string; a: string }[] }
  footer: { madeBy: string }
}

export const site: Record<Locale, SiteContent> = {
  nl: {
    meta: {
      title: 'Quizmeister · de hele quizavond vanaf één Mac',
      description:
        "Quizmeister is een Mac-app voor quizmasters. Eén laptop stuurt de beamer, de tv's en de speakers aan: je klikt je quiz één keer in elkaar en speelt hem af met een paar toetsen."
    },
    skip: 'Naar de inhoud',
    nav: {
      how: 'Zo werkt het',
      features: 'Rondes',
      show: 'Tijdens de show',
      download: 'Download',
      language: 'Taal'
    },
    cta: { download: 'Download voor Mac', downloadShort: 'Download', how: 'Zo werkt het' },
    hero: {
      eyebrow: 'Voor quizmasters met een Mac',
      title: 'De hele quizavond vanaf één laptop',
      lead: "Quizmeister stuurt de beamer, de tv's en de speakers in de zaal aan. Je klikt je quiz één keer in elkaar en speelt hem af met een paar toetsen. Geen PowerPoint, Spotify en losse filmpjes meer naast elkaar.",
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
        {
          title: 'Schermen',
          text: 'Elke beamer en tv krijgt een eigen beeld. De hele avond loopt er een video, en een ronde kan die vervangen door slides, afbeeldingen of zwart.'
        },
        {
          title: 'Geluid',
          text: 'Achtergrondmuziek voor de zaal en fragmenten op een eigen speaker. De muziek gaat vanzelf zachter zodra er een fragment speelt.'
        },
        {
          title: 'Jij',
          text: 'Op je laptop zie je wat elk scherm laat zien, welke ronde er loopt en wat er komt. Met een paar toetsen ga je verder.'
        }
      ]
    },
    how: {
      eyebrow: 'Zo werkt het',
      title: 'Eén keer klaarzetten, dan spelen',
      items: [
        {
          title: 'Klik je quiz in elkaar',
          text: "Maak rondes, sleep je video's, muziek en foto's erin en kies per ronde wat de schermen en de speakers doen."
        },
        {
          title: 'Koppel de zaal',
          text: 'Sluit de beamer, de tv\'s en de speakers aan en koppel ze bij "Show voorbereiden". Een testtoon laat horen of alles werkt.'
        },
        {
          title: 'Speel de avond af',
          text: 'Start de show. Met Enter ga je naar de volgende ronde, met de cijfers speel je fragmenten.'
        }
      ]
    },
    rounds: {
      eyebrow: 'Rondes',
      title: 'Elke ronde die je kent',
      lead: 'Een gewone ronde, een muziekronde, een afbeeldingenronde, een pauze en de antwoorden. Per ronde kies je wat de schermen en de speakers doen. Na "Einde ronde" valt alles vanzelf terug.',
      items: [
        {
          title: 'Vragen en slides',
          text: 'Een titel, een vraag met of zonder afbeelding, of alleen het nummer van de vraag terwijl jij voorleest. Je zet ze klaar in de editor en klikt ze door met de pijltjes of een presenter-clicker.',
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
          text: 'Fragmenten met een begin, een eind en een fade. Start ze met de toetsen 1 tot en met 9, of laat ze na elkaar spelen als "automatische reeks", met aftellen ertussen. Het nummer van het fragment staat groot op de beamer.',
          shot: {
            src: '/screens/editor.webp',
            alt: 'De muziekronde in de editor: de titelslide, de schermen en de fragmenten met hun lengte.'
          }
        },
        {
          title: 'Afbeeldingenronde',
          text: 'Zet een hele map met foto\'s in één keer in een ronde. Ze krijgen een nummer in beeld en wisselen vanzelf, steeds opnieuw als je "Loop" aanzet.',
          shot: {
            src: '/screens/vlaggen.webp',
            alt: 'Een afbeeldingenronde met vlaggen: op de beamer en de tv staat dezelfde genummerde vlag.'
          }
        },
        {
          title: 'Antwoorden',
          text: 'Zet de antwoordenronde waar je wilt, ook pas aan het eind. Per vraag eerst de vraag zelf, dan het antwoord groot in beeld. Een fragment speelt nog een keer, en na een uitsnede kan de hele foto in beeld.',
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
      lead: 'Je laptop is het bedieningsscherm. Je ziet wat elk scherm laat zien, de rondes, de fragmenten, de mixer en je notities. De rest doe je met een paar toetsen, of met een presenter-clicker.',
      keys: [
        { keys: ['Enter'], label: 'Volgende ronde' },
        { keys: ['E'], label: 'Einde ronde' },
        { keys: ['←', '→'], label: 'Door slides, fragmenten of antwoorden' },
        { keys: ['1–9'], label: 'Fragment spelen' },
        { keys: ['Spatie'], label: 'Fragment stoppen' },
        { keys: ['A'], label: 'Reeks starten of pauzeren' },
        { keys: ['B'], label: 'Beeld op zwart' },
        { keys: ['M'], label: 'Geluid uit' }
      ],
      extra: 'Loopt de app vast of valt hij uit? Open hem opnieuw en ga verder waar je was: dezelfde ronde, dezelfde fragmenten, dezelfde volumes.'
    },
    prepare: {
      eyebrow: 'Voorbereiden',
      title: 'Klaarzetten zonder gedoe',
      items: [
        {
          title: 'Show voorbereiden',
          text: 'Koppel je schermen en speakers, speel een testtoon af en zie vooraf of er bestanden ontbreken. De app onthoudt de koppeling voor de volgende keer.'
        },
        {
          title: 'Eén map per quiz',
          text: 'Een quiz is één map met alles erin. Neem hem mee op een usb-stick of deel hem met "Exporteer als zip".'
        },
        {
          title: 'Op basis van vorige keer',
          text: 'Met "Nieuwe quiz op basis van deze" neem je de schermen, de sfeer en eventueel de rondes van vorige keer over.'
        },
        {
          title: 'Slepen en ordenen',
          text: "Sleep video's, muziek en foto's naar binnen en zet ze in mappen. Alles wordt vanzelf bewaard, en ⌘Z maakt ongedaan."
        }
      ]
    },
    print: {
      eyebrow: 'Afdrukken',
      title: 'Ook op papier',
      lead: 'Drie formulieren als pdf, klaar om te printen.',
      shot: {
        src: '/screens/afdrukken.webp',
        alt: 'Het scherm Afdrukken: kies de rondes en maak een antwoordformulier, een nakijkformulier of vragenkaarten.'
      },
      items: [
        {
          title: 'Antwoordformulier',
          text: 'Voor de teams. Tot vier rondes per A4, elke ronde in een eigen vak om los te knippen.'
        },
        {
          title: 'Nakijkformulier',
          text: 'Precies dezelfde opmaak, met de antwoorden al op de regels. Leg hem naast een ingevuld formulier.'
        },
        {
          title: 'Vragenkaarten',
          text: 'Voor jezelf: per ronde een kaart op ansichtkaartformaat met de vragen en de antwoorden.'
        }
      ]
    },
    download: {
      eyebrow: 'Download',
      title: 'Quizmeister voor je Mac',
      lead: 'Versie 0.1.0, voor Macs met Apple Silicon.',
      button: 'Download voor Mac',
      pending: 'De downloadlink komt hier te staan zodra de eerste versie online staat.',
      installTitle: 'De eerste keer openen',
      install: [
        "Open het dmg-bestand en sleep Quizmeister naar je map Programma's.",
        'Open Quizmeister. macOS blokkeert de app de eerste keer, omdat hij nog niet door Apple is ondertekend.',
        'Ga naar Systeeminstellingen › Privacy en beveiliging en klik bij Quizmeister op "Open toch".',
        'Daarna opent de app gewoon, ook de volgende keren. Op het dashboard staat een rondleiding: een korte quiz die laat zien wat de app kan.'
      ]
    },
    faq: {
      title: 'Vragen',
      items: [
        {
          q: 'Heb ik internet nodig?',
          a: 'Nee. Quizmeister werkt met de bestanden op je eigen Mac. Handig in een kantine met slechte wifi.'
        },
        {
          q: 'Werkt het ook op Windows?',
          a: 'Nee, Quizmeister is er alleen voor de Mac.'
        },
        {
          q: 'Hoeveel schermen kan ik gebruiken?',
          a: 'Elke beamer of tv die je Mac als extra beeldscherm ziet, krijgt een eigen beeld.'
        },
        {
          q: 'Kan ik een quiz delen?',
          a: 'Ja. Een quiz is één map met alle bestanden erin. Met "Exporteer als zip" stuur je hem door.'
        }
      ]
    },
    footer: { madeBy: 'Quizmeister is gemaakt door Remco Hendriksen.' }
  },

  en: {
    meta: {
      title: 'Quizmeister · run the whole quiz night from one Mac',
      description:
        'Quizmeister is a Mac app for quizmasters. One laptop runs the projector, the TVs and the speakers: you build your quiz once and play it with a few keys.'
    },
    skip: 'Skip to content',
    nav: {
      how: 'How it works',
      features: 'Rounds',
      show: 'During the show',
      download: 'Download',
      language: 'Language'
    },
    cta: { download: 'Download for Mac', downloadShort: 'Download', how: 'How it works' },
    hero: {
      eyebrow: 'For quizmasters with a Mac',
      title: 'Run the whole quiz night from one laptop',
      lead: 'Quizmeister drives the projector, the TVs and the speakers in the room. You build your quiz once and play it with a few keys. No more juggling PowerPoint, Spotify and loose video files.',
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
        {
          title: 'Screens',
          text: 'Every projector and TV gets its own picture. A video loops all evening, and a round can replace it with slides, pictures or black.'
        },
        {
          title: 'Sound',
          text: 'Background music for the room and clips on their own speaker. The music dips by itself as soon as a clip plays.'
        },
        {
          title: 'You',
          text: "Your laptop shows what each screen shows, which round is on and what's next. A few keys take you onward."
        }
      ]
    },
    how: {
      eyebrow: 'How it works',
      title: 'Set it up once, then play',
      items: [
        {
          title: 'Build your quiz',
          text: 'Make rounds, drag in your videos, music and photos, and choose per round what the screens and the speakers do.'
        },
        {
          title: 'Connect the room',
          text: 'Plug in the projector, the TVs and the speakers and link them in the show setup. A test tone tells you everything works.'
        },
        {
          title: 'Play the night',
          text: 'Start the show. Enter takes you to the next round, the number keys play your clips.'
        }
      ]
    },
    rounds: {
      eyebrow: 'Rounds',
      title: 'Every round you know',
      lead: 'A regular round, a music round, a picture round, a break and the answers. Per round you choose what the screens and the speakers do. When the round ends, everything returns to normal by itself.',
      items: [
        {
          title: 'Questions and slides',
          text: 'A title, a question with or without a picture, or just the question number while you read it out. Set them up in the editor and click through with the arrow keys or a presenter clicker.',
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
          text: 'Clips with a start, an end and a fade. Play them with the keys 1 to 9, or let them run one after another with a countdown in between. The clip number shows up big on the projector.',
          shot: {
            src: '/screens/editor.webp',
            alt: 'The music round in the editor: the title slide, the screens and the clips with their length.'
          }
        },
        {
          title: 'Picture round',
          text: 'Add a whole folder of photos to a round in one go. They get a number on screen and change by themselves, over and over if you like.',
          shot: {
            src: '/screens/vlaggen.webp',
            alt: 'A picture round with flags: the projector and the TV show the same numbered flag.'
          }
        },
        {
          title: 'Answers',
          text: 'Put the answer round wherever you like, even at the very end. For each question, first the question itself, then the answer big on screen. A clip plays once more, and after a crop the whole photo can appear.',
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
      lead: 'Your laptop is the control screen. You see what every screen shows, the rounds, the clips, the mixer and your notes. The rest is a few keys, or a presenter clicker.',
      keys: [
        { keys: ['Enter'], label: 'Next round' },
        { keys: ['E'], label: 'End the round' },
        { keys: ['←', '→'], label: 'Step through slides, clips or answers' },
        { keys: ['1–9'], label: 'Play a clip' },
        { keys: ['Space'], label: 'Stop the clip' },
        { keys: ['A'], label: 'Start or pause the sequence' },
        { keys: ['B'], label: 'Screens to black' },
        { keys: ['M'], label: 'Sound off' }
      ],
      extra: 'Did the app freeze or quit? Open it again and carry on where you were: the same round, the same clips, the same volumes.'
    },
    prepare: {
      eyebrow: 'Preparing',
      title: 'Set up without the hassle',
      items: [
        {
          title: 'Show setup',
          text: 'Link your screens and speakers, play a test tone and see in advance whether any files are missing. The app remembers the setup for next time.'
        },
        {
          title: 'One folder per quiz',
          text: 'A quiz is one folder with everything in it. Take it along on a USB stick, or share it as a zip file.'
        },
        {
          title: 'Based on last time',
          text: 'Start a new quiz from an old one and keep the screens, the atmosphere and, if you like, the rounds.'
        },
        {
          title: 'Drag and organise',
          text: 'Drag in videos, music and photos and sort them into folders. Everything saves by itself, and ⌘Z undoes.'
        }
      ]
    },
    print: {
      eyebrow: 'Printing',
      title: 'On paper too',
      lead: 'Three forms as PDF, ready to print.',
      shot: {
        src: '/screens/afdrukken.webp',
        alt: 'The print screen: choose the rounds and make an answer sheet, a marking sheet or question cards.'
      },
      items: [
        {
          title: 'Answer sheet',
          text: 'For the teams. Up to four rounds per A4 page, each round in its own box to cut out.'
        },
        {
          title: 'Marking sheet',
          text: 'Exactly the same layout, with the answers already on the lines. Lay it next to a filled-in sheet.'
        },
        {
          title: 'Question cards',
          text: 'For you: one postcard-sized card per round with the questions and the answers.'
        }
      ]
    },
    download: {
      eyebrow: 'Download',
      title: 'Quizmeister for your Mac',
      lead: 'Version 0.1.0, for Macs with Apple Silicon.',
      button: 'Download for Mac',
      pending: 'The download link will appear here as soon as the first version is online.',
      installTitle: 'Opening it the first time',
      install: [
        'Open the dmg file and drag Quizmeister to your Applications folder.',
        "Open Quizmeister. The first time, macOS blocks the app because it isn't signed by Apple yet.",
        'Go to System Settings › Privacy & Security and click "Open Anyway" next to Quizmeister.',
        'After that, the app opens normally, every time. The dashboard has a tour: a short quiz that shows what the app can do.'
      ]
    },
    faq: {
      title: 'Questions',
      items: [
        {
          q: 'Do I need internet?',
          a: 'No. Quizmeister works with the files on your own Mac. Handy in a clubhouse with poor Wi-Fi.'
        },
        {
          q: 'Is the app in English?',
          a: 'The menus and buttons in the app are in Dutch.'
        },
        {
          q: 'Does it run on Windows?',
          a: 'No, Quizmeister is for the Mac only.'
        },
        {
          q: 'How many screens can I use?',
          a: 'Every projector or TV your Mac sees as an extra display gets its own picture.'
        }
      ]
    },
    footer: { madeBy: 'Quizmeister is made by Remco Hendriksen.' }
  }
}
