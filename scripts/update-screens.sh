#!/usr/bin/env bash
# Zet de screenshots uit de app (site-screens.zip bij een release, of ../pubquiz/test-results)
# om naar public/screens: WebP, 1600 px breed (beamerbeelden 1200 px), plus een versie half zo
# breed (-sm.webp) voor telefoons. Gebruik: scripts/update-screens.sh <map met de png's>
#
# De app maakt site-*.png (Nederlands) en site-*.en.png (Engels), met alleen de beamer in beeld
# (e2e/site-shots.spec.ts). Oudere releases hebben tour-*.png; die werken ook.
# Engelse beelden komen in public/screens/en; welke er zijn, staat in app/content/screens.json.
set -euo pipefail

src="${1:?Gebruik: scripts/update-screens.sh MAP-MET-PNGS}"
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/public/screens"
im="$(command -v magick || command -v convert)"
mkdir -p "$out/en"

# naam in de app → naam op de site
map=(
  "muziek:muziek"
  "muziek-beamer:muziek-beamer"
  "vragen:vragen"
  "vragen-beamer:vragen-beamer"
  "vlaggen:vlaggen"
  "vlaggen-beamer:vlaggen-beamer"
  "editor:editor"
  "antwoorden:antwoorden"
  "antwoorden-beamer:antwoorden-beamer"
  "afdrukken:afdrukken"
)

# Het eerste bestand dat bestaat: site-<naam>, anders tour-<naam>.
find_png() {
  local name="$1" suffix="$2"
  for prefix in site tour; do
    if [ -f "$src/$prefix-$name$suffix.png" ]; then
      echo "$src/$prefix-$name$suffix.png"
      return
    fi
  done
}

convert_png() {
  local from="$1" to="$2"
  local w=1600
  case "$to" in *-beamer.webp) w=1200 ;; esac
  "$im" "$from" -resize "${w}x" -quality 82 "$to"
  "$im" "$from" -resize "$((w / 2))x" -quality 82 "${to%.webp}-sm.webp"
  echo "${to#"$root/"}"
}

missing=0
english=()
for pair in "${map[@]}"; do
  name="${pair%%:*}"
  to="${pair##*:}"
  nl="$(find_png "$name" "")"
  if [ -z "$nl" ]; then
    echo "Ontbreekt: site-$name.png" >&2
    missing=1
  else
    convert_png "$nl" "$out/$to.webp"
  fi
  en="$(find_png "$name" ".en")"
  if [ -n "$en" ]; then
    convert_png "$en" "$out/en/$to.webp"
    english+=("$to")
  fi
done

# De AI-quiz heeft geen eigen naam met site- of tour-.
if [ -f "$src/ai-music-round.png" ]; then
  convert_png "$src/ai-music-round.png" "$out/ai-quiz.webp"
else
  echo "Ontbreekt: ai-music-round.png" >&2
  missing=1
fi
if [ -f "$src/ai-music-round.en.png" ]; then
  convert_png "$src/ai-music-round.en.png" "$out/en/ai-quiz.webp"
  english+=("ai-quiz")
fi

# Welke Engelse beelden er zijn; site.ts valt voor de rest terug op het Nederlandse beeld.
printf '{\n  "en": [%s]\n}\n' "$(printf '"%s", ' "${english[@]+"${english[@]}"}" | sed 's/, $//')" \
  > "$root/app/content/screens.json"

exit "$missing"
