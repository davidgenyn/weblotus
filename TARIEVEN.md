# Tarieven: van Google Sheet naar de website

De prijssimulator op de site (`preview-x7k2/offerte.html`) haalt zijn prijzen uit de Google Sheet **"Tarieven"**.
**Een prijs wijzigen doe je alleen in de Sheet.** De site neemt de nieuwe prijs vanzelf over.
Je hoeft niets op GitHub aan te passen.

## Hoe het werkt

```
Google Sheet "Tarieven"  →  Apps Script (web-app)  →  offerte.html (in de browser van de bezoeker)
       (jij wijzigt)          (leest de Sheet)          (toont en rekent met de prijzen)
```

| Onderdeel | Waar | Wat het doet |
|---|---|---|
| Sheet "Tarieven", tabblad `Tarieven` | Google Drive van lotusflow.contact@gmail.com | De enige plaats waar de prijzen staan |
| Apps Script `tarieven.gs` | In dezelfde Sheet: Extensies → Apps Script | Leest het tabblad en geeft per `id` de `prijs` en `vanaf` terug. Schrijft niets. |
| `TARIEVEN_URL` in `offerte.html` | Bovenaan het script in de pagina | Het adres van de Apps Script-web-app |
| Lijst `TARIEVEN` in `offerte.html` | Net onder `TARIEVEN_URL` | **Reserve**: wordt eerst getoond en vervangen zodra de Sheet-prijzen binnenkomen; blijft staan als het ophalen mislukt |
| n8n-workflow "Project 6b - AI-agent Offerte" | Dell | Leest dezelfde Sheet. De offertemail gebruikt dus dezelfde prijzen. |

Het werkt zonder de Dell: het Apps Script draait bij Google.

## De Sheet

Rij 1 bevat de kolomnamen: `id`, `dienst`, `post`, `betaling`, `prijs`, `vanaf`.

| Kolom | Gebruikt door de site? | Opmerking |
|---|---|---|
| `id` | Ja | **Nooit wijzigen.** De site herkent elke post aan dit id. |
| `prijs` | Ja | Een getal zonder €-teken, bv. `1100` |
| `vanaf` | Ja | Vinkje, TRUE/WAAR, ja, x of 1 betekent dat de site "vanaf" voor de prijs zet |
| `dienst`, `post`, `betaling` | Nee | De naam van de post en eenmalig/maandelijks staan in `offerte.html`, want de berekening steunt erop |

Huidige id's: `basiswebsite`, `extra_pagina`, `seo_geo`, `automatisering`, `ai_contactformulier`, `onderhoud_website`, `onderhoud_ai`.

## Een prijs wijzigen

1. Open de Sheet "Tarieven".
2. Pas het getal in de kolom `prijs` aan (en eventueel `vanaf`).
3. Klaar. Bij het volgende bezoek aan `offerte.html` staat de nieuwe prijs er.

Optioneel: werk ook de reservelijst `TARIEVEN` in `offerte.html` bij, zodat de reserve niet verouderd raakt. Dat is niet verplicht.

## Eenmalige installatie van het Apps Script

1. Open de Sheet "Tarieven" (account lotusflow.contact@gmail.com).
2. Menu **Extensies → Apps Script**.
3. Wis de voorbeeldcode en plak de volledige inhoud van `tarieven.gs` (staat hieronder). Klik op het diskette-icoon (Opslaan).
4. Klik rechtsboven op **Implementeren → Nieuwe implementatie**.
5. Klik naast "Type selecteren" op het tandwiel en kies **Web-app**.
6. Vul in:
   - Beschrijving: `Tarieven voor offerte.html`
   - Uitvoeren als: **Ik** (lotusflow.contact@gmail.com)
   - Wie heeft toegang: **Iedereen**
7. Klik op **Implementeren**. Google vraagt toestemming: kies het account, dan Geavanceerd → Ga naar (projectnaam) → Toestaan.
8. Kopieer de **URL van de web-app** (eindigt op `/exec`).
9. Test: plak die URL in je browser. Je moet iets zien als
   `{"tarieven":[{"id":"basiswebsite","prijs":1100,"vanaf":false}, ...]}`
10. Zet de URL in `offerte.html` bij `var TARIEVEN_URL = "…";` en upload `offerte.html` naar GitHub.

"Iedereen" betekent dat iedereen met de URL de prijzen kan lezen. Dat zijn dezelfde prijzen die al op de site staan. De rest van de Sheet (bv. het tabblad Offertes) is via deze URL **niet** leesbaar.

## Het script later aanpassen (zonder dat de URL verandert)

Na een wijziging in de code is **opslaan alleen niet genoeg**. De web-app blijft de oude versie draaien tot je een nieuwe versie publiceert:

1. **Implementeren → Implementaties beheren**.
2. Klik op het potlood (Bewerken) bij de bestaande implementatie.
3. Bij Versie: kies **Nieuwe versie** → **Implementeren**.

Zo blijft de URL dezelfde. Kies **niet** "Nieuwe implementatie", want die geeft een nieuwe URL en dan moet `offerte.html` aangepast worden.

Alleen een prijs wijzigen in de Sheet vraagt **geen** nieuwe versie.

## Een nieuwe post toevoegen

Dat vraagt meer dan de Sheet:

1. Nieuwe rij in de Sheet met een nieuw `id`.
2. In `offerte.html`: de post toevoegen aan de lijst `TARIEVEN` en een vakje met `data-prijs="nieuw_id"` op de pagina zetten.
3. In n8n (Code-node "Prijscontrole"): de post toevoegen als die in de offerte moet komen.

## De prijzen laden niet: wat nakijken

| Controle | Hoe |
|---|---|
| Werkt de web-app? | Open de `/exec`-URL in een privévenster. Zie je JSON, dan werkt hij. |
| Foutmelding in de JSON | `Tabblad "Tarieven" niet gevonden`: de naam van het tabblad is gewijzigd. `Kolom "id" of "prijs" ontbreekt`: rij 1 is gewijzigd. |
| Vraagt Google om in te loggen? | "Wie heeft toegang" staat niet op **Iedereen**. Pas het aan via Implementaties beheren. |
| Wat zegt de browser? | Open `offerte.html`, druk op F12 en kijk in de Console naar `Tarieven niet geladen, reserveprijzen gebruikt: …` |
| Klopt de URL in `offerte.html`? | Ze moet beginnen met `https://` en eindigen op `/exec` |

Google start het script soms traag op (enkele seconden). De pagina toont dan eerst kort de reserveprijzen en vervangt ze zodra het antwoord er is. Lukt het ophalen helemaal niet, dan blijven de reserveprijzen staan. De simulator blijft dus altijd werken.

## tarieven.gs

```javascript
/**
 * Weblotus – Tarieven voor de prijssimulator (offerte.html)
 *
 * Geeft het tabblad "Tarieven" terug als JSON:
 *   { "tarieven": [ { "id": "basiswebsite", "prijs": 1100, "vanaf": false }, ... ],
 *     "bijgewerkt": "2026-10-25T09:00:00.000Z" }
 *
 * Het script LEEST alleen. Het schrijft niets in de Sheet.
 * Kolommen in rij 1 (volgorde maakt niet uit): id, dienst, post, betaling, prijs, vanaf
 */

var TABBLAD = 'Tarieven';

function doGet() {
  var blad = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TABBLAD);
  if (!blad) {
    return antwoord({ fout: 'Tabblad "' + TABBLAD + '" niet gevonden' });
  }

  var waarden = blad.getDataRange().getValues();
  var kop = waarden[0].map(function (k) { return String(k).trim().toLowerCase(); });
  var kId = kop.indexOf('id');
  var kPrijs = kop.indexOf('prijs');
  var kVanaf = kop.indexOf('vanaf');
  if (kId < 0 || kPrijs < 0) {
    return antwoord({ fout: 'Kolom "id" of "prijs" ontbreekt in rij 1' });
  }

  var tarieven = [];
  for (var r = 1; r < waarden.length; r++) {
    var rij = waarden[r];
    var id = String(rij[kId]).trim();
    var prijs = Number(rij[kPrijs]);
    if (!id || isNaN(prijs)) { continue; }   // lege of onvolledige rij overslaan
    tarieven.push({
      id: id,
      prijs: prijs,
      vanaf: kVanaf >= 0 ? isJa(rij[kVanaf]) : false
    });
  }

  return antwoord({ tarieven: tarieven, bijgewerkt: new Date().toISOString() });
}

// "vanaf" mag een vinkje, TRUE/WAAR, ja, x of 1 zijn
function isJa(w) {
  if (w === true) { return true; }
  var s = String(w).trim().toLowerCase();
  return s === 'true' || s === 'waar' || s === 'ja' || s === 'x' || s === '1';
}

function antwoord(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```
