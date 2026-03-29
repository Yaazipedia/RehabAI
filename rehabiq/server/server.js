// =============================================================
// RehabIQ Backend Server
// =============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRouter = require("./routes/auth");
const requireAuth = require("./middleware/requireAuth");
const clientsRouter = require("./routes/clients");
const sessionsRouter = require("./routes/sessions");
const briefingsRouter = require("./routes/briefings");
const outcomesRouter = require("./routes/outcomes");

// Seed database on startup (async because sql.js init is async)
const { seedDatabase } = require("./data/seed");
const { renumberAllSessions } = require("./data/database");
seedDatabase()
  .then(() => renumberAllSessions())
  .catch((err) => console.error("Startup error:", err));

if (!process.env.SESSION_SECRET) {
  console.error("FATAL: SESSION_SECRET is required. Add it to rehabiq/server/.env (see .env.example).");
  process.exit(1);
}

if (!process.env.COUNSELOR_EMAIL || !process.env.COUNSELOR_PASSWORD) {
  console.warn("Warning: COUNSELOR_EMAIL or COUNSELOR_PASSWORD not set — counselor login will fail until configured.");
}

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow any origin for hackathon
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Cross-site deployment (Vercel frontend + Render backend) requires
      // sameSite: "none" + secure: true so the browser sends the session
      // cookie on cross-origin requests.
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Public routes
app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Protected API routes
app.use("/api/clients", requireAuth, clientsRouter);
app.use("/api/sessions", requireAuth, sessionsRouter);
app.use("/api/briefings", requireAuth, briefingsRouter);
app.use("/api/outcomes", requireAuth, outcomesRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🧠 RehabIQ API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Clients:      http://localhost:${PORT}/api/clients (auth required)\n`);
});
