# DateNow – Namecheap Domain mit Hostinger VPS verbinden

## Ziel

DateNow soll als Subdomain auf einer bestehenden Namecheap-Domain laufen, z. B.:

```text
datenow.deine-domain.de
```

Die Domain bleibt bei Namecheap. Nur ein DNS-Eintrag zeigt auf den Hostinger VPS.

---

## Empfohlene Variante

Nicht die komplette Domain zu Hostinger umziehen und nicht die Nameserver wechseln.

Stattdessen:

```text
Subdomain bei Namecheap -> A-Record -> Hostinger VPS IPv4
```

Beispiel:

```text
Type: A Record
Host: datenow
Value: 72.62.42.2
TTL: Automatic
```

Ergebnis:

```text
datenow.deine-domain.de
```

---

## Warum Subdomain statt Subpage?

### Subdomain

```text
datenow.deine-domain.de
```

Vorteile:

- technisch sauber
- eigenes Nginx-Setup möglich
- eigenes SSL-Zertifikat möglich
- keine Kollision mit bestehender Website
- ideal für VPS-Deployment

### Subpage

```text
deine-domain.de/datenow
```

Nachteile:

- komplizierter, wenn die Hauptdomain schon auf eine andere Website zeigt
- Routing-Konflikte möglich
- SSL/Nginx/Hosting muss exakt abgestimmt sein
- für MVP unnötig fehleranfällig

Empfehlung: Subdomain verwenden.

---

## Namecheap DNS-Eintrag

In Namecheap:

1. Einloggen
2. Domain List öffnen
3. Bei der Domain auf Manage klicken
4. Advanced DNS öffnen
5. Host Records suchen
6. Add New Record klicken
7. Record setzen:

```text
Type: A Record
Host: datenow
Value: 72.62.42.2
TTL: Automatic
```

Optional, falls auch `www.datenow.deine-domain.de` funktionieren soll:

```text
Type: CNAME Record
Host: www.datenow
Value: datenow.deine-domain.de
TTL: Automatic
```

---

## DNS prüfen

Nach dem Speichern kann DNS einige Minuten bis mehrere Stunden brauchen.

Prüfen per Terminal:

```bash
dig datenow.deine-domain.de +short
```

Erwartetes Ergebnis:

```text
72.62.42.2
```

Alternative:

```bash
nslookup datenow.deine-domain.de
```

---

## Nginx-Konfiguration für Subdomain

Datei erstellen:

```bash
nano /etc/nginx/sites-available/datenow
```

Inhalt anpassen:

```nginx
server {
    listen 80;
    server_name datenow.deine-domain.de;

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

Erst ausführen, wenn DNS korrekt auf den VPS zeigt:

```bash
certbot --nginx -d datenow.deine-domain.de
```

---

## Deployment-Befehle auf dem VPS

```bash
apt update && apt upgrade -y
apt install -y curl nginx ufw certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
mkdir -p /var/www/datenow
cd /var/www/datenow
git clone https://github.com/iljaleithold2207/DateNow.git .
npm install
npm run build
```

Hinweis: Bei privatem GitHub-Repo braucht der VPS Zugriff per Deploy Key, Token oder das Repo wird temporär öffentlich gemacht.

---

## Platzhalter ersetzen

In allen Befehlen ersetzen:

```text
datenow.deine-domain.de
```

mit der echten Subdomain.
