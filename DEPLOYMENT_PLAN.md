# DateNow – Hosting- und Deployment-Plan

## Ziel

DateNow soll aus diesem GitHub-Repository heraus öffentlich erreichbar gemacht werden – idealerweise über Hostinger mit eigener Domain und automatischem Deployment bei neuen GitHub-Commits.

---

## Aktueller Stand

- GitHub-Repository: `iljaleithold2207/DateNow`
- Sichtbarkeit: Private
- Default Branch: `main`
- Hosting-Ziel: Hostinger
- Domain: noch offen
- Tech-Stack: noch festzulegen

---

## Empfohlene technische Richtung

### Variante A – einfache statische Website

Geeignet, wenn DateNow erstmal eine einfache Landingpage oder ein kleines Frontend-Tool wird.

**Technik:**

- HTML
- CSS
- JavaScript
- keine Datenbank
- kein Backend

**Vorteile:**

- sehr günstig
- einfach bei Hostinger deploybar
- kaum Server-Aufwand
- ideal für MVP

**Hosting bei Hostinger:**

- normales Webhosting reicht
- Deployment nach `/public_html`
- Git-Deployment über hPanel möglich

---

### Variante B – moderne Frontend-App

Geeignet, wenn DateNow wie eine richtige kleine Web-App wirken soll.

**Technik:**

- Vite
- React oder Vue
- Tailwind CSS
- Build-Ausgabe in `dist/`

**Vorteile:**

- sauberer App-Aufbau
- moderne Oberfläche
- später gut erweiterbar

**Hosting bei Hostinger:**

- Webhosting reicht, wenn die App rein statisch ist
- Build lokal oder per GitHub Action erzeugen
- fertige Dateien nach `/public_html` deployen

---

### Variante C – Node.js-App mit Backend

Geeignet, wenn DateNow Login, API, Datenbank, Serverlogik oder externe Schnittstellen braucht.

**Technik:**

- Node.js
- Express / Fastify / Next.js
- optional Datenbank

**Hosting bei Hostinger:**

- Hostinger-Tarif mit Node.js-Unterstützung oder VPS nötig
- Start Command erforderlich, z. B. `npm run start`
- Environment Variables nötig

---

## Von Hostinger benötigte Informationen

Bitte aus Hostinger/hPanel prüfen oder bereitstellen:

1. **Hosting-Typ**
   - Webhosting?
   - Cloud Hosting?
   - VPS?
   - WordPress Hosting?
   - Node.js Hosting?

2. **Domain-Verwaltung**
   - Ist die Domain bei Hostinger registriert?
   - Oder liegt sie bei einem anderen Anbieter?

3. **Ziel-Domain**
   - z. B. `datenow.de`, `datenow.app`, `datenow.io`, `datenow.tools`

4. **hPanel-Zugriffsinformationen als Beschreibung, keine Passwörter**
   - Welcher Tarif?
   - Welche Domain ist dem Hosting-Paket zugeordnet?
   - Gibt es Zugriff auf „Git“ im hPanel?
   - Gibt es Zugriff auf „Node.js“ im hPanel?

5. **Deployment-Methode**
   - Git-Deployment über Hostinger hPanel
   - GitHub Actions + FTP/SFTP
   - Manuelles Hochladen als Übergangslösung
   - VPS Deployment per SSH

6. **Serverdaten, falls VPS/SFTP genutzt wird**
   - Hostname / Server-IP
   - Benutzername
   - Zielpfad, z. B. `/public_html`
   - SSH/SFTP möglich?
   - Bitte keine Passwörter direkt in Chat posten. Besser später über GitHub Secrets oder Hostinger-Panel konfigurieren.

---

## Domain-Check

Noch offen. Mögliche Kandidaten:

- `datenow.de`
- `datenow.com`
- `datenow.app`
- `datenow.io`
- `datenow.tools`
- `datenow.today`
- `date-now.de`
- `date-now.app`
- `getdatenow.com`
- `usedatenow.com`

Wichtig: Die finale Verfügbarkeit muss direkt bei Hostinger oder über einen Domain-Registrar geprüft werden.

---

## Hostinger Deployment-Grundprinzip

Hostinger unterstützt Git-Deployment über hPanel. Typischer Ablauf:

1. In Hostinger hPanel zur Website gehen
2. „Manage“ öffnen
3. Links nach „Git“ suchen
4. Repository-Adresse eintragen
5. Branch auswählen, hier vermutlich `main`
6. Install Path leer lassen, wenn direkt nach `/public_html` deployt werden soll
7. Deploy auslösen
8. Optional Auto-Deployment/Webhook aktivieren

---

## Empfohlener MVP-Fahrplan

### Schritt 1 – Projektziel klären

Festlegen, was DateNow in Version 1 konkret machen soll.

Mögliche MVP-Ideen:

- Datums- und Zeitrechner
- Countdown-Generator
- Arbeitstage-Rechner
- Fristen-Rechner
- Zeitzonen-Vergleich
- Kalender-Link-Generator
- Recruiting-Fristen-Rechner

### Schritt 2 – Tech-Stack wählen

Empfehlung für schnellen Start:

- Vite
- React
- TypeScript
- Tailwind CSS
- statisches Hosting

Begründung: Moderne Web-App, aber weiterhin einfach zu hosten.

### Schritt 3 – Grundstruktur im Repo anlegen

Benötigte Dateien:

- `README.md`
- `package.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `.gitignore`
- optional `.github/workflows/deploy.yml`

### Schritt 4 – Lokal oder über GitHub bauen

Build-Befehl:

```bash
npm install
npm run build
```

Build-Ausgabe:

```bash
dist/
```

### Schritt 5 – Deployment einrichten

Je nach Hostinger-Tarif:

- direkt Git-Deployment
- GitHub Action mit FTP/SFTP
- Node.js Deployment
- VPS Deployment

### Schritt 6 – Domain verbinden

DNS-Einstellungen:

- A-Record auf Server-IP
- CNAME für `www`
- SSL aktivieren
- Weiterleitung von `www` auf Hauptdomain oder umgekehrt

---

## Offene Entscheidungen

1. Soll DateNow eine einfache Landingpage oder echte Web-App werden?
2. Welche Domain soll geprüft/gekauft werden?
3. Welcher Hostinger-Tarif ist aktiv?
4. Soll die Seite rein statisch bleiben oder später Backend/Login/API bekommen?
5. Soll das Repo privat bleiben oder öffentlich werden?

---

## Nächster konkreter Schritt

Sobald Hosting-Typ und Wunschdomain klar sind, wird die passende Projektstruktur angelegt und der erste deploybare MVP gebaut.
