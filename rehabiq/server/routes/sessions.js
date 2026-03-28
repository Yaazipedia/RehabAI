const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk").default;
const { getClientById, addSession } = require("../data/mockData");
const { buildDocumentationPrompt } = require("../prompts/documentSession");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// POST /api/sessions/document
// Takes raw counselor notes and generates structured documentation
router.post("/document", async (req, res) => {
  try {
    const { clientId, rawNotes, sessionNumber } = req.body;

    if (!clientId || !rawNotes) {
      return res.status(400).json({
        error: "Missing required fields: clientId, rawNotes",
      });
    }

    const client = getClientById(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const sessNum = sessionNumber || client.sessions.length + 1;
    const { systemPrompt, userPrompt } = buildDocumentationPrompt(
      client,
      rawNotes,
      sessNum
    );

    console.log(`\n📝 Documenting session ${sessNum} for ${client.name}...`);

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

    // Parse JSON response — handle potential markdown fences
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Create the session object
    const today = new Date().toISOString().split("T")[0];
    const newSession = {
      id: `sess-${clientId.split("-")[1]}-${sessNum}`,
      sessionNumber: sessNum,
      date: today,
      rawNotes: rawNotes,
      dapNote: parsed.dapNote,
      tags: parsed.tags,
      followUpFlags: parsed.followUpFlags,
    };

    // Add to in-memory store
    addSession(clientId, newSession);

    console.log(`✅ Session ${sessNum} documented for ${client.name}`);

    res.json({
      success: true,
      session: newSession,
    });
  } catch (err) {
    console.error("Documentation error:", err);

    // If it's a JSON parse error, return the raw response for debugging
    if (err instanceof SyntaxError) {
      return res.status(500).json({
        error: "Failed to parse Claude response",
        message: err.message,
        hint: "Claude may have returned non-JSON content. Check server logs.",
      });
    }

    res.status(500).json({
      error: "Failed to document session",
      message: err.message,
    });
  }
});

module.exports = router;
