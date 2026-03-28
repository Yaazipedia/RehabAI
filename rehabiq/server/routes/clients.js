const express = require("express");
const router = express.Router();
const { getClientsSummary, getClientById } = require("../data/mockData");

// GET /api/clients — Dashboard summary of all clients
router.get("/", (req, res) => {
  try {
    const summary = getClientsSummary();
    res.json({ clients: summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch clients", message: err.message });
  }
});

// GET /api/clients/:id — Full client profile with all sessions
router.get("/:id", (req, res) => {
  try {
    const client = getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ client });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch client", message: err.message });
  }
});

// GET /api/clients/:id/sessions — All sessions for a client
router.get("/:id/sessions", (req, res) => {
  try {
    const client = getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ sessions: client.sessions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions", message: err.message });
  }
});

module.exports = router;
