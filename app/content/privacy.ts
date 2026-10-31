// De privacyverklaring, per taal. Klopt alleen zolang de site en de app doen wat hier staat:
// verandert er iets aan analytics, hosting of de app, werk dit dan bij en zet de datum goed.
import type { Locale } from './site'

export interface PrivacyContent {
  title: string
  description: string
  updated: string
  sections: { title: string; paragraphs: string[] }[]
}

export const privacy: Record<Locale, PrivacyContent> = {
  nl: {
    title: 'Privacyverklaring',
    description: 'Welke gegevens de site en de app van QuizNote gebruiken, en waarom.',
    updated: 'Bijgewerkt op 31 oktober 2026',
    sections: [
      {
        title: 'Wie we zijn',
        paragraphs: [
          'QuizNote is gemaakt door Remco Hendriksen. Vragen over privacy stuur je naar support@quiznote.app.'
        ]
      },
      {
        title: 'De app',
        paragraphs: [
          'QuizNote verzamelt niets over jou. De app werkt offline en je quizzen, video’s en muziek blijven op je eigen Mac. De app stuurt geen gebruiksgegevens of foutrapporten naar ons.',
          'Maak je een quiz met je eigen AI-assistent, dan praat die assistent alleen op je Mac met QuizNote. Wat je aan je AI vraagt, valt onder de voorwaarden van die AI-dienst.',
          'De plug-ins Licht en Afstandsbediening praten alleen met apparaten in je eigen netwerk.'
        ]
      },
      {
        title: 'Deze site',
        paragraphs: [
          'We meten hoe de site gebruikt wordt met PostHog, in hun Europese datacenter. Zo zien we welke pagina’s je bekijkt, waar je klikt, van welke site je komt, en welk land, apparaat en welke browser je gebruikt. Je IP-adres slaan we niet op.',
          'Daarvoor gebruiken we geen cookies en bewaren we niets in je browser. Je ziet daarom ook geen cookiemelding.',
          'We gebruiken dit alleen om de site beter te maken, en bewaren het niet langer dan daarvoor nodig is. We verkopen niets en delen niets met adverteerders.',
          'De site staat op Firebase Hosting van Google. Zoals elke webserver houdt die korte tijd technische logboeken bij, met onder meer je IP-adres, om de site te leveren en te beveiligen.',
          'De letters komen van onze eigen server, niet van Google Fonts.'
        ]
      },
      {
        title: 'Als je mailt',
        paragraphs: [
          'Mail je ons, dan gebruiken we je adres en je bericht alleen om je te antwoorden. De mail loopt via Google Workspace.'
        ]
      },
      {
        title: 'Je rechten',
        paragraphs: [
          'Je mag vragen welke gegevens we van je hebben, en die laten verbeteren of verwijderen. Mail daarvoor naar support@quiznote.app.',
          'Ben je het niet eens met hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens.'
        ]
      }
    ]
  },

  en: {
    title: 'Privacy statement',
    description: 'What data the QuizNote website and app use, and why.',
    updated: 'Updated on 31 October 2026',
    sections: [
      {
        title: 'Who we are',
        paragraphs: [
          'QuizNote is made by Remco Hendriksen. Send questions about privacy to support@quiznote.app.'
        ]
      },
      {
        title: 'The app',
        paragraphs: [
          'QuizNote collects nothing about you. The app works offline, and your quizzes, videos and music stay on your own Mac. The app sends no usage data or crash reports to us.',
          'If you create a quiz with your own AI assistant, that assistant only talks to QuizNote on your Mac. What you ask your AI is covered by the terms of that AI service.',
          'The light and remote control plug-ins only talk to devices on your own network.'
        ]
      },
      {
        title: 'This website',
        paragraphs: [
          'We measure how the site is used with PostHog, in their European data centre. That shows us which pages you view, where you click, which site you came from, and which country, device and browser you use. We don’t store your IP address.',
          'We use no cookies for this and store nothing in your browser, which is why you see no cookie banner.',
          'We only use this to improve the site, and keep it no longer than needed for that. We sell nothing and share nothing with advertisers.',
          'The site is hosted on Google’s Firebase Hosting. Like any web server, it keeps short-lived technical logs, including your IP address, to deliver and secure the site.',
          'The fonts come from our own server, not from Google Fonts.'
        ]
      },
      {
        title: 'If you email us',
        paragraphs: [
          'If you email us, we only use your address and message to reply. Email runs through Google Workspace.'
        ]
      },
      {
        title: 'Your rights',
        paragraphs: [
          'You can ask which data we hold about you, and have it corrected or deleted. Email support@quiznote.app.',
          'If you disagree with how we handle your data, you can complain to your data protection authority; in the Netherlands that is the Autoriteit Persoonsgegevens.'
        ]
      }
    ]
  }
}
