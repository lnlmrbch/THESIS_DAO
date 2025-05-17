# THESIS DAO – Vollständige Projektübersicht

Willkommen zum **THESIS DAO**-Projekt!  
Dieses Repository enthält eine vollständige, modulare DAO-Lösung mit Smart Contract, React-Frontend, Backend-Services und KI-Chatbot.  
Das Ziel ist es, eine dezentrale, transparente und interaktive DAO-Plattform auf der NEAR-Blockchain bereitzustellen.

---

## Inhaltsverzeichnis

- [THESIS DAO – Vollständige Projektübersicht](#thesis-dao--vollständige-projektübersicht)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Projektüberblick](#projektüberblick)
  - [Architektur](#architektur)
  - [Komponenten](#komponenten)
    - [1. smart-contract](#1-smart-contract)
    - [2. near-react-frontend](#2-near-react-frontend)
    - [3. dao-member-registry](#3-dao-member-registry)
    - [4. chatbot-backend](#4-chatbot-backend)
  - [Setup \& Installation](#setup--installation)
  - [Entwickler- und Nutzer-Workflows](#entwickler--und-nutzer-workflows)
  - [Deployment](#deployment)
  - [Roadmap \& Projekte](#roadmap--projekte)
  - [Ressourcen \& Links](#ressourcen--links)

---

## Projektüberblick

**THESIS DAO** ist eine vollständige DAO-Plattform mit:
- On-Chain Governance (Proposals, Voting, Rollen)
- Token-Ökonomie (Fungible Token, Dividenden, Token-Kauf)
- Mitgliederverwaltung (Off-Chain Registry)
- KI-gestütztem Chatbot für DAO-Interaktion
- Modernem, responsivem Frontend

---

## Architektur

```
.
├── smart-contract/         # Rust-basierter NEAR Smart Contract
├── near-react-frontend/    # React-Frontend für DAO-Interaktion
├── dao-member-registry/    # Node.js Backend für Mitgliederverwaltung
├── chatbot-backend/        # Python FastAPI Backend für KI-Chatbot
└── README.md               # Dieses Dokument
```

---

## Komponenten

### 1. smart-contract

- **Sprache:** Rust
- **Plattform:** NEAR Blockchain
- **Funktionen:**
  - DAO-Governance: Proposals, Voting, Rollen (core, community, finance)
  - Token-Ökonomie: Minting, Kauf, Transfer, Dividenden
  - On-Chain Mitgliederverwaltung (Account-Registrierung, Rollen)
  - Proposal-Logik: Erstellen, Abstimmen, Finalisieren, Quorum, Deadlines
- **Build & Test:**
  ```bash
  cd smart-contract
  cargo near build
  cargo test
  ```
- **Deployment:**
  - Automatisiert via GitHub Actions
  - Manuell:  
    ```bash
    cargo near deploy build-reproducible-wasm <account-id>
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
  - Chatbot-Integration
  - Responsive Design (Tailwind CSS)
- **Setup:**
  ```bash
  cd near-react-frontend
  npm install
  npm start
  ```
- **Wichtige Seiten/Komponenten:**
  - `DashboardPage`, `ProposalsPage`, `CreateProposalPage`, `UserProfilePage`
  - `DaoChatbot`, `Sidebar`, `Navbar`
- **Proxy:** Standardmäßig auf `localhost:5050` (für Backend-APIs)

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
  - <a href="https://documenter.getpostman.com/view/33908680/2sB2qXj2dz" target="_blank">API-Dokumentation</a>
- **Setup:**
  ```bash
  cd dao-member-registry
  npm install
  npm start
  ```
- **Konfiguration:**  
  `.env` mit MongoDB-URI benötigt

### 4. chatbot-backend

- **Sprache:** Python (FastAPI), Ollama (LLM)
- **Funktionen:**
  - KI-gestützter Chatbot für DAO-Fragen und -Support
  - Training mit eigenen Daten (`training_data.json`)
  - REST-API für Chat- und Health-Check
- **API-Endpunkte:**
  - `POST /api/chat` – Chatbot-Anfrage senden
  - `GET /api/health` – Health-Check-Endpunkt
  - <a href="https://documenter.getpostman.com/view/33908680/2sB2qXj2dz" target="_blank">API-Dokumentation</a>
- **Setup:**
  ```bash
  cd chatbot-backend
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ollama serve
  python train.py
  uvicorn main:app --reload
  ```

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

4. **Smart Contract auf NEAR deployen** (Testnet empfohlen).

---

## Entwickler- und Nutzer-Workflows

- **Smart Contract Entwicklung:**  
  Rust-Code im `smart-contract`-Ordner anpassen, testen und deployen.
- **Frontend Entwicklung:**  
  React-Komponenten im `near-react-frontend`-Ordner anpassen, lokal testen.
- **Backend Entwicklung:**  
  Node.js- und Python-Backends für Mitgliederverwaltung und Chatbot anpassen.
- **CI/CD:**  
  GitHub Actions für automatisiertes Deployment nutzen.

---

## Deployment

- **Smart Contract:**  
  Automatisiert via GitHub Actions oder manuell mit `cargo near deploy`.
- **Frontend:**  
  Deployment auf Vercel, Netlify oder eigenem Server möglich.
- **Backends:**  
  Deployment auf beliebigem Node.js/Python-Server (z.B. Heroku, Render, AWS).

---

## Roadmap & Projekte

> **Hinweis:** Die Roadmap und laufende Projekte findest du im Bereich `projects` auf GitHub oder in der Projektverwaltung.

---

## Ressourcen & Links

- <a href="https://near.org/" target="_blank">NEAR Protokoll</a>
- <a href="https://docs.near.org/sdk/rust/introduction" target="_blank">NEAR Rust SDK</a>
- <a href="https://react.dev/" target="_blank">React</a>
- <a href="https://expressjs.com/" target="_blank">Express.js</a>
- <a href="https://fastapi.tiangolo.com/" target="_blank">FastAPI</a>
- <a href="https://ollama.ai/" target="_blank">Ollama LLM</a>
- <a href="https://www.mongodb.com/" target="_blank">MongoDB</a>
- <a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a>
- <a href="https://documenter.getpostman.com/view/33908680/2sB2qXj2dz" target="_blank">API Dokumentation (Postman Collection)</a>

---
