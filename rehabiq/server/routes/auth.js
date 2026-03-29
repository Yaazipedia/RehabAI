const express = require("express");
const crypto = require("crypto");

const router = express.Router();

function safeEqualString(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const email = (req.body?.email || "").trim();
  const password = req.body?.password != null ? String(req.body.password) : "";
  const expectedEmail = (process.env.COUNSELOR_EMAIL || "").trim();
  const expectedPassword = process.env.COUNSELOR_PASSWORD != null ? String(process.env.COUNSELOR_PASSWORD) : "";

  // Hackathon bypass: Accept any email ending in @rehabiq.com or @rehab.com as a valid sign-up/login
  const isHackathonSignup = email.toLowerCase().endsWith("@rehabiq.com") || email.toLowerCase().endsWith("@rehab.com");

  if (!isHackathonSignup) {
    if (!expectedEmail || !expectedPassword) {
      console.error("Auth: COUNSELOR_EMAIL and COUNSELOR_PASSWORD must be set in .env");
      return res.status(500).json({ error: "Server authentication is not configured" });
    }

    const emailOk = safeEqualString(email, expectedEmail);
    const passwordOk = safeEqualString(password, expectedPassword);

    if (!emailOk || !passwordOk) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  }

  req.session.authenticated = true;
  res.json({ success: true, authenticated: true });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true });
  });
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (req.session?.authenticated === true) {
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
});

module.exports = router;
