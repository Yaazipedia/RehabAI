# RehabIQ — Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Backend](#backend)
   - [Entry Point](#entry-point)
   - [Authentication](#authentication)
   - [Middleware](#middleware)
   - [Database Layer](#database-layer)
   - [REST API Reference](#rest-api-reference)
4. [AI / Prompt Engineering](#ai--prompt-engineering)
   - [Session Documentation](#1-session-documentation)
   - [Pre-Session Briefing](#2-pre-session-briefing)
   - [Outcome Analysis](#3-outcome-analysis)
5. [Frontend](#frontend)
   - [App Shell & Routing](#app-shell--routing)
   - [Components](#components)
   - [API Service Layer](#api-service-layer)
6. [Data Models](#data-models)
   - [Client](#client-object)
   - [Session](#session-object)
7. [Configuration Reference](#configuration-reference)
8. [Deployment Notes](#deployment-notes)

---

## Architecture Overview

```
┌────────────────────────────┐        ┌──────────────────────────────┐
│   React Frontend (Vite)    │        │   Express Backend (Node.js)  │
│                            │  HTTP  │                              │
│  - Dashboard               │◄──────►│  - /api/auth                 │
│  - Client Profiles         │        │  - /api/clients              │
│  - Session Documentation   │        │  - /api/sessions             │
│  - AI Briefings            │        │  - /api/briefings            │
│  - Outcome Analysis        │        │  - /api/outcomes             │
│                            │        │               │              │
└────────────────────────────┘        │        sql.js (SQLite)       │
                                      │               │              │
                                      │     Anthropic Claude API     │
                                      └──────────────────────────────┘
```

- **Frontend** is a single-page React app with manual client-side routing (no React Router).
- **Backend** is a single Express server that handles both data persistence and AI API calls.
- **Database** is SQLite, accessed via `sql.js` (a pure-JS build — no native binaries required). The `.db` file is persisted as a binary file in `server/data/rehabiq.db`.
- **Authentication** uses server-side Express sessions (`express-session`) with a signed cookie.
- **AI features** call the Anthropic Messages API using `claude-sonnet-4-20250514`.

---

## Directory Structure

```
rehabiq/
├── client/                          # React frontend
│   ├── index.html                   # HTML shell
│   ├── vite.config.js               # Vite + Tailwind + dev proxy setup
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # React root mount
│       ├── App.jsx                  # App shell, auth gating, routing
│       ├── index.css                # Global CSS variables + Tailwind
│       ├── services/
│       │   └── api.js               # All fetch() calls to the backend
│       └── components/
│           ├── Layout/              # Sidebar, Header
│           ├── Login/               # Login form
│           ├── Dashboard/           # Client list + search
│           ├── ClientView/          # Full client profile
│           ├── SessionDoc/          # AI session documentation form
│           ├── NewClient/           # Add client form
│           └── Shared/              # Reusable UI elements
│
└── server/                          # Express backend
    ├── server.js                    # Entry point — Express app setup
    ├── package.json
    ├── .env.example                 # Environment variable template
    ├── middleware/
    │   └── requireAuth.js           # Session auth guard
    ├── routes/
    │   ├── auth.js                  # Login / logout / session check
    │   ├── clients.js               # CRUD for client profiles
    │   ├── sessions.js              # AI-powered session documentation
    │   ├── briefings.js             # AI pre-session briefing generation
    │   └── outcomes.js              # AI multi-session outcome analysis
    ├── prompts/
    │   ├── documentSession.js       # Prompt builder for session docs
    │   ├── generateBriefing.js      # Prompt builder for briefings
    │   └── analyzeOutcomes.js       # Prompt builder for outcome analysis
    └── data/
        ├── database.js              # sql.js wrapper + all DB queries
        ├── seed.js                  # Demo data seeder
        ├── mockData.js              # Seed data definitions
        └── rehabiq.db               # SQLite binary (pre-seeded, committed)
```

---

## Backend

### Entry Point

**`server/server.js`**

- Loads `.env` via `dotenv`
- Validates that `SESSION_SECRET`, `COUNSELOR_EMAIL`, and `COUNSELOR_PASSWORD` are set
- Configures CORS to accept any origin (hackathon mode) with `credentials: true`
- Configures `express-session` with cross-site cookie settings for Vercel + Render deployment:
  - Production: `secure: true`, `sameSite: "none"`
  - Development: `secure: false`, `sameSite: "lax"`
- Sets `trust proxy: 1` so that Render's reverse proxy forwards `req.secure` correctly
- Wires up all route handlers under `/api/*`
- Calls `seedDatabase()` and `renumberAllSessions()` on startup

**Production detection logic:**
```js
const isProd =
  process.env.NODE_ENV === "production" ||
  (!clientOrigin.includes("localhost") && !clientOrigin.includes("127.0.0.1"));
```
This means even without `NODE_ENV=production`, if `CLIENT_ORIGIN` is a non-localhost URL (i.e. your Vercel URL), the server will automatically use production-safe cookie settings.

---

### Authentication

**`server/routes/auth.js`**

Single-counselor authentication — there is no user database. Credentials come from environment variables.

#### Hackathon bypass
Any email ending in `@rehabiq.com` or `@rehab.com` with **any password** is accepted. This allows quick demo access without configuring `.env` credentials.

#### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Verify credentials, set session |
| `POST` | `/api/auth/logout` | Public | Destroy session |
| `GET` | `/api/auth/me` | Public | Return `{ authenticated: true/false }` |

**Timing-safe comparison** is used for credential checking via `crypto.timingSafeEqual` to prevent timing attacks.

---

### Middleware

**`server/middleware/requireAuth.js`**

Checks `req.session.authenticated === true` on every protected route. Returns `401 Unauthorized` if not authenticated.

All routes under `/api/clients`, `/api/sessions`, `/api/briefings`, and `/api/outcomes` are protected.

---

### Database Layer

**`server/data/database.js`**

Uses `sql.js` — SQLite compiled to WebAssembly. This avoids native binary dependencies (no build tools needed on Render).

#### Initialization flow

```
getDb() → _initDb() → loads .db file from disk (if exists)
                    → otherwise creates new in-memory DB
                    → runs PRAGMA + initTables()
```

Every write operation calls `persist()` which exports the in-memory database to disk.

#### Schema

**`clients` table**

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | e.g. `client-1234567890` |
| `name` | TEXT | |
| `age` | INTEGER | |
| `gender` | TEXT | |
| `diagnosis` | TEXT | Primary substance use diagnosis |
| `co_occurring` | TEXT | Co-occurring mental health conditions |
| `program_type` | TEXT | e.g. Residential, Outpatient, IOP |
| `admission_date` | TEXT | ISO date string |
| `program_day` | INTEGER | Days since admission |
| `mat` | TEXT | Medication-Assisted Treatment details |
| `insurance` | TEXT | |
| `emergency_contact` | TEXT | |
| `risk_level` | TEXT | `low`, `moderate`, `high` |
| `treatment_plan` | TEXT | JSON array of objective objects |
| `created_at` | TEXT | ISO datetime |
| `updated_at` | TEXT | ISO datetime |

**`sessions` table**

| Column | Type | Notes |
|---|---|---|
| `id` | TEXT PK | e.g. `sess-1234567890` |
| `client_id` | TEXT FK | References `clients.id` |
| `session_number` | INTEGER | Sequential per client |
| `date` | TEXT | ISO date string |
| `raw_notes` | TEXT | Counselor's original rough notes |
| `dap_note` | TEXT | JSON — AI-generated DAP note |
| `tags` | TEXT | JSON — clinical tags |
| `follow_up_flags` | TEXT | JSON array of strings |
| `created_at` | TEXT | ISO datetime |

#### Exported functions

```js
getAllClients()            → Client[] (with summary fields)
getClientById(id)         → Client (with full sessions array)
createClient(data)        → Client
updateClientRisk(id, lvl) → void
updateClientProgramDay(id, day) → void
getSessionsByClient(id)   → Session[]
addSession(clientId, sessionData) → Session
getSessionCount(clientId) → number
renumberAllSessions()     → void (fixes any gaps in session_number)
isSeeded()                → boolean
```

---

## REST API Reference

All endpoints are prefixed `/api`. Protected endpoints require an active session cookie.

### Auth

```
POST /api/auth/login
  Body: { email, password }
  Response: { success: true, authenticated: true }

POST /api/auth/logout
  Response: { success: true }

GET /api/auth/me
  Response: { authenticated: true } | 401
```

### Health

```
GET /api/health
  Response: { status: "ok", timestamp: "..." }
```

### Clients (all protected)

```
GET /api/clients
  Response: { clients: Client[] }

GET /api/clients/:id
  Response: { client: Client }  (includes full sessions array)

POST /api/clients
  Body: { name, age, gender, diagnosis, programType,
          coOccurring?, mat?, insurance?, emergencyContact?,
          riskLevel?, objectives? }
  Response: 201 { success: true, client: Client }
```

### Sessions (protected)

```
POST /api/sessions/document
  Body: { clientId, rawNotes, sessionNumber? }
  Response: { success: true, session: Session }
  Side effects: Calls Claude to generate DAP note, saves to DB
```

### Briefings (protected)

```
GET /api/briefings/:clientId
  Response: {
    success: true,
    briefing: Briefing,
    sessionsAnalyzed: number,
    fromCache: boolean,
    ...
  }
  Side effects: Calls Claude on cache miss. Returns static empty
                briefing if no sessions exist.
```

### Outcomes (protected)

```
GET /api/outcomes/:clientId
  Response: {
    success: true,
    outcomes: Outcomes,
    sessionsAnalyzed: number,
    fromCache: boolean,
    ...
  }
  Note: Requires at least 2 sessions. Returns placeholder
        "too-early-to-assess" data otherwise.
```

**Caching:** Both `/briefings` and `/outcomes` use an in-memory `Map` keyed by `clientId`. The cached response is invalidated when `sessionCount` changes (i.e. a new session is added).

---

## AI / Prompt Engineering

All prompts are in `server/prompts/`. Each exports a `build*Prompt(...)` function that returns `{ systemPrompt, userPrompt }`. The routes call `anthropic.messages.create(...)` and parse the JSON response.

All prompts instruct Claude to **respond in valid JSON only** — no markdown, no preamble.

### 1. Session Documentation

**File:** `prompts/documentSession.js`  
**Model:** `claude-sonnet-4-20250514`  
**Max tokens:** 2000

**Input:** Client profile + counselor's raw notes + session number  
**Output schema:**
```json
{
  "dapNote": {
    "data": "...",
    "assessment": "...",
    "plan": "..."
  },
  "tags": {
    "moodIndicators": [],
    "substancesMentioned": [],
    "triggersIdentified": [],
    "copingStrategiesDiscussed": [],
    "supportNetworkChanges": "...",
    "objectivesAddressed": [],
    "riskIndicators": [],
    "sessionSentiment": "improving | stable | declining | concerning | mixed | cautiously-improving",
    "keyQuotes": []
  },
  "followUpFlags": []
}
```

**Key prompt rules:**
- Use third-person clinical voice
- Flag safety concerns with `PRIORITY:` or `URGENT:` prefix in `followUpFlags`
- Do not diagnose — only observe and report
- Mark ambiguous information as "counselor to clarify"

---

### 2. Pre-Session Briefing

**File:** `prompts/generateBriefing.js`  
**Model:** `claude-sonnet-4-20250514`  
**Max tokens:** 2000

**Input:** Full client profile including all historical session data  
**Output schema:**
```json
{
  "quickGlance": {
    "oneLiner": "...",
    "riskScore": "low | moderate | elevated | high",
    "trajectory": "improving | stable | declining | mixed",
    "topPriority": "...",
    "keyFlags": [],
    "lastSessionHighlight": "..."
  },
  "fullBriefing": {
    "clientSnapshot": "...",
    "recentTrajectory": "...",
    "patternAlerts": [ { "type", "title", "detail", "clinicalImplication" } ],
    "treatmentPlanProgress": [ { "objectiveId", "objective", "status", "progressPercent", "evidence" } ],
    "suggestedFocus": [],
    "strengthsToReinforce": []
  }
}
```

**Key prompt rules:**
- Quick Glance must be scannable in under 30 seconds
- Full Briefing must cite specific session numbers
- Suggestions are framed as "Consider..." — never directives
- Highlight both concerns and strengths

---

### 3. Outcome Analysis

**File:** `prompts/analyzeOutcomes.js`  
**Model:** `claude-sonnet-4-20250514`  
**Max tokens:** 3000

**Input:** Full client profile with all sessions  
**Output schema:**
```json
{
  "interventionEffectiveness": [
    { "intervention", "frequency", "averageResponse", "evidence", "recommendation" }
  ],
  "outcomeTrends": {
    "triggerManagement": { "trend", "evidence" },
    "supportNetwork": { "trend", "evidence" },
    "engagementLevel": { "trend", "evidence" },
    "copingCapacity": { "trend", "evidence" },
    "overallTrajectory": { "trend", "summary" }
  },
  "evidenceBasedRecommendations": [
    { "recommendation", "rationale", "priority" }
  ],
  "supervisionTalkingPoints": []
}
```

---

## Frontend

### App Shell & Routing

**`src/App.jsx`** is the application root. It manages:

- **Auth state** (`loading | guest | authed`) — checks `GET /api/auth/me` on mount
- **View routing** — a single `view` string (`dashboard | session | client | newclient`) replaces a router
- **Dark mode** — stored in React state, applied via `data-theme` on `<html>`
- **Global search query** — passed down to the Dashboard component

```
authStatus === "loading"   → spinner
authStatus === "guest"     → <Login />
authStatus === "authed"    → full app layout
```

### Components

| Component | Path | Description |
|---|---|---|
| `Layout/Sidebar` | `components/Layout/Sidebar.jsx` | Nav links, logout button |
| `Layout/Header` | `components/Layout/Header.jsx` | Page title, search, dark mode toggle |
| `Login/Login` | `components/Login/Login.jsx` | Login form |
| `Dashboard/Dashboard` | `components/Dashboard/Dashboard.jsx` | Client list with search/filter |
| `ClientView/ClientView` | `components/ClientView/ClientView.jsx` | Full client profile; triggers AI briefing and outcome analysis |
| `SessionDoc/SessionDoc` | `components/SessionDoc/SessionDoc.jsx` | Counselor note input form; calls AI documentation |
| `NewClient/NewClient` | `components/NewClient/NewClient.jsx` | New client intake form |

### API Service Layer

**`src/services/api.js`**

All HTTP communication goes through this module. Key design decisions:

- `VITE_API_URL` environment variable is used in production; falls back to `/api` for local dev (the Vite proxy forwards `/api` → `localhost:3001`)
- All requests include `credentials: "include"` so the session cookie is sent on cross-origin requests
- Functions throw `Error` on non-2xx responses with the server's error message

| Function | HTTP | Endpoint |
|---|---|---|
| `fetchAuthMe()` | GET | `/auth/me` |
| `login(email, password)` | POST | `/auth/login` |
| `logout()` | POST | `/auth/logout` |
| `fetchClients()` | GET | `/clients` |
| `fetchClient(id)` | GET | `/clients/:id` |
| `createNewClient(data)` | POST | `/clients` |
| `documentSession(clientId, notes, num)` | POST | `/sessions/document` |
| `fetchBriefing(clientId)` | GET | `/briefings/:clientId` |
| `fetchOutcomes(clientId)` | GET | `/outcomes/:clientId` |

---

## Data Models

### Client Object

```ts
{
  id: string;                  // "client-{timestamp}"
  name: string;
  age: number;
  gender: string;
  diagnosis: string;           // Primary substance use disorder
  coOccurring: string | null;  // Co-occurring mental health conditions
  programType: string;         // "Residential" | "IOP" | "Outpatient" | ...
  admissionDate: string;       // "YYYY-MM-DD"
  programDay: number;
  mat: string | null;          // Medication-Assisted Treatment
  insurance: string | null;
  emergencyContact: string | null;
  riskLevel: "low" | "moderate" | "high";
  treatmentPlan: {
    objectives: {
      id: string;              // "obj-1", "obj-2", ...
      description: string;
      status: "in-progress" | "on-track" | "achieved" | "at-risk" | "stalled";
      targetDate: string | null;
    }[];
  };
  // Summary fields (populated on GET /clients list only)
  totalSessions: number;
  lastSessionDate: string | null;
  lastSessionSentiment: string;
  nextObjectiveAtRisk: object | null;
  // Full sessions (populated on GET /clients/:id only)
  sessions?: Session[];
  createdAt: string;
  updatedAt: string;
}
```

### Session Object

```ts
{
  id: string;            // "sess-{timestamp}"
  sessionNumber: number; // Sequential per client, 1-indexed
  date: string;          // "YYYY-MM-DD"
  rawNotes: string;      // Counselor's original notes
  dapNote: {
    data: string;
    assessment: string;
    plan: string;
  };
  tags: {
    moodIndicators: string[];
    substancesMentioned: string[];
    triggersIdentified: string[];
    copingStrategiesDiscussed: string[];
    supportNetworkChanges: string;
    objectivesAddressed: string[];
    riskIndicators: string[];
    sessionSentiment: string;
    keyQuotes: string[];
  };
  followUpFlags: string[];
}
```

---

## Configuration Reference

| Variable | Where | Required | Default | Description |
|---|---|---|---|---|
| `ANTHROPIC_API_KEY` | Server `.env` | Yes | — | Anthropic API key for all AI features |
| `SESSION_SECRET` | Server `.env` | Yes | — | Secret for signing session cookies |
| `COUNSELOR_EMAIL` | Server `.env` | Yes* | — | Counselor login email |
| `COUNSELOR_PASSWORD` | Server `.env` | Yes* | — | Counselor login password |
| `CLIENT_ORIGIN` | Server `.env` | No | `http://localhost:5173` | Allowed browser origin |
| `PORT` | Server `.env` | No | `3001` | Server listen port |
| `NODE_ENV` | Server env | No | — | Set to `production` to force prod cookies |
| `VITE_API_URL` | Client env | No | `/api` | Full backend URL for production |

\* Not required for the hackathon bypass (any `@rehabiq.com` / `@rehab.com` email)

---

## Deployment Notes

### Cross-origin session cookies (Vercel + Render)

When the frontend (Vercel) and backend (Render) are on different domains, cookies require:
- `sameSite: "none"` — allows cross-site cookie sending
- `secure: true` — required when `sameSite: "none"`
- `credentials: "include"` on every fetch call from the frontend

The server auto-detects production mode from `CLIENT_ORIGIN` so explicit `NODE_ENV` is optional.

### Database persistence on Render

`sql.js` keeps the database in memory and writes to disk via `persist()` after every write. On Render's free tier, the filesystem is ephemeral — data is lost on redeploy. The pre-seeded `rehabiq.db` file is committed to the repo so demo data is always available on cold boot.

### First-boot seeding

On every server start, `seedDatabase()` checks `isSeeded()` (counts rows in `clients`). If the table is empty, it inserts the demo dataset. If data already exists, seeding is skipped.
