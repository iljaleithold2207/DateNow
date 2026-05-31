# DateNow – VPS Setup Plan für Hostinger KVM 2

## Ausgangslage

Hostinger meldet aktuell:

- Aktiver VPS: KVM 2
- Deployment-Art: manuelles Server-Setup per CLI
- Kein managed hPanel Node.js App-Setup
- Geeignet für: Node.js, Docker, eigene Backend-Dienste, Reverse Proxy, volle Kontrolle

---

## Zielarchitektur

Empfohlene Produktionsarchitektur für DateNow:

```text
Internet
  ↓
Domain / DNS
  ↓
Hostinger VPS IP
  ↓
Nginx Reverse Proxy
  ↓
Node.js App auf internem Port, z. B. 3000
  ↓
DateNow Anwendung
```

---

## Begriffe kurz erklärt

### VPS

Ein Virtual Private Server ist ein eigener virtueller Server. Man muss Betriebssystem, Laufzeitumgebung, Webserver, Sicherheit und Deployment selbst einrichten.

### Node.js

Node.js führt JavaScript auf dem Server aus. Das braucht man, wenn DateNow nicht nur eine statische Website sein soll, sondern z. B. APIs, Login oder serverseitige Logik bekommt.

### Reverse Proxy

Ein Reverse Proxy ist ein Webserver, meist Nginx, der öffentliche Anfragen von Port 80/443 entgegennimmt und intern an die Node.js-App weiterleitet.

### PM2

PM2 ist ein Prozessmanager für Node.js. Er sorgt dafür, dass die App dauerhaft läuft und nach Server-Neustarts automatisch wieder startet.

### SSL

SSL/TLS sorgt für HTTPS. Empfehlung: kostenloses Let's Encrypt Zertifikat über Certbot.

---

## Benötigte Infos vom Server

Bitte keine Passwörter in Chat oder Repository speichern.

Benötigt werden:

1. Server-IP des VPS
2. Betriebssystem, z. B. Ubuntu 22.04 oder Ubuntu 24.04
3. SSH-Benutzer, z. B. `root` oder eigener Deploy-User
4. Domain oder Subdomain, z. B. `datenow.de` oder `app.datenow.de`
5. Soll die App öffentlich unter Hauptdomain oder Subdomain laufen?
6. GitHub-Zugriff vom Server aus: HTTPS Token oder SSH Deploy Key

---

## Empfohlener Stack

Für DateNow MVP:

- Ubuntu 24.04 LTS
- Node.js 22 LTS
- npm
- Git
- Nginx
- PM2
- Certbot / Let's Encrypt
- optional Docker später

---

## Server-Basisinstallation

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl ufw nginx
```

---

## Firewall einrichten

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Freigegeben werden damit:

- SSH für Serverzugriff
- HTTP Port 80
- HTTPS Port 443

---

## Node.js installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## PM2 installieren

```bash
sudo npm install -g pm2
pm2 -v
```

---

## App-Verzeichnis anlegen

```bash
sudo mkdir -p /var/www/datenow
sudo chown -R $USER:$USER /var/www/datenow
cd /var/www/datenow
```

---

## Repository klonen

Für öffentliches Repo:

```bash
git clone https://github.com/iljaleithold2207/DateNow.git .
```

Für privates Repo braucht der Server Zugriff, z. B. über:

- GitHub Deploy Key per SSH
- GitHub Fine-Grained Personal Access Token
- temporär Repo öffentlich machen

Empfehlung: Deploy Key.

---

## App installieren und bauen

Wenn DateNow eine Vite/React-App wird:

```bash
npm install
npm run build
```

Wenn die App statisch gebaut wird, liegt das Ergebnis typischerweise in:

```text
dist/
```

---

## Option A – Statische App über Nginx ausliefern

Diese Option ist für DateNow MVP am einfachsten.

Nginx-Konfiguration:

```bash
sudo nano /etc/nginx/sites-available/datenow
```

Inhalt:

```nginx
server {
    listen 80;
    server_name datenow.de www.datenow.de;

    root /var/www/datenow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktivieren:

```bash
sudo ln -s /etc/nginx/sites-available/datenow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Option B – Node.js-App über PM2 und Nginx Reverse Proxy

Falls DateNow ein Backend oder Server-Side Rendering bekommt.

App starten:

```bash
npm install
npm run build
pm2 start npm --name datenow -- start
pm2 save
pm2 startup
```

Nginx-Konfiguration:

```nginx
server {
    listen 80;
    server_name datenow.de www.datenow.de;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL aktivieren

Sobald die Domain auf die VPS-IP zeigt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d datenow.de -d www.datenow.de
```

Test:

```bash
sudo certbot renew --dry-run
```

---

## DNS-Einstellungen

Bei Hostinger oder dem Domain-Anbieter:

```text
A Record
Name: @
Value: VPS-IP
TTL: Auto

CNAME
Name: www
Value: datenow.de
TTL: Auto
```

Alternativ:

```text
A Record
Name: app
Value: VPS-IP
```

für `app.datenow.de`.

---

## Deployment-Strategie

### Manuell per SSH

```bash
cd /var/www/datenow
git pull
npm install
npm run build
sudo systemctl reload nginx
```

### Mit PM2 bei Node-App

```bash
cd /var/www/datenow
git pull
npm install
npm run build
pm2 restart datenow
```

### Später automatisiert

GitHub Actions kann per SSH auf den VPS deployen.

Benötigte GitHub Secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_APP_PATH`

---

## Empfehlung für DateNow

Für den ersten MVP:

1. Vite + React + TypeScript bauen
2. Statisch nach `dist/` builden
3. Nginx liefert `dist/` aus
4. Domain per A-Record auf VPS zeigen lassen
5. SSL mit Certbot aktivieren
6. Erst danach Backend ergänzen, falls nötig

Begründung: Weniger Fehlerquellen, schneller öffentlich, später sauber erweiterbar.

---

## Sicherheitsregeln

- Keine Passwörter ins Repository
- Keine `.env` Dateien committen
- SSH nur mit Key statt Passwort
- Firewall aktivieren
- Root-Login später idealerweise deaktivieren
- Regelmäßige Updates einplanen

---

## Nächste To-dos

- [ ] Domain final auswählen
- [ ] Domain-Verfügbarkeit prüfen
- [ ] DNS auf Hostinger VPS-IP zeigen lassen
- [ ] Entscheiden: statische App oder Node.js Backend
- [ ] MVP-Projektstruktur im Repository anlegen
- [ ] Server vorbereiten
- [ ] Deployment testen
- [ ] SSL aktivieren
