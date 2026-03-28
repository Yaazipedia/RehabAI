const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk").default;
const { getClientById } = require("../data/mockData");
const { buildBriefingPrompt } = require("../prompts/generateBriefing");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET /api/briefings/:clientId
// Generates a pre-session briefing for a specific client
router.get("/:clientId", async (req, res) => {
  try {
    const client = getClientById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (client.sessions.length === 0) {
      return res.json({
        success: true,
        briefing: {
          clientSnapshot: `${client.name} is a new client (Day ${client.programDay}). No session history available yet.`,
          recentTrajectory: "No sessions recorded. First session briefing not available.",
          patternAlerts: [],
          treatmentPlanProgress: client.treatmentPlan.objectives.map((o) => ({
            objectiveId: o.id,
            objective: o.description,
            status: "not-started",
            evidence: "No session data available.",
          })),
          suggestedFocus: [
            "Consider establishing rapport and conducting a thorough intake assessment.",
            "You might explore the client's treatment goals and motivation for recovery.",
          ],
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

    const responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log(`✅ Briefing generated for ${client.name}`);

    res.json({
      success: true,
      briefing: parsed,
      clientId: client.id,
      clientName: client.name,
      programDay: client.programDay,
      sessionsAnalyzed: client.sessions.length,
    });
  } catch (err) {
    console.error("Briefing error:", err);

    if (err instanceof SyntaxError) {
      return res.status(500).json({
        error: "Failed to parse Claude response",
        message: err.message,
      });
    }

    res.status(500).json({
      error: "Failed to generate briefing",
      message: err.message,
    });
  }
});

module.exports = router;
