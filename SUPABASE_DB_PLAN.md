# Supabase DB Plan

## Ziel

Dieses Dokument beschreibt den geplanten Supabase-Einsatz für die kommenden Projekte rund um DateNow, CCRM/CCRN, n8n, OpenClaw, Unipile und automatisierte Recruiting-Workflows.

Primäres Ziel:

```text
Supabase Account verknüpfen
→ Projektstruktur sauber anlegen
→ Datenmodell für CCRM/CCRN definieren
→ Auth, RLS und Storage vorbereiten
→ n8n/OpenClaw/Unipile sauber anbinden
→ GitHub/CI/CD-fähige Migrationsstruktur aufbauen
```

## Kontext

DateNow ist aktuell als erstes Vite/React-MVP live. Die nächsten produktiven Systeme sollen stärker datengetrieben werden. Supabase wird dabei als Backend-Schicht genutzt:

- Postgres-Datenbank
- Auth
- Row Level Security
- Storage
- Edge Functions
- Realtime/Logs
- Migrations
- mögliche direkte ChatGPT-/AI-Agent-Integration

## Supabase Update — Juni 2026

Die folgenden Punkte stammen aus dem Supabase Update Juni 2026 und sollen bei der Architekturplanung berücksichtigt werden.

### $500M Series F

Supabase hat eine Series-F-Finanzierungsrunde über 500 Mio. USD bei einer Pre-Money-Bewertung von 10 Mrd. USD angekündigt. Lead-Investor ist GIC.

Relevanz:

- Supabase ist weiterhin stark finanziert.
- Für eigene Produktplanung kann Supabase als langfristig relevanter Backend-Anbieter eingeordnet werden.
- Trotzdem sollten Vendor-Lock-in-Risiken über SQL/Migrations und Exportfähigkeit begrenzt bleiben.

### Multigres v0.1 alpha

Multigres wurde als skalierbares Betriebssystem für Postgres beschrieben. Ziel ist ganzheitliches Management von Postgres-Instanzen mit:

- Sharding
- Connection Pooling
- automatischem Failover
- Backup-Orchestrierung

Multigres v0.1 alpha ist zunächst eine Open-Source-only-Veröffentlichung. Multigres für Supabase soll später folgen.

Relevanz:

- Für spätere Skalierung von CCRM/Recruiting-Daten relevant.
- Kurzfristig noch nicht einplanen.
- Datenmodell trotzdem Postgres-nativ und sauber normalisiert aufbauen.

### Passkeys Beta für Supabase Auth

Supabase Auth unterstützt Passkeys in Beta. Nutzer können sich mit Face ID, Touch ID, Windows Hello, Geräte-PIN oder Hardware-Security-Key anmelden. Technische Grundlage ist WebAuthn. Supabase speichert nur den Public Key, private Schlüssel bleiben auf dem Gerät.

Relevanz:

- Für Admin-/Recruiter-Login sehr interessant.
- Kurzfristig zunächst E-Mail/OAuth verwenden.
- Passkeys mittelfristig für sicherere Logins einplanen.

### Supabase + OpenAI / ChatGPT App

Supabase ist laut Update als offizielle ChatGPT-App verfügbar. Supabase-Projekte können mit ChatGPT verbunden und konversationell verwaltet werden. Genannt wurden Tools für:

- SQL-Ausführung
- Schema-Änderungen
- Branching
- Edge Function Deployment
- Live Logs

Relevanz:

- Sehr passend für den geplanten Workflow: ChatGPT/Codex → GitHub → Supabase → CI/CD.
- Supabase-Verknüpfung mit ChatGPT sollte als nächster Setup-Schritt geprüft werden.
- Änderungen an Schema/Produktivdaten trotzdem nur kontrolliert über Migrationen.

### Supabase AI Coding Agents Plugin

Supabase bietet ein Plugin für AI Coding Agents an. Es bündelt Supabase MCP Server und Agent Skills. Genannt werden Fähigkeiten wie:

- Datenbanken abfragen
- Migrationen verwalten
- Edge Functions deployen
- Supabase- und Postgres-Best-Practices berücksichtigen

Unterstützte Tools laut Update:

- Claude Code
- Cursor
- Codex
- Gemini CLI

Relevanz:

- Sehr relevant für den geplanten Coding-Agent-Workflow.
- Später ideal: Agent erstellt Migration → GitHub PR → Review → Deploy.
- Direkte Produktivänderungen ohne Review vermeiden.

### Temporary token-based database access

Supabase previewt temporären Datenbankzugriff per Personal Access Token. Admins können Rolle und Ablaufzeit bis zu 90 Tage vergeben. Beim Entzug des Projektzugriffs endet auch der Datenbankzugriff. Unterstützt in Branch-Projekten und verfügbar ab Postgres 17+.

Relevanz:

- Sehr gut für kurzzeitige Agent-/Entwicklerzugriffe.
- Für Coding Agents besser als permanente DB-Passwörter.
- Für Produktionsdaten nur mit Rollenbegrenzung und Ablaufzeit verwenden.

### Weitere relevante Produktankündigungen

Aus dem Update:

- Schutz gegen Supply-Chain-Attacks
- Supabase Client Libraries unterstützen Traces
- Tabellen direkt im Schema Visualizer editierbar
- lange Textspalten in der Sidebar ausklappbar
- RLS Tester im Dashboard aktivierbar
- neue Tastatur-Shortcuts
- pg-delta als Schema-Diffing-Engine
- Logs Usage ist metered
- Supabase verfügbar auf Perplexity Computer

Relevanz:

- RLS Tester für Sicherheit sehr wichtig.
- Traces/Logs für Debugging von n8n/OpenClaw/Edge Functions einplanen.
- Logs-Kosten beobachten, da Nutzung metered ist.
- pg-delta langfristig für Migration-/Schema-Diffs prüfen.

## Geplante Supabase-Projekte

Empfohlene Struktur:

```text
Project 1: datenow
Zweck: leichtes Demo-/MVP-Projekt

Project 2: ccrm-dev
Zweck: Entwicklungs- und Testumgebung für Recruiting CRM

Project 3: ccrm-prod
Zweck: produktives Recruiting CRM
```

Alternative:

```text
Ein Supabase-Projekt mit Branching
→ develop branch für ccrm-dev
→ main/prod branch für Produktion
```

Empfehlung:

- Für den Anfang separate Dev/Prod-Projekte oder Supabase Branching verwenden.
- Keine echten Kandidaten-/Kundendaten in der Dev-Umgebung speichern.

## CCRM/CCRN Kernmodule

Das spätere System soll diese Bereiche abbilden:

- Mandate / Jobs
- Kunden / Unternehmen
- Ansprechpartner
- Kandidaten
- LinkedIn-Suchen
- Suchkampagnen
- Nachrichten/Outreach
- Gesprächsnotizen
- Deckblatt-Erstellung
- Dokumente/CVs
- n8n-Workflow-Runs
- OpenClaw-Agent-Aufträge
- Unipile-Verbindungen
- Audit Logs

## Erste Tabellenplanung

### organizations

Kundenunternehmen und Zielunternehmen.

Felder:

- id
- name
- domain
- industry
- company_size
- location
- notes
- created_at
- updated_at

### contacts

Ansprechpartner bei Kunden oder Kandidatenunternehmen.

Felder:

- id
- organization_id
- first_name
- last_name
- email
- phone
- linkedin_url
- role_title
- relationship_type
- notes
- created_at
- updated_at

### jobs

Mandate / Vakanzen / Suchaufträge.

Felder:

- id
- organization_id
- title
- status
- location
- remote_policy
- salary_min
- salary_max
- target_profile
- must_have_skills
- nice_to_have_skills
- notes
- created_at
- updated_at

### candidates

Kandidatenprofile.

Felder:

- id
- first_name
- last_name
- email
- phone
- linkedin_url
- current_company
- current_title
- location
- seniority
- skills
- availability
- salary_expectation
- status
- notes
- created_at
- updated_at

### candidate_job_matches

Matching zwischen Kandidaten und Mandaten.

Felder:

- id
- candidate_id
- job_id
- match_score
- status
- source
- notes
- created_at
- updated_at

### search_campaigns

LinkedIn-/Active-Sourcing-Suchen.

Felder:

- id
- job_id
- name
- search_query
- platform
- status
- created_by
- created_at
- updated_at

### outreach_messages

Nachrichten und Follow-ups.

Felder:

- id
- candidate_id
- campaign_id
- channel
- direction
- subject
- body
- status
- sent_at
- received_at
- created_at

### documents

CVs, Deckblätter, Exposes, PDFs.

Felder:

- id
- candidate_id
- job_id
- document_type
- file_name
- storage_path
- mime_type
- status
- created_at

### workflow_runs

n8n- und Automationsläufe.

Felder:

- id
- workflow_name
- external_run_id
- related_entity_type
- related_entity_id
- status
- input_payload
- output_payload
- error_message
- started_at
- finished_at

### agent_tasks

OpenClaw-/Agent-Aufträge.

Felder:

- id
- task_type
- instruction
- status
- created_by
- related_entity_type
- related_entity_id
- result_payload
- error_message
- created_at
- updated_at

### integrations

Externe Integrationen wie Unipile, n8n, Google, LinkedIn, OpenClaw.

Felder:

- id
- provider
- account_label
- status
- config_metadata
- created_at
- updated_at

Wichtig: Secrets gehören nicht direkt in Tabellen, sondern in Supabase Vault oder sichere Environment-Variablen.

## Supabase Auth

Geplante Rollen:

```text
admin
recruiter
viewer
automation_service
```

Kurzfristiger Login:

- E-Mail Magic Link oder OAuth
- später Passkeys prüfen

Passkeys-Perspektive:

- Für Admins und produktive Recruiter attraktiv
- Beta-Status beachten
- Erst nach Grundsystem und RLS einführen

## Row Level Security

RLS von Anfang an aktivieren.

Grundregeln:

- Admins sehen alles.
- Recruiter sehen eigene Mandate, Kandidaten und Kampagnen.
- Viewer nur lesend.
- Service-Rollen nur gezielt für n8n/OpenClaw/Edge Functions.

Wichtig:

- RLS Tester im Supabase Dashboard aktivieren.
- Keine Tabellen ohne RLS produktiv freigeben.
- Service Role Key niemals im Frontend verwenden.

## Storage

Geplante Buckets:

```text
candidate-cvs
candidate-cover-sheets
job-briefings
exports
temp-processing
```

Regeln:

- Private Buckets bevorzugen.
- Zugriff über signed URLs.
- Automatisch generierte Deckblätter versionieren.

## n8n-Integration

n8n soll Workflows orchestrieren:

- Deckblatt-Erstellung
- CV-Konvertierung
- PDF-Generierung
- Kandidatenprofil-Aufbereitung
- Follow-up-Automation
- Webhook-Verarbeitung aus CCRM

Empfohlener Weg:

```text
CCRM Frontend
→ Supabase Insert/Update
→ Edge Function oder n8n Webhook
→ n8n Workflow
→ Ergebnis zurück in Supabase
→ Dokument in Supabase Storage
```

## OpenClaw-Integration

OpenClaw soll als Agenten-/Voice-/Messenger-Schicht arbeiten.

Beispiele:

```text
„Suche Kandidaten für Senior SAP IS-U in NRW.“
„Erstelle ein Deckblatt für Kandidat X auf Mandat Y.“
„Fasse die letzten LinkedIn-Antworten zusammen.“
„Starte eine Follow-up-Kampagne für diese Kandidaten.“
```

Technische Rolle:

- OpenClaw nimmt natürliche Sprache/Sprachnachrichten entgegen.
- OpenClaw ruft kontrollierte interne APIs oder n8n-Webhooks auf.
- OpenClaw schreibt Ergebnisse in Supabase.

Sicherheitsregel:

- OpenClaw nicht offen und ungeschützt ins Internet hängen.
- Auth, IP-Restriction oder geschütztes Login einplanen.
- Agent-Aktionen protokollieren.

## Unipile-Integration

Unipile soll perspektivisch LinkedIn/Messaging-Daten anbinden.

Mögliche Datenflüsse:

```text
Unipile LinkedIn Search/Inbox
→ n8n/OpenClaw Verarbeitung
→ Supabase candidates / outreach_messages
→ CCRM UI
```

Risiken:

- LinkedIn-ToS und Account-Risiko beachten.
- Rate Limits und sichere Nutzung einplanen.
- Keine aggressiven Automationen ohne Schutzmechanismen.

## Edge Functions

Mögliche Supabase Edge Functions:

- create-cover-sheet
- normalize-candidate-profile
- trigger-n8n-workflow
- unipile-webhook-handler
- openclaw-command-handler
- audit-log-event

Empfehlung:

- Businesskritische Eingänge über Edge Functions absichern.
- n8n nicht direkt ungefiltert aus dem Frontend aufrufen.

## GitHub / CI/CD / Supabase

Geplanter Workflow:

```text
ChatGPT/Codex
→ GitHub Commit/PR
→ GitHub Actions
→ Build Frontend
→ Deploy auf Hostinger VPS
→ Supabase Migrations ausführen
```

Supabase Secrets in GitHub Actions:

```text
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF_DEV
SUPABASE_PROJECT_REF_PROD
SUPABASE_DB_PASSWORD_DEV
SUPABASE_DB_PASSWORD_PROD
```

Wichtig:

- Keine Secrets ins Repo committen.
- Migrationen versionieren.
- Produktivmigrationen nur kontrolliert ausführen.

## Supabase Account verbinden

Nächste konkrete Schritte:

1. Supabase Account öffnen.
2. Neues Projekt `ccrm-dev` erstellen oder bestehendes Projekt auswählen.
3. Region festlegen.
4. Postgres-Version prüfen, idealerweise aktuelle Version.
5. Supabase CLI lokal oder über GitHub Actions vorbereiten.
6. ChatGPT/Supabase-Verknüpfung prüfen.
7. Supabase MCP/AI Coding Agent Plugin prüfen.
8. API Keys und Project Ref sicher dokumentieren, aber nicht committen.
9. Erste Migration für Basis-Tabellen erstellen.
10. RLS aktivieren und testen.

## Priorisierte Umsetzung

### Phase 1: Basis

- Supabase Account verbinden
- Projekt `ccrm-dev` anlegen
- Tabellenentwurf finalisieren
- RLS-Grundkonzept anlegen
- Storage Buckets planen

### Phase 2: CCRM Dev

- Lovable GitHub Repo klonen
- CCRM Dev auf VPS deployen
- Supabase Client integrieren
- Auth einbauen
- erste Datenbanktabellen anbinden

### Phase 3: Workflows

- n8n hinter Nginx stabil bereitstellen
- vorhandenen Deckblatt-Workflow dokumentieren
- n8n Webhook an Supabase/CCRM anbinden
- Workflow Runs in Supabase speichern

### Phase 4: Automationen

- Unipile anbinden
- LinkedIn-Suchen/Inbox-Daten strukturiert speichern
- OpenClaw als Agentenschicht vorbereiten
- Sprachnachrichten/Commands auf n8n-Webhooks mappen

### Phase 5: Produktion

- ccrm-prod Projekt/Branch vorbereiten
- GitHub Actions für Dev und Prod einrichten
- Monitoring, Logs, Backups prüfen
- Passkeys für Admin-Login testen

## Offene Fragen

- Heißt das Hauptprojekt künftig CCRM oder CCRN?
- Wird Lovable ein separates GitHub Repo erzeugen oder im aktuellen GitHub Account angelegt?
- Soll Supabase pro Projekt getrennt werden oder über Branching laufen?
- Welche Daten dürfen produktiv gespeichert werden?
- Wie wird DSGVO-konform mit Kandidatenprofilen, CVs und LinkedIn-Daten umgegangen?
- Welche OpenClaw-Oberfläche soll genutzt werden: Web, Messenger, Voice oder mehrere?
- Soll n8n langfristig selbst gehostet bleiben oder später ausgelagert werden?
