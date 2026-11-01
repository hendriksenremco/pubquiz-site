// De voorwaarden, per taal. De app is gratis (besluit van Remco, 1 november 2026, issue #41).
// Komt er iets betaalds bij, zoals de bibliotheek met vragen, werk dit dan bij en zet de datum goed.
import type { Locale } from './site'
import type { PrivacyContent } from './privacy'

export const voorwaarden: Record<Locale, PrivacyContent> = {
  nl: {
    title: 'Voorwaarden',
    description: 'De voorwaarden voor het gebruik van QuizNote.',
    updated: 'Bijgewerkt op 1 november 2026',
    sections: [
      {
        title: 'Wie we zijn',
        paragraphs: [
          'QuizNote is gemaakt door Remco Hendriksen. Vragen of problemen? Mail naar remco@quiznote.app.'
        ]
      },
      {
        title: 'Gratis te gebruiken',
        paragraphs: [
          'QuizNote is gratis. Je mag de app gebruiken voor je eigen quizzen, ook als je ermee verdient, bijvoorbeeld als quizmaster in een café.',
          'Je mag de app niet verkopen, of een aangepaste versie verspreiden alsof die van ons is.'
        ]
      },
      {
        title: 'Zoals hij is',
        paragraphs: [
          'We doen ons best om QuizNote goed te laten werken, maar we kunnen niet beloven dat hij nooit fouten heeft. Probeer je quiz daarom vóór de avond uit op de schermen en speakers die je gebruikt, en bewaar een kopie van je quizzen.',
          'Voor zover de wet dat toestaat, zijn we niet aansprakelijk voor schade door het gebruik van QuizNote, zoals een avond die niet doorgaat of bestanden die verloren gaan.'
        ]
      },
      {
        title: 'Jouw quizzen en bestanden',
        paragraphs: [
          'Je quizzen, video’s, muziek en afbeeldingen blijven van jou en staan op je eigen Mac.',
          'Jij zorgt dat je ze mag gebruiken. Muziek draaien voor publiek vraagt meestal een licentie; veel cafés en zalen hebben die al.'
        ]
      },
      {
        title: 'Met je AI',
        paragraphs: [
          'Maak je een quiz met je eigen AI-assistent, dan gelden ook de voorwaarden van die AI-dienst. Controleer de vragen en antwoorden die je AI maakt.'
        ]
      },
      {
        title: 'Privacy',
        paragraphs: ['Hoe we met gegevens omgaan, staat in de privacyverklaring.']
      },
      {
        title: 'Wijzigingen',
        paragraphs: [
          'We kunnen deze voorwaarden aanpassen. De datum bovenaan laat zien wanneer dat het laatst gebeurde.',
          'Op deze voorwaarden is Nederlands recht van toepassing.'
        ]
      }
    ]
  },

  en: {
    title: 'Terms',
    description: 'The terms for using QuizNote.',
    updated: 'Updated on 1 November 2026',
    sections: [
      {
        title: 'Who we are',
        paragraphs: [
          'QuizNote is made by Remco Hendriksen. Questions or problems? Email remco@quiznote.app.'
        ]
      },
      {
        title: 'Free to use',
        paragraphs: [
          'QuizNote is free. You may use the app for your own quizzes, including when you earn money with them, for example as a quiz host in a pub.',
          'You may not sell the app, or distribute a modified version as if it were ours.'
        ]
      },
      {
        title: 'As is',
        paragraphs: [
          'We do our best to make QuizNote work well, but we can’t promise it is free of bugs. Try your quiz before the night on the screens and speakers you will use, and keep a copy of your quizzes.',
          'As far as the law allows, we are not liable for damage caused by using QuizNote, such as a cancelled quiz night or lost files.'
        ]
      },
      {
        title: 'Your quizzes and files',
        paragraphs: [
          'Your quizzes, videos, music and images remain yours and stay on your own Mac.',
          'You make sure you are allowed to use them. Playing music to an audience usually needs a licence; many pubs and venues already have one.'
        ]
      },
      {
        title: 'With your AI',
        paragraphs: [
          'If you create a quiz with your own AI assistant, the terms of that AI service apply as well. Check the questions and answers your AI makes.'
        ]
      },
      {
        title: 'Privacy',
        paragraphs: ['How we handle data is described in the privacy statement.']
      },
      {
        title: 'Changes',
        paragraphs: [
          'We may change these terms. The date at the top shows when that last happened.',
          'These terms are governed by Dutch law.'
        ]
      }
    ]
  }
}
