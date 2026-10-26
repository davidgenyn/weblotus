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
