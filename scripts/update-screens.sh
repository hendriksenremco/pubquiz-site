#!/usr/bin/env bash
# Zet de screenshots uit de app (site-screens.zip bij een release, of ../pubquiz/test-results)
# om naar public/screens: WebP, 1600 px breed (beamerbeelden 1200 px), plus een versie half zo
# breed (-sm.webp) voor telefoons. Gebruik: scripts/update-screens.sh <map met de png's>
set -euo pipefail

src="${1:?Gebruik: scripts/update-screens.sh MAP-MET-PNGS}"
out="$(cd "$(dirname "$0")/.." && pwd)/public/screens"
im="$(command -v magick || command -v convert)"

# png uit de app → naam op de site
map=(
  "tour-muziek:muziek"
  "tour-muziek-beamer:muziek-beamer"
  "tour-vragen:vragen"
  "tour-vragen-beamer:vragen-beamer"
  "tour-vlaggen:vlaggen"
  "tour-editor:editor"
  "tour-antwoorden:antwoorden"
  "tour-antwoorden-beamer:antwoorden-beamer"
  "tour-afdrukken:afdrukken"
  "ai-music-round:ai-quiz"
)

missing=0
for pair in "${map[@]}"; do
  from="$src/${pair%%:*}.png"
  to="${pair##*:}"
  if [ ! -f "$from" ]; then
    echo "Ontbreekt: $from" >&2
    missing=1
    continue
  fi
  case "$to" in
    *-beamer) w=1200 ;;
    *) w=1600 ;;
  esac
  "$im" "$from" -resize "${w}x" -quality 82 "$out/$to.webp"
  "$im" "$from" -resize "$((w / 2))x" -quality 82 "$out/$to-sm.webp"
  echo "$to.webp"
done
exit "$missing"
