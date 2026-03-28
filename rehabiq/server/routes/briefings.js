const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk").default;
const { getClientById } = require("../data/database");
const { buildBriefingPrompt } = require("../prompts/generateBriefing");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// GET /api/briefings/:clientId
router.get("/:clientId", async (req, res) => {
  try {
    const client = await getClientById(req.params.clientId);
    if (!client) return res.status(404).json({ error: "Client not found" });

    if (!client.sessions || client.sessions.length === 0) {
      return res.json({
        success: true,
        briefing: {
          clientSnapshot: `${client.name} is a new client (Day ${client.programDay}). No session history available yet.`,
          recentTrajectory: "No sessions recorded.",
          patternAlerts: [],
          treatmentPlanProgress: [],
          suggestedFocus: ["Consider establishing rapport and conducting a thorough intake assessment."],
          strengthsToReinforce: [],
        },
      });
    }

    const { systemPrompt, userPrompt } = buildBriefingPrompt(client);
    console.log(`\n📋 Generating briefing for ${client.name}...`);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log(`✅ Briefing generated for ${client.name}`);
    res.json({
      success: true, briefing: parsed,
      clientId: client.id, clientName: client.name,
      programDay: client.programDay, sessionsAnalyzed: client.sessions.length,
    });
  } catch (err) {
    console.error("Briefing error:", err);
    if (err instanceof SyntaxError) return res.status(500).json({ error: "Failed to parse Claude response", message: err.message });
    res.status(500).json({ error: "Failed to generate briefing", message: err.message });
  }
});

module.exports = router;
