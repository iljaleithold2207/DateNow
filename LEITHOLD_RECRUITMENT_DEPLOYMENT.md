# DateNow Deployment auf datenow.leithold-recruitment.de

## Ziel

DateNow soll unter folgender Subdomain veröffentlicht werden:

```text
datenow.leithold-recruitment.de
```

Die Domain liegt bei Namecheap. Der Hostinger VPS liefert die App aus.

---

## DNS bei Namecheap

In Namecheap unter:

```text
Domain List -> leithold-recruitment.de -> Manage -> Advanced DNS -> Host Records
```

Diesen Eintrag anlegen:

```text
Type: A Record
Host: datenow
Value: 72.62.42.2
TTL: Automatic
```

Nicht nötig:

- Nameserver ändern
- komplette Domain zu Hostinger umziehen
- bestehende Website anfassen

---

## VPS Setup bei Hostinger

Per SSH auf den VPS:

```bash
ssh root@72.62.42.2
```

Basisinstallation:

```bash
apt update && apt upgrade -y
apt install -y curl nginx ufw certbot python3-certbot-nginx
```

Node.js 22 installieren:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

Firewall aktivieren:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## App deployen

App-Verzeichnis anlegen:

```bash
mkdir -p /var/www/datenow
cd /var/www/datenow
```

Repository klonen:

```bash
git clone https://github.com/iljaleithold2207/DateNow.git .
```

Hinweis: Wenn das Repo privat bleibt, braucht der Server einen GitHub-Zugriff per Deploy Key oder Token. Für den ersten schnellen Test kann das Repo temporär öffentlich gestellt werden.

Dependencies installieren und Build erzeugen:

```bash
npm install
npm run build
```

---

## Nginx konfigurieren

Datei erstellen:

```bash
nano /etc/nginx/sites-available/datenow
```

Inhalt:

```nginx
server {
    listen 80;
    server_name datenow.leithold-recruitment.de;

    root /var/www/datenow/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktivieren:

```bash
ln -s /etc/nginx/sites-available/datenow /etc/nginx/sites-enabled/datenow
nginx -t
systemctl reload nginx
```

---

## SSL aktivieren

Erst ausführen, wenn der DNS-A-Record aktiv ist und auf den VPS zeigt:

```bash
certbot --nginx -d datenow.leithold-recruitment.de
```

Test:

```bash
certbot renew --dry-run
```

---

## Deployment aktualisieren

Bei späteren Änderungen:

```bash
cd /var/www/datenow
git pull
npm install
npm run build
systemctl reload nginx
```

---

## Ziel-URL

Nach erfolgreichem DNS, Nginx und SSL:

```text
https://datenow.leithold-recruitment.de
```
