# CI/CD Deployment Plan

## Zielbild

Zukünftig soll der Weg so aussehen:

```text
ChatGPT/Codex ändert Code
→ Commit nach GitHub
→ GitHub Actions startet automatisch
→ npm install / npm ci
→ npm run build
→ rsync dist/ auf den Hostinger VPS
→ Nginx liefert die jeweilige Stage aus
```

Ziel ist: keine manuellen Deployments mehr über das Hostinger-Terminal.

## Aktuelle VPS-Basis

- Anbieter: Hostinger KVM VPS
- Betriebssystem: Ubuntu 24.04 LTS
- Webserver: Nginx
- Runtime: Node.js 22
- Deployment-Ziel für DateNow: `/var/www/datenow`
- Live-Domain DateNow: `datenow.leithold-recruitment.de`

## DNS Records bei Namecheap

Alle Subdomains zeigen zunächst per A Record auf den Hostinger VPS.

| Type | Host | Value | TTL | Zweck |
|---|---|---:|---|---|
| A Record | datenow | 72.62.42.2 | Automatic | DateNow Produktion |
| A Record | ccrm | 72.62.42.2 | Automatic | CCRM Produktion |
| A Record | ccrm-dev | 72.62.42.2 | Automatic | CCRM Dev/Staging |
| A Record | application-autopilot | 72.62.42.2 | Automatic | Application Autopilot Produktion |
| A Record | app | 72.62.42.2 | Automatic | generische App-Subdomain |
| A Record | api | 72.62.42.2 | Automatic | generische API-Subdomain |
| A Record | dev | 72.62.42.2 | Automatic | generische Dev-Subdomain |

Wichtig bei Namecheap: Im Feld `Host` nur den Subdomain-Teil eintragen, also z. B. `ccrm-dev`, nicht `ccrm-dev.leithold-recruitment.de`.

## Vorsorgliche Installation auf dem VPS

Diese Pakete sollten auf dem VPS vorhanden sein:

```bash
apt update
apt install -y nginx git curl ufw certbot python3-certbot-nginx rsync unzip jq
```

Node.js prüfen:

```bash
node -v
npm -v
git --version
rsync --version
certbot --version
nginx -v
```

## Firewall

Basis-Regeln:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

## Empfohlene Ordnerstruktur

```text
/var/www/datenow
/var/www/ccrm
/var/www/ccrm-dev
/var/www/application-autopilot
```

Anlegen:

```bash
mkdir -p /var/www/datenow
mkdir -p /var/www/ccrm
mkdir -p /var/www/ccrm-dev
mkdir -p /var/www/application-autopilot
```

## Rechtekonzept

Für manuelle Erstdeployments kann `www-data` Besitzer sein:

```bash
chown -R www-data:www-data /var/www
chmod -R 775 /var/www
```

Für GitHub Actions sollte aber ein eigener Deploy-User eingerichtet werden.

## Deploy-User für GitHub Actions

Nicht dauerhaft als `root` deployen. Besser:

```bash
adduser deploy
usermod -aG www-data deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chown -R deploy:deploy /home/deploy/.ssh
```

Später wird der Public SSH Key von GitHub Actions in diese Datei eingetragen:

```bash
/home/deploy/.ssh/authorized_keys
```

Empfohlene Rechte:

```bash
chmod 600 /home/deploy/.ssh/authorized_keys
chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

Damit der Deploy-User in die Web-Verzeichnisse schreiben kann:

```bash
chown -R deploy:www-data /var/www
chmod -R 775 /var/www
```

## Nginx-Sites

Für jede App/Stufe eine eigene Nginx-Konfiguration:

```text
/etc/nginx/sites-available/datenow
/etc/nginx/sites-available/ccrm
/etc/nginx/sites-available/ccrm-dev
/etc/nginx/sites-available/application-autopilot
```

Beispiel für CCRM Dev:

```nginx
server {
    listen 80;
    server_name ccrm-dev.leithold-recruitment.de;

    root /var/www/ccrm-dev/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktivieren:

```bash
ln -sf /etc/nginx/sites-available/ccrm-dev /etc/nginx/sites-enabled/ccrm-dev
nginx -t
systemctl reload nginx
```

## SSL mit Certbot

Erst ausführen, wenn der DNS-A-Record aktiv auf den VPS zeigt:

```bash
certbot --nginx -d ccrm-dev.leithold-recruitment.de
certbot renew --dry-run
```

Für mehrere Subdomains jeweils separat oder gemeinsam:

```bash
certbot --nginx \
  -d datenow.leithold-recruitment.de \
  -d ccrm.leithold-recruitment.de \
  -d ccrm-dev.leithold-recruitment.de \
  -d application-autopilot.leithold-recruitment.de
```

## Branch-Strategie

Empfohlener Standard:

```text
main      → Produktion
 develop  → Dev/Staging
```

Beispiel CCRM:

```text
Branch: develop
Deploy-Ziel: ccrm-dev.leithold-recruitment.de
Pfad: /var/www/ccrm-dev
```

```text
Branch: main
Deploy-Ziel: ccrm.leithold-recruitment.de
Pfad: /var/www/ccrm
```

## GitHub Actions Secrets

Für automatische Deployments werden im GitHub-Repo Secrets benötigt:

```text
VPS_HOST=72.62.42.2
VPS_USER=deploy
VPS_SSH_KEY=<privater SSH-Key für GitHub Actions>
VPS_PORT=22
```

Wichtig: Der private Key liegt nur in GitHub Secrets. Der passende Public Key liegt auf dem VPS in `/home/deploy/.ssh/authorized_keys`.

## Beispiel GitHub Actions Workflow für DEV

Datei:

```text
.github/workflows/deploy-dev.yml
```

Beispiel:

```yaml
name: Deploy DEV

on:
  push:
    branches:
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy dist to VPS
        run: |
          rsync -az --delete -e "ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }}" \
            dist/ \
            ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:/var/www/ccrm-dev/dist/
```

## Beispiel GitHub Actions Workflow für Produktion

Datei:

```text
.github/workflows/deploy-prod.yml
```

Beispiel:

```yaml
name: Deploy PROD

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p ${{ secrets.VPS_PORT }} ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy dist to VPS
        run: |
          rsync -az --delete -e "ssh -i ~/.ssh/deploy_key -p ${{ secrets.VPS_PORT }}" \
            dist/ \
            ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}:/var/www/ccrm/dist/
```

## Sicherheitsnotizen

- Keine Deployments dauerhaft über `root`.
- SSH-Key nur für Deployment verwenden, nicht den privaten Hauptschlüssel.
- GitHub Secrets niemals ins Repo committen.
- Nginx-Konfigurationen vor Reload immer mit `nginx -t` prüfen.
- SSL erst aktivieren, wenn DNS sauber auf den VPS zeigt.
- Für jede App getrennte Verzeichnisse und getrennte Nginx-Sites verwenden.

## Nächste konkrete Schritte

1. DNS Records bei Namecheap setzen.
2. VPS-Basisinstallation prüfen.
3. Deploy-User anlegen.
4. SSH-Key-Paar für GitHub Actions erzeugen.
5. Public Key auf VPS hinterlegen.
6. Private Key als GitHub Secret speichern.
7. GitHub Actions Workflow für DEV anlegen.
8. Test-Commit auf `develop` ausführen.
9. DEV-Stage prüfen.
10. Danach Produktionsworkflow für `main` aktivieren.
