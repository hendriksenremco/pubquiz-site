#!/usr/bin/env bash
# Zet <lastmod> in de gebouwde sitemap (.output/public/sitemap.xml), per pagina
# de datum van de laatste commit die de inhoud van die pagina veranderde.
# Google gebruikt lastmod alleen als hij klopt, dus hij komt uit git en niet
# met de hand. Draait na `pnpm generate` (deploy-site.yml); heeft de volledige
# git-geschiedenis nodig (checkout met fetch-depth: 0).
set -euo pipefail
cd "$(dirname "$0")/.."

sitemap=.output/public/sitemap.xml
[ -f "$sitemap" ] || { echo "Geen $sitemap; draai eerst pnpm generate." >&2; exit 1; }

# Bestanden die op elke pagina staan.
common=(app/layouts app/components/SiteHeader.vue app/components/SiteFooter.vue app/components/LangSwitch.vue app/assets nuxt.config.ts)

lastmod() {
  local d
  d=$(git log -1 --format=%cs -- "$@" "${common[@]}" 2>/dev/null || true)
  [ -n "$d" ] || d=$(date -u +%F)
  echo "$d"
}

home=$(lastmod app/pages/index.vue app/content/site.ts app/content/screens.json app/content/release.json app/components/AppShot.vue public/screens)
privacy=$(lastmod app/pages/privacy.vue app/content/privacy.ts app/components/LegalPage.vue)
terms=$(lastmod app/pages/voorwaarden.vue app/content/voorwaarden.ts app/components/LegalPage.vue)

# Haal oude lastmods weg en zet de nieuwe direct na elke <loc>.
sed -i -E '/<lastmod>/d' "$sitemap"
sed -i -E \
  -e "s#(<loc>https://[^/]+/(en)?</loc>)#\1\n    <lastmod>$home</lastmod>#" \
  -e "s#(<loc>https://[^/]+(/en)?/privacy</loc>)#\1\n    <lastmod>$privacy</lastmod>#" \
  -e "s#(<loc>https://[^/]+(/en)?/voorwaarden</loc>)#\1\n    <lastmod>$terms</lastmod>#" \
  "$sitemap"

missing=$(grep -c '<loc>' "$sitemap")
found=$(grep -c '<lastmod>' "$sitemap")
if [ "$missing" != "$found" ]; then
  echo "Niet elke URL in de sitemap kreeg een lastmod ($found van $missing)." >&2
  exit 1
fi
echo "Sitemap: lastmod / $home · privacy $privacy · voorwaarden $terms"
