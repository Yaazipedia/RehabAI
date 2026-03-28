const express = require("express");
const router = express.Router();
const { getAllClients, getClientById, createClient } = require("../data/database");

// GET /api/clients — Dashboard summary of all clients
router.get("/", async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json({ clients });
  } catch (err) {
    console.error("Fetch clients error:", err);
    res.status(500).json({ error: "Failed to fetch clients", message: err.message });
  }
});

// GET /api/clients/:id — Full client profile with all sessions
router.get("/:id", async (req, res) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json({ client });
  } catch (err) {
    console.error("Fetch client error:", err);
    res.status(500).json({ error: "Failed to fetch client", message: err.message });
  }
});

// POST /api/clients — Create a new client
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, diagnosis, coOccurring, programType, mat, insurance, emergencyContact, riskLevel, objectives } = req.body;

    if (!name || !age || !gender || !diagnosis || !programType) {
      return res.status(400).json({
        error: "Missing required fields: name, age, gender, diagnosis, programType",
      });
    }

    // Build treatment plan objectives from the submitted list
    const treatmentPlan = {
      objectives: (objectives || []).map((obj, i) => ({
        id: `obj-${i + 1}`,
        description: obj.description || obj,
        status: obj.status || "in-progress",
        targetDate: obj.targetDate || null,
      })),
    };

    const client = await createClient({
      name,
      age: parseInt(age),
      gender,
      diagnosis,
      coOccurring: coOccurring || null,
      programType,
      admissionDate: new Date().toISOString().split("T")[0],
      programDay: 1,
      mat: mat || null,
      insurance: insurance || null,
      emergencyContact: emergencyContact || null,
      riskLevel: riskLevel || "moderate",
      treatmentPlan,
    });

    console.log(`✅ New client created: ${client.name} (${client.id})`);
    res.status(201).json({ success: true, client });
  } catch (err) {
    console.error("Create client error:", err);
    res.status(500).json({ error: "Failed to create client", message: err.message });
  }
});

module.exports = router;
