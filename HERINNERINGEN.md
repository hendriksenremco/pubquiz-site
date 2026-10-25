# Herinneringen

## Vanaf 8 november 2026: DMARC van quiznote.app strenger zetten

De mail van quiznote.app is op 25 oktober 2026 ingericht (Google Workspace, SPF en DKIM). DMARC staat nog op "alleen kijken".

1. Controleer eerst of het goed gaat: stuur een mail vanaf `remco@quiznote.app` naar een ander adres, open hem in Gmail › ⋮ › "Origineel weergeven" en kijk of SPF, DKIM en DMARC alle drie op **PASS** staan.
2. Wijzig dan bij TransIP › quiznote.app › DNS het TXT-record `_dmarc`:
   - van `v=DMARC1; p=none;`
   - naar `v=DMARC1; p=quarantine;`

Daarna komen vervalste mails uit naam van quiznote.app in de spam. Haal deze herinnering weg als het gedaan is.
