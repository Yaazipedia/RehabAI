# 🧠 RehabIQ — AI-Powered Clinical Intelligence for Rehabilitation Counselors

> Built for the Anthropic Hackathon · Full-stack · React + Node.js · Powered by Claude Sonnet

RehabIQ is a clinical intelligence platform that helps substance-abuse rehabilitation counselors work smarter. It uses AI to automate session documentation, surface actionable pre-session briefings, and analyze client outcomes — so counselors spend less time on paperwork and more time with clients.

---

## ✨ Core Features

| Feature | What it does |
|---|---|
| **AI Session Documentation** | Counselor pastes rough notes → Claude generates a structured DAP note with clinical tags and follow-up flags |
| **Pre-Session Briefing** | Instant AI-generated briefing before every session: risk score, trajectory, pattern alerts, and suggested session focus |
| **Outcome Analysis** | Multi-session trend analysis: intervention effectiveness, outcome trends across 4 domains, evidence-based recommendations |
| **Client Management** | Full client profiles with treatment plans, program-day tracking, and risk-level triage |
| **Counselor Dashboard** | At-a-glance view of all clients sorted by risk level, with real-time search |

---

## 🗂️ Project Structure

```
Claude Hackathon/
├── README.md            # ← you are here
├── TECHNICAL.md         # Architecture, API reference, data models
├── DEMO_GUIDE.md        # Step-by-step guide for judges / demos
└── rehabiq/
    ├── client/          # React + Vite + TailwindCSS frontend
    └── server/          # Node.js + Express + sql.js backend
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** v18+ (v20 recommended)
- An **Anthropic API key** — get one free at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone & install dependencies

```bash
# Install server dependencies
cd rehabiq/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure the server

```bash
cd rehabiq/server
cp .env.example .env
```

Open `rehabiq/server/.env` and fill in your values:

```env
ANTHROPIC_API_KEY=sk-ant-...         # Required for all AI features
SESSION_SECRET=some-long-random-str  # Required — used to sign session cookies
COUNSELOR_EMAIL=you@example.com      # Your login email
COUNSELOR_PASSWORD=your-password     # Your login password
CLIENT_ORIGIN=http://localhost:5173  # Leave as-is for local dev
PORT=3001                            # Leave as-is for local dev
```

### 3. Start the backend

```bash
cd rehabiq/server
npm run dev
# → 🧠 RehabIQ API running on http://localhost:3001
```

### 4. Start the frontend

```bash
cd rehabiq/client
npm run dev
# → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser and log in with the credentials you set in `.env`.

> **Hackathon shortcut:** Any email ending in `@rehabiq.com` or `@rehab.com` (e.g. `demo@rehabiq.com`) with any password will log in without needing configured credentials.

---

## 🛠️ Tech Stack

### Frontend (`rehabiq/client`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| HTTP | Native `fetch` with session cookies |
| State | React `useState` / `useEffect` (no external store) |

### Backend (`rehabiq/server`)
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | SQLite via `sql.js` (pure JS — no native deps) |
| Sessions | `express-session` (server-side, cookie-based) |
| AI | Anthropic Claude Sonnet via `@anthropic-ai/sdk` |

---

## 🌐 Production Deployment

The app is deployed as two independent services:

| Service | Platform | URL pattern |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | `https://your-app.vercel.app` |
| Backend | [Render](https://render.com) | `https://your-api.onrender.com` |

### Required environment variables on Render (backend)

```
ANTHROPIC_API_KEY=<your key>
SESSION_SECRET=<long random string>
COUNSELOR_EMAIL=<login email>
COUNSELOR_PASSWORD=<login password>
CLIENT_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

### Required environment variables on Vercel (frontend)

```
VITE_API_URL=https://your-api.onrender.com/api
```

The database file (`rehabiq/server/data/rehabiq.db`) is pre-seeded and committed to the repo, so the app starts with demo client data on first boot.

---

## 📖 Documentation

- **[Technical Documentation](TECHNICAL.md)** — Architecture, API reference, data models, AI prompt design
- **[Demo Guide](DEMO_GUIDE.md)** — Step-by-step walkthrough for judges and demos
- **[Environment Variables](rehabiq/server/.env.example)** — Server configuration reference

---

## 📄 License

MIT — built for the Anthropic Hackathon.
