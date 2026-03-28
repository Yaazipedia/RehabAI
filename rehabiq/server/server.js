// =============================================================
// RehabIQ Backend Server
// =============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const clientsRouter = require("./routes/clients");
const sessionsRouter = require("./routes/sessions");
const briefingsRouter = require("./routes/briefings");
const outcomesRouter = require("./routes/outcomes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Request logging (helpful during hackathon debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/clients", clientsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/briefings", briefingsRouter);
app.use("/api/outcomes", outcomesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n🧠 RehabIQ API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Clients:      http://localhost:${PORT}/api/clients\n`);
});
