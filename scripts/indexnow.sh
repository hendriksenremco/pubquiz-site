#!/usr/bin/env bash
# Meldt de pagina's van quiznote.app bij IndexNow (Bing, Yandex, Seznam, Naver en wie verder meedoet),
# zodat die zoekmachines een nieuwe versie snel ophalen. Google doet niet mee; daarvoor is Search Console (#71).
# De sleutel staat als <sleutel>.txt in public/. Draait na elke deploy (deploy-site.yml); faalt nooit hard.
set -u
cd "$(dirname "$0")/.."
site="${NUXT_PUBLIC_SITE_URL:-https://quiznote.app}"
host="${site#https://}"
keyfile=$(ls public/ | grep -E '^[0-9a-f]{32}\.txt$' | head -1)
[ -n "$keyfile" ] || { echo "Geen IndexNow-sleutel in public/"; exit 0; }
key="${keyfile%.txt}"
urls=$(grep -o '<loc>[^<]*</loc>' public/sitemap.xml | sed 's/<[^>]*>//g' | sed 's/.*/"&"/' | paste -sd, -)
body="{\"host\":\"$host\",\"key\":\"$key\",\"keyLocation\":\"$site/$keyfile\",\"urlList\":[$urls]}"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST https://api.indexnow.org/indexnow \
  -H 'Content-Type: application/json; charset=utf-8' --data "$body")
echo "IndexNow: HTTP $code"
exit 0
