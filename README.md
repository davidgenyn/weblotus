# Weblotus — website weblotus.be

Bedrijfssite van **Weblotus** (David Genyn): zichtbare websites, AI-automatisering, Google & e-marketing en onderhoud voor zelfstandigen en KMO's.

> **Status:** de site is nog niet gelanceerd. De echte site staat op het geheime pad **https://weblotus.be/preview-x7k2/** (met `noindex`, niet vindbaar in Google). Het hoofddomein toont een placeholder.

---

## Inhoud

1. [Overzicht: wat staat waar](#1-overzicht-wat-staat-waar)
2. [Domeinnaam en DNS (Vimexx)](#2-domeinnaam-en-dns-vimexx)
3. [E-mail info@weblotus.be](#3-e-mail-infoweblotusbe)
4. [Hosting: GitHub Pages en SSL-certificaat](#4-hosting-github-pages-en-ssl-certificaat)
5. [Bestanden in deze repo](#5-bestanden-in-deze-repo)
6. [De pagina's](#6-de-paginas)
7. [Contactformulier (project 6a)](#7-contactformulier-project-6a)
8. [Prijsindicatie (project 6b)](#8-prijsindicatie-project-6b)
9. [Prijzen: Google Sheet → website](#9-prijzen-google-sheet--website)
10. [De site aanpassen en uploaden](#10-de-site-aanpassen-en-uploaden)
11. [Externe diensten en accounts](#11-externe-diensten-en-accounts)
12. [Open punten](#12-open-punten)

---

## 1. Overzicht: wat staat waar

| Onderdeel | Waar | Beheer |
|---|---|---|
| Domeinnaam **weblotus.be** | Vimexx | DirectAdmin (Vimexx) |
| DNS-records | Vimexx, DirectAdmin | Records wijzen naar GitHub Pages |
| E-mail **info@weblotus.be** | Vimexx (Webhosting België Basic) | DirectAdmin + webmail |
| Website (HTML-bestanden) | Deze repo: **github.com/davidgenyn/weblotus** | GitHub Pages |
| Prijzen | Google Sheet **"Tarieven"** (lotusflow.contact@gmail.com) | Google Sheets + Apps Script |
| Formulieren (contact + prijsindicatie) | n8n op de Dell (**lotusserver**), bereikbaar via Tailscale Funnel | n8n |

```
Bezoeker ──► weblotus.be (DNS bij Vimexx) ──► GitHub Pages (deze repo)
                                                 │
                    prijzen ◄── Apps Script ◄── Google Sheet "Tarieven"
                                                 │
        formulieren ──► Tailscale Funnel ──► n8n op de Dell ──► mail / Sheet / Telegram
```

---

## 2. Domeinnaam en DNS (Vimexx)

| Gegeven | Waarde |
|---|---|
| Domein | **weblotus.be** |
| Registrar | Vimexx |
| Looptijd | actief tot 13-09-2027, automatische verlenging aan |
| Pakket | Webhosting België Basic |
| DNS-beheer | **DirectAdmin** bij Vimexx |

**DNS-records voor de website** (in DirectAdmin):

| Type | Naam | Wijst naar |
|---|---|---|
| A (4×) | weblotus.be | de vier IP-adressen van GitHub Pages |
| CNAME | www | davidgenyn.github.io |

**Mailrecords** (MX, SPF, DKIM, DMARC) blijven bij Vimexx. Die zijn automatisch door Vimexx gezet. **Niet aanpassen** bij werk aan de website, anders breekt de e-mail.

Het oude domein **lotusflow.net** is opgezegd en loopt af op 05-09-2027.

---

## 3. E-mail info@weblotus.be

| Gegeven | Waarde |
|---|---|
| Mailbox | info@weblotus.be |
| Beheer | DirectAdmin (server web0172.zxcs.be) |
| Uitgaand (SMTP) | mail.zxcs.nl, poort **465**, SSL/TLS |
| Inkomend (IMAP) | mail.zxcs.nl, poort **993**, SSL/TLS |
| Login | het volledige e-mailadres (wachtwoord staat **niet** in deze repo) |
| Verzendlimiet | 200 mails per dag |

De n8n-workflows mailen vanaf info@weblotus.be met de credential **"SMTP info@weblotus.be"**.
Wijzig je het wachtwoord van de mailbox, pas het dan ook aan in de SMTP- en IMAP-credentials in n8n, anders stoppen de mails.

---

## 4. Hosting: GitHub Pages en SSL-certificaat

### Wat is GitHub Pages?

GitHub Pages is de gratis webhosting van GitHub. GitHub neemt de bestanden uit deze repo (HTML, afbeeldingen) en zet ze online als website. Er is geen eigen server nodig.

| Gegeven | Waarde |
|---|---|
| Repo | github.com/davidgenyn/weblotus (vroeger davidgenyn/lotusflow) |
| Soort site | Statische site: alleen HTML, CSS en JavaScript, geen database of PHP |
| Eigen domein | weblotus.be |
| Live (preview) | https://weblotus.be/preview-x7k2/ |
| Hoofddomein | placeholder |
| Kosten | gratis |

**Instellingen** staan in de repo onder **Settings → Pages**:

| Instelling | Wat ze doet |
|---|---|
| Source / Branch | Uit welke branch en map GitHub de site publiceert |
| Custom domain | `weblotus.be`. GitHub bewaart dit normaal in een bestand `CNAME` in de hoofdmap van de repo: niet verwijderen, anders werkt het domein niet meer. |
| Enforce HTTPS | Stuurt iedereen die `http://` intypt automatisch door naar `https://` |

**Let op:** GitHub Pages publiceert **alle** bestanden in deze repo. Zet hier dus nooit wachtwoorden, API-keys of geheime sleutels.

Een upload is na enkele minuten zichtbaar. Ververs de site daarna met **Ctrl + F5**.

### SSL-certificaat (https)

| Gegeven | Waarde |
|---|---|
| Wie levert het certificaat? | **GitHub Pages**, gratis, uitgegeven door Let's Encrypt |
| Voor welk domein? | weblotus.be (en www.weblotus.be via de CNAME) |
| Vernieuwen | Automatisch door GitHub, je hoeft niets te doen |
| Voorwaarde | De DNS-records bij Vimexx (4 A-records + CNAME www, zie punt 2) moeten naar GitHub blijven wijzen. Verander je die, dan kan GitHub het certificaat niet vernieuwen. |
| Controle | Hangslotje in de adresbalk van de browser bij https://weblotus.be |

Het SSL-certificaat van de **website** komt dus van GitHub, niet van Vimexx.
De **e-mail** (mail.zxcs.nl, poorten 465 en 993) gebruikt het certificaat van Vimexx. Daar hoef je niets voor te doen.

**Probleem met https?** Ga naar Settings → Pages. Staat daar een waarschuwing over het certificaat of DNS, kijk dan eerst de DNS-records bij Vimexx na. Daarna kan je "Custom domain" leegmaken, opslaan, opnieuw `weblotus.be` invullen en opslaan. GitHub vraagt dan een nieuw certificaat aan, wat even kan duren.

---

## 5. Bestanden in deze repo

**Map `preview-x7k2/`: de echte site**

| Bestand | Wat |
|---|---|
| `index.html` | Startpagina (navigatie, hero met animatie, diensten, werkwijze, over, contactformulier, footer) |
| `websites.html` | Dienstpagina **Zichtbare websites** |
| `automatisering.html` | Dienstpagina **AI-automatisering** |
| `google.html` | Dienstpagina **Google & e-marketing** |
| `onderhoud.html` | Dienstpagina **Onderhoud & ondersteuning** |
| `offerte.html` | Prijssimulator **Bereken uw prijsindicatie** |
| `logo-mail.png` | Logo voor de HTML-mails van n8n |

Het logo en de iconen zitten als afbeelding **in** de HTML-bestanden (base64). Je hebt dus geen aparte afbeeldingsbestanden nodig om de pagina's te tonen.

**Hoofdmap**

| Bestand | Wat |
|---|---|
| `README.md` | Deze uitleg |
| `TARIEVEN.md` | Uitgebreide uitleg over de koppeling Sheet → prijzen, met installatie en foutzoeken |
| `tarieven.gs` | Kopie van het Apps Script (het echte script staat in de Google Sheet) |
| `schema-prijsindicatie.png` | Schema van de prijsindicatie, van invullen tot mail |

---

## 6. De pagina's

| Pagina | Inhoud |
|---|---|
| **Navigatiebalk** (alle pagina's) | Logo + "weblotus" (link naar start), en de links **Diensten · Werkwijze · Over · Contact** |
| **Hero** (index) | Titel "Zichtbare website en AI automatisering voor zelfstandigen en KMO's", knoppen *Neem contact op* en *Bereken uw prijsindicatie*, en rechts een workflow-animatie (trigger → API → AI Agent → e-mail). De animatie is alleen zichtbaar op schermen vanaf 1280 px breed. |
| **Diensten** (index) | Vier blokken. De titel van elk blok is een knop naar de eigen dienstpagina. Achter de blokken staat een licht lotus-watermerk. |
| **Dienstpagina's** | Zelfde achtergrond en watermerk als het dienstenvak, uitleg per dienst, knoppen naar contact en prijsindicatie |
| **Werkwijze, Over** (index) | Stappen van samenwerken en voorstelling |
| **Contact** (index) | Contactformulier, zie punt 7 |
| **offerte.html** | Prijssimulator, zie punt 8 |

Klantwebsites bouwt Weblotus in **WordPress**, zodat de klant zijn site zelf kan bijwerken via het CMS. De klant krijgt daarvoor een handleiding.

---

## 7. Contactformulier (project 6a)

| Stap | Wat er gebeurt |
|---|---|
| 1 | De bezoeker vult het formulier in op `index.html` (naam, e-mail, bedrijf, telefoon, type, bericht), met **Cloudflare Turnstile** tegen spam |
| 2 | Het formulier stuurt de gegevens naar n8n via **Tailscale Funnel** (`lotusserver.tail8f5562.ts.net/webhook/…`) |
| 3 | n8n controleert: Turnstile, MX/NS van het e-maildomein, wegwerpadressen, maximum aantal aanvragen per dag |
| 4 | Een AI-agent (Claude) maakt een samenvatting en een antwoord in de u-vorm |
| 5 | Zonder waarschuwing: mail naar de klant (HTML met logo). Met waarschuwing: mail naar info@weblotus.be. |
| 6 | Een rij in de Google Sheet **"Intake AI"**, plus een Telegram-melding |
| 7 | De bezoeker ziet een bevestigingsvenster |

De workflow, met uitleg, staat in de portfolio op GitHub (project 6a).

---

## 8. Prijsindicatie (project 6b)

Zie het schema **`schema-prijsindicatie.png`**.

| Stap | Wat er gebeurt |
|---|---|
| 1 | De bezoeker opent `offerte.html`. De pagina haalt de actuele prijzen op uit de Sheet (zie punt 9). |
| 2 | Keuze: **Website**, **Automatisatie (zonder website)** of **Google & e-marketing (zonder website)** |
| 3 | De bezoeker vinkt posten aan. De prijsindicatie rekent live in de browser. |
| 4 | Gegevens invullen + Turnstile → versturen naar n8n (Tailscale Funnel) |
| 5 | n8n: beveiliging, prijzen opnieuw berekenen met dezelfde Sheet, AI schrijft de tekst (nooit bedragen), offerte samenstellen |
| 6 | Een rij in het tabblad **"Offertes"** van de Sheet Tarieven |
| 7 | Zonder waarschuwing: mail met de prijsindicatie naar de klant (BCC info@weblotus.be). Met waarschuwing: mail naar info@weblotus.be. |
| 8 | Telegram-melding |

Overal staat **"vrijblijvende prijsindicatie, geen bindende offerte"**.

---

## 9. Prijzen: Google Sheet → website

**Een prijs wijzigen = alleen in de Google Sheet "Tarieven".** Daarna nemen zowel de site als de offertemail de nieuwe prijs over. Op GitHub hoef je niets aan te passen.

| Onderdeel | Uitleg |
|---|---|
| Sheet | "Tarieven", tabblad `Tarieven`, kolommen `id · dienst · post · betaling · prijs · vanaf` |
| Apps Script | "Tarieven Weblotus", in de Sheet (Extensions → Apps Script). Leest alleen id, prijs en vanaf, en schrijft niets. |
| Website | `offerte.html` vraagt bij elk bezoek de prijzen op via de URL van het script (`TARIEVEN_URL`) |
| Reserve | Lukt dat niet, dan toont de pagina de reserveprijzen uit `offerte.html` |
| Veiligheid | De Sheet zelf blijft **privé** ("Private to only me"). Alleen de prijzen zijn via het script leesbaar. De klant heeft geen Google-account nodig. |
| Zonder Dell | Dit deel draait volledig bij Google |

Alle details (installatie, script aanpassen zonder dat de URL verandert, nieuwe post toevoegen, foutzoeken) staan in **[TARIEVEN.md](TARIEVEN.md)**.

---

## 10. De site aanpassen en uploaden

| Stap | Wat je doet |
|---|---|
| 1 | Vertrek **altijd** van de laatste versie van een bestand uit deze repo, niet van een oude kopie. Een oude index zonder contactformulier heeft het formulier al eens laten verdwijnen. |
| 2 | Pas het bestand aan en controleer het lokaal in je browser |
| 3 | Op GitHub: ga naar de juiste map → **Add file → Upload files** → sleep het bestand erin → korte omschrijving → **Commit changes** |
| 4 | Wacht een paar minuten en ververs met **Ctrl + F5** |

Alle pagina's moeten in **dezelfde map** (`preview-x7k2/`) staan, anders werken de links tussen de pagina's niet.

---

## 11. Externe diensten en accounts

| Dienst | Waarvoor | Account |
|---|---|---|
| Vimexx | Domein, DNS, e-mail | Vimexx-klantaccount / DirectAdmin |
| GitHub | Code en hosting (GitHub Pages) | davidgenyn |
| Google Sheets + Apps Script | Prijzen, Offertes, Intake AI | lotusflow.contact@gmail.com |
| Cloudflare Turnstile | Spamcontrole op de formulieren | Cloudflare-account (de geheime sleutel staat alleen in n8n, **nooit** hier) |
| Tailscale Funnel | Publieke toegang tot de webhooks van n8n op de Dell | Tailscale (GitHub-login), machine `lotusserver` |
| n8n | Workflows 6a en 6b | Op de Dell, Docker |
| Anthropic | AI in de workflows | Anthropic Console (API-key alleen in n8n) |
| Telegram | Meldingen | bot @davidgenyn_n8n_bot |

---

## 12. Open punten

| Punt | Uitleg |
|---|---|
| Dell | De formulieren (6a en 6b) draaien op de Dell. De Dell is bedoeld om te testen. Voor de lancering moeten de workflows naar een server die altijd aan staat. De prijzen op de site werken al zonder Dell. |
| Privacypagina | `https://weblotus.be/privacy.html` is opgegeven bij Google (OAuth-app) maar moet nog gemaakt worden |
| Lettertype | `offerte.html` vraagt `fonts/exo2-400.woff2` op, maar dat bestand staat niet in de repo (404) |
| Enforce HTTPS | Nakijken of "Enforce HTTPS" aangevinkt is in Settings → Pages, en welke branch/map bij Source staat |
| Lancering | Hoofddomein van placeholder naar de echte site, en `noindex` weghalen |
| "vanaf" in de offertemail | Nakijken of de mail van 6b "vanaf" toont bij Basiswebsite en SEO/GEO |
