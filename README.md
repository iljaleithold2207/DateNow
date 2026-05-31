# DateNow

DateNow ist ein MVP für eine moderne Web-App rund um Datum, Zeit, Fristen und Countdowns.

## Tech-Stack

- Vite
- React
- TypeScript
- CSS
- geplantes Hosting: Hostinger KVM VPS mit Ubuntu

## Lokal starten

```bash
npm install
npm run dev
```

## Produktions-Build erzeugen

```bash
npm run build
```

Die fertige statische Website liegt danach im Ordner:

```text
dist/
```

## Deployment-Ziel

Für den ersten MVP wird DateNow statisch über Nginx ausgeliefert.

Geplanter Ablauf:

1. Repository auf den VPS klonen
2. Node.js installieren
3. Dependencies installieren
4. Build erzeugen
5. Nginx auf `dist/` zeigen lassen
6. Domain per A-Record auf den VPS zeigen lassen
7. SSL mit Let's Encrypt aktivieren

## Nächste Ausbaustufen

- Live aktualisierte Uhrzeit
- Datumsrechner
- Fristenrechner
- Countdown-Generator
- Arbeitstage-Rechner
- Kalenderwochen-Rechner
- Zeitzonen-Vergleich
