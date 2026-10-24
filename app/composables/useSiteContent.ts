import { site, type Locale } from '~/content/site'

/** De teksten van de site in de taal van de huidige pagina. */
export function useSiteContent() {
  const { locale } = useI18n()
  return computed(() => site[locale.value as Locale])
}
