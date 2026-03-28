const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk").default;
const { getClientById } = require("../data/mockData");
const { buildOutcomesPrompt } = require("../prompts/analyzeOutcomes");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// GET /api/outcomes/:clientId
// Generates clinical outcome analysis and intervention effectiveness report
router.get("/:clientId", async (req, res) => {
  try {
    const client = getClientById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    if (client.sessions.length < 2) {
      return res.json({
        success: true,
        outcomes: {
          interventionEffectiveness: [],
          outcomeTrends: {
            triggerManagement: {
              trend: "too-early-to-assess",
              evidence: "Insufficient session data for trend analysis. Minimum 2 sessions required.",
            },
            supportNetwork: {
              trend: "too-early-to-assess",
              evidence: "Insufficient session data for trend analysis.",
            },
            engagementLevel: {
              trend: "too-early-to-assess",
              evidence: "Insufficient session data for trend analysis.",
            },
            copingCapacity: {
              trend: "too-early-to-assess",
              evidence: "Insufficient session data for trend analysis.",
            },
            overallTrajectory: {
              trend: "too-early-to-assess",
              summary: "Client is early in treatment. Outcome analysis will become available after additional sessions.",
            },
          },
          evidenceBasedRecommendations: [],
          supervisionTalkingPoints: [
            "Review initial treatment approach and assess early client engagement.",
          ],
        },
        note: "Outcome analysis requires at least 2 sessions of data.",
      });
    }

    const { systemPrompt, userPrompt } = buildOutcomesPrompt(client);

    console.log(`\n📊 Analyzing outcomes for ${client.name}...`);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    console.log(`✅ Outcomes analyzed for ${client.name}`);

    res.json({
      success: true,
      outcomes: parsed,
      clientId: client.id,
      clientName: client.name,
      sessionsAnalyzed: client.sessions.length,
      analysisDate: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Outcomes error:", err);

    if (err instanceof SyntaxError) {
      return res.status(500).json({
        error: "Failed to parse Claude response",
        message: err.message,
      });
    }

    res.status(500).json({
      error: "Failed to analyze outcomes",
      message: err.message,
    });
  }
});

module.exports = router;
