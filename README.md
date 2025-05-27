# THESIS DAO – Vollständige Projektübersicht

Willkommen zum **THESIS DAO**-Projekt!  
Dieses Repository enthält eine vollständige, modulare DAO-Lösung mit Smart Contract, React-Frontend, Backend-Services und KI-Chatbot.  
Das Ziel ist es, eine dezentrale, transparente und interaktive DAO-Plattform auf der NEAR-Blockchain bereitzustellen.

---

## Inhaltsverzeichnis

- [THESIS DAO – Vollständige Projektübersicht](#thesis-dao--vollständige-projektübersicht)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Projektüberblick](#projektüberblick)
  - [Demo-Video](#demo-video)
  - [Architektur](#architektur)
  - [Komponenten](#komponenten)
    - [1. smart-contract](#1-smart-contract)
    - [2. near-react-frontend](#2-near-react-frontend)
    - [3. dao-member-registry](#3-dao-member-registry)
  - [Setup \& Installation](#setup--installation)
  - [Dynamische API-URL \& Umgebungsvariablen](#dynamische-api-url--umgebungsvariablen)
  - [Deployment](#deployment)
  - [UptimeRobot für Demo-Zwecke](#uptimerobot-für-demo-zwecke)
  - [Roadmap \& Projekte](#roadmap--projekte)
  - [Ressourcen \& Links](#ressourcen--links)

---

## Projektüberblick

**THESIS DAO** ist eine vollständige DAO-Plattform mit:
- On-Chain Governance (Proposals, Voting, Rollen)
- Token-Ökonomie (Fungible Token, Dividenden, Token-Kauf)
- Mitgliederverwaltung (Off-Chain Registry)
- Modernem, responsivem Frontend

---

## Demo-Video

[![Demo-Video ansehen](https://img.youtube.com/vi/tenTxuu1mlA/0.jpg)](https://www.youtube.com/watch?v=tenTxuu1mlA)

---

## Architektur

```
.
├── smart-contract/         # Rust-basierter NEAR Smart Contract
├── near-react-frontend/    # React-Frontend für DAO-Interaktion
├── dao-member-registry/    # Node.js Backend für Mitgliederverwaltung
```

---

## Komponenten

### 1. smart-contract

- **Sprache:** Rust
- **Plattform:** NEAR Blockchain
- **Funktionen:**
  - DAO-Governance: Proposals, Voting, Rollen (core, community, visitor)
  - Token-Ökonomie: Kauf, Transfer, Dividenden
  - On-Chain Mitgliederverwaltung (Account-Registrierung, Rollen)
  - Proposal-Logik: Erstellen, Abstimmen, Finalisieren, Quorum, Deadlines
- **Build & Test:**
  ```bash
  cd smart-contract
  cargo near build
  cargo test
  ```
- **Deployment:**
  Manuell mit der NEAR CLI:
  ```bash
  cargo near build
  cargo near deploy
  ```
- **Wichtige Dateien:**
  - `src/lib.rs`: Hauptlogik (Token, Proposals, Rollen, Dividenden)
  - `src/proposal.rs`: Proposal- und Voting-Logik
  - `Cargo.toml`: Abhängigkeiten und Metadaten

### 2. near-react-frontend

- **Sprache:** JavaScript (React)
- **Funktionen:**
  - Wallet-Integration (NEAR Wallet Selector)
  - Proposal-Übersicht, -Erstellung, -Voting
  - Token-Kauf, Transfer, Dividenden-Ansicht
  - Mitgliederprofil, Onboarding, Getting Started
  - Responsive Design (Tailwind CSS)
  - **Dynamische API-URL:** Das Frontend erkennt automatisch, ob es lokal oder online läuft und verwendet die passende Backend-URL (siehe unten).
- **Setup:**
  ```bash
  cd near-react-frontend
  npm install
  npm start
  ```
- **Wichtige Seiten/Komponenten:**
  - `DashboardPage`, `ProposalsPage`, `CreateProposalPage`, `UserProfilePage`
  - `Sidebar`, `Navbar`
- **API-URL:** Wird dynamisch über Umgebungsvariablen gesetzt (siehe unten).
- **Deployment:**
  - **Production:** GitHub Pages (Branch: `gh-pages`)
  - **Lokal:** Mit `.env`-Datei (siehe unten)

### 3. dao-member-registry

- **Sprache:** Node.js (Express), MongoDB
- **Funktionen:**
  - Verwaltung und Speicherung von DAO-Mitgliedern
  - REST-API für Mitglieder- und Aktivitätsdaten
  - Anbindung an das Frontend für Profil- und Aktivitätsverwaltung
- **API-Endpunkte:**
  - **Mitglieder**
    - `GET /api/members` – Liste aller Mitglieder
    - `POST /api/members` – Neues Mitglied anlegen oder vorhandenes aktualisieren
    - `GET /api/members/by-id/:account_id` – Einzelnes Mitglied anhand der account_id abrufen
  - **Aktivitäten**
    - `GET /api/activities` – Liste der letzten 50 Aktivitäten (sortiert nach Zeitstempel)
    - `POST /api/activities` – Neue Aktivität erstellen (nur Käufe erlaubt)
  - **Team**
    - `GET /api/team` – Liste aller Team-Mitglieder
    - `POST /api/team` – Neues Team-Mitglied anlegen
    - `DELETE /api/team/:accountId` – Team-Mitglied löschen
    - `PUT /api/team/:accountId` – Beschreibung eines Team-Mitglieds ändern

    **Beispiel-Antwort für GET /api/team:**
    ```json
    [
      {
        "accountId": "team.dao.lioneluser.testnet",
        "description": "Team Wallet"
      },
      ...
    ]
    ```
  - [API-Dokumentation](https://documenter.getpostman.com/view/33908680/2sB2qXj2dz)
- **Setup:**
  ```bash
  cd dao-member-registry
  npm install
  npm start
  ```
- **Konfiguration:**  
  `.env` mit `MONGO_URI` anlegen (siehe unten)
- **Deployment:**
  - **Production:** Render.com (kostenlos, aber mit Cold Starts)
  - **Lokal:** Mit `.env`-Datei

---

## Setup & Installation

1. **Repository klonen:**
   ```bash
   git clone https://github.com/lnlmrbch/THESIS_DAO.git
   cd THESIS_DAO
   ```

2. **Jede Komponente separat installieren (siehe oben).**

3. **Umgebungsvariablen setzen:**  
   - Für `dao-member-registry` eine `.env` mit `MONGO_URI` anlegen.
   - Für das Frontend (`near-react-frontend`):
     - `.env` für lokale Entwicklung:
       ```
       REACT_APP_API_URL=http://localhost:5050
       ```
     - `.env.production` für Production-Build (GitHub Pages):
       ```
       REACT_APP_API_URL=https://thesis-dao.onrender.com
       ```

4. **Smart Contract auf NEAR deployen** (Testnet empfohlen).

---

## Dynamische API-URL & Umgebungsvariablen

- Das Frontend verwendet überall `process.env.REACT_APP_API_URL` für API-Requests.
- **Lokal:** `.env` → `REACT_APP_API_URL=http://localhost:5050`
- **Production:** `.env.production` → `REACT_APP_API_URL=https://thesis-dao.onrender.com`
- Beim Build für GitHub Pages wird automatisch `.env.production` verwendet.
- **Wichtig:** `.env`-Dateien sind nicht im Repository enthalten (siehe `.gitignore`).

---

## Deployment

- **Smart Contract:**  
  Deployment erfolgt **manuell mit der NEAR CLI** (siehe oben).
- **Frontend:**  
  Deployment auf **GitHub Pages** (Branch: `gh-pages`).  
  - Für Production-Build: `.env.production` mit passender API-URL anlegen, dann `npm run build` und `npm run deploy` ausführen.
- **Backend:**  
  Deployment auf **Render.com** (kostenlos, aber mit Cold Starts).  
  - Im Render-Dashboard Umgebungsvariablen wie `MONGO_URI` setzen.
  - Nach dem Deploy ist das Backend z.B. unter `https://thesis-dao.onrender.com` erreichbar.

---

## UptimeRobot für Demo-Zwecke

- Render Free-Tier-Backends schlafen nach Inaktivität ein (Cold Start).
- Für Demos kann [UptimeRobot](https://uptimerobot.com/) genutzt werden, um das Backend "wach" zu halten:
  - Monitor Type: HTTP(s)
  - URL: `https://thesis-dao.onrender.com/test`
  - Interval: 5 Minuten
- **Status-Monitor:** [UptimeRobot Status](https://stats.uptimerobot.com/Do6s123gnW)
- **Hinweis:** Offiziell ist das von Render nicht erlaubt, für Demos aber gängige Praxis.

---

## Roadmap & Projekte

> **Hinweis:** Die Roadmap und laufende Projekte findest du im Bereich `projects` auf GitHub. [Link](https://github.com/users/lnlmrbch/projects/2)

---

## Ressourcen & Links

- [NEAR Protokoll](https://near.org/)
- [NEAR Rust SDK](https://docs.near.org/sdk/rust/introduction)
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Ollama LLM](https://ollama.ai/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [API Dokumentation (Postman Collection)](https://documenter.getpostman.com/view/33908680/2sB2qXj2dz)
- [UptimeRobot Status](https://stats.uptimerobot.com/Do6s123gnW) 