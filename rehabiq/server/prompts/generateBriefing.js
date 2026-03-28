// =============================================================
// Prompt 2: Pre-Session Briefing Generator (v2)
// Now generates both a Quick Glance (30-sec scan) and Full Briefing
// =============================================================

function buildBriefingPrompt(clientProfile) {
  const sessionsContext = clientProfile.sessions
    .map(
      (s) => `
SESSION ${s.sessionNumber} (${s.date}):
DAP Data: ${s.dapNote.data}
Assessment: ${s.dapNote.assessment}
Plan: ${s.dapNote.plan}
Mood: ${(s.tags.moodIndicators || []).join(", ")}
Triggers: ${(s.tags.triggersIdentified || []).join(", ") || "None"}
Coping: ${(s.tags.copingStrategiesDiscussed || []).join(", ")}
Support: ${s.tags.supportNetworkChanges || "No changes"}
Risk: ${(s.tags.riskIndicators || []).join(", ") || "None"}
Sentiment: ${s.tags.sessionSentiment}
Quotes: ${(s.tags.keyQuotes || []).join(" | ")}
Follow-ups: ${(s.followUpFlags || []).join("; ")}
`
    )
    .join("\n---\n");

  const systemPrompt = `You are a clinical intelligence assistant preparing a rehabilitation counselor for their next session. You generate TWO outputs:
1. A QUICK GLANCE (30-second scan before walking into session)
2. A FULL BRIEFING (detailed analysis if they have more time)

RULES:
- Quick Glance must be scannable in 30 seconds — short phrases, not sentences
- Cite specific session numbers in the Full Briefing
- Frame suggestions as "Consider..." — never directives
- Highlight both concerns AND strengths
- Be clinically precise but concise

Respond in VALID JSON only. No markdown, no backticks, no preamble.`;

  const userPrompt = `Generate a pre-session briefing for this client.

CLIENT: ${clientProfile.name}, ${clientProfile.age}yo ${clientProfile.gender}
DIAGNOSIS: ${clientProfile.diagnosis}
CO-OCCURRING: ${clientProfile.coOccurring || "None"}
PROGRAM: ${clientProfile.programType} • Day ${clientProfile.programDay}
MAT: ${clientProfile.mat || "None"}

OBJECTIVES:
${(clientProfile.treatmentPlan?.objectives || [])
  .map((o) => `- [${o.id || "obj"}] [${o.status}] ${o.description}`)
  .join("\n")}

SESSION HISTORY:
${sessionsContext}

Generate this JSON:
{
  "quickGlance": {
    "oneLiner": "One sentence: where this client is RIGHT NOW (max 15 words)",
    "riskScore": "low | moderate | elevated | high",
    "trajectory": "improving | stable | declining | mixed",
    "topPriority": "The single most important thing for this session (max 12 words)",
    "keyFlags": ["3-5 short flags, max 8 words each, most urgent first"],
    "lastSessionHighlight": "One key thing from the last session (max 15 words)"
  },
  "fullBriefing": {
    "clientSnapshot": "2-3 sentences about where client is in their recovery journey.",
    "recentTrajectory": "3-4 sentences about what's happened across recent sessions with mood/engagement trend.",
    "patternAlerts": [
      {
        "type": "concern | positive | neutral",
        "title": "Short pattern title (max 10 words)",
        "detail": "1-2 sentences with session number citations",
        "clinicalImplication": "1 sentence clinical meaning"
      }
    ],
    "treatmentPlanProgress": [
      {
        "objectiveId": "obj-X",
        "objective": "objective text",
        "status": "on-track | in-progress | stalled | at-risk | achieved",
        "progressPercent": 0-100,
        "evidence": "1 sentence with session references"
      }
    ],
    "suggestedFocus": [
      "2-4 specific suggestions, each starting with 'Consider...' (max 20 words each)"
    ],
    "strengthsToReinforce": [
      "1-2 strengths (max 15 words each)"
    ]
  }
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildBriefingPrompt };
