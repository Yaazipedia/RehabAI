// =============================================================
// Prompt 3: Outcome & Intervention Effectiveness Analyzer (v2)
// Produces numeric scores and structured data for visual dashboard
// =============================================================

function buildOutcomesPrompt(clientProfile) {
  const sessionsContext = clientProfile.sessions
    .map(
      (s) => `
SESSION ${s.sessionNumber} (${s.date}):
Mood: ${(s.tags.moodIndicators || []).join(", ")}
Sentiment: ${s.tags.sessionSentiment}
Triggers: ${(s.tags.triggersIdentified || []).join(", ") || "None"}
Coping: ${(s.tags.copingStrategiesDiscussed || []).join(", ")}
Support: ${s.tags.supportNetworkChanges || "No changes"}
Objectives Addressed: ${(s.tags.objectivesAddressed || []).join(", ")}
Risk Indicators: ${(s.tags.riskIndicators || []).join(", ") || "None"}
Assessment: ${s.dapNote.assessment}
`
    )
    .join("\n---\n");

  const systemPrompt = `You are a clinical outcomes analyst for substance abuse treatment. You produce VISUAL DASHBOARD data — numeric scores, short labels, and trend indicators that can be displayed as progress bars and cards.

RULES:
- All scores are 0-100 integers
- All trends must be one of: improving, stable, declining, mixed
- Keep text extremely short — this is a dashboard, not a report
- Effectiveness ratings: 0-30 = limited, 31-60 = partial, 61-80 = effective, 81-100 = highly effective
- Ground recommendations in evidence-based practices
- Correlation is not causation — frame carefully
- Max 3 recommendations, max 3 interventions, max 3 supervision points

Respond in VALID JSON only. No markdown, no backticks, no preamble.`;

  const userPrompt = `Analyze clinical outcomes for this client and produce dashboard data.

CLIENT: ${clientProfile.name}, ${clientProfile.age}yo
DIAGNOSIS: ${clientProfile.diagnosis}
CO-OCCURRING: ${clientProfile.coOccurring || "None"}
PROGRAM: ${clientProfile.programType} • Day ${clientProfile.programDay}
SESSIONS ANALYZED: ${clientProfile.sessions.length}

OBJECTIVES:
${(clientProfile.treatmentPlan?.objectives || [])
  .map((o) => `- [${o.id || "obj"}] [${o.status}] ${o.description}`)
  .join("\n")}

SESSION HISTORY:
${sessionsContext}

Generate this JSON:
{
  "overallScore": {
    "score": 0-100,
    "label": "One of: Critical | Needs Attention | Progressing | Strong Progress | Excellent",
    "trend": "improving | stable | declining | mixed",
    "summary": "One sentence overall assessment (max 20 words)"
  },
  "domainScores": [
    {
      "domain": "Trigger management",
      "score": 0-100,
      "trend": "improving | stable | declining | mixed",
      "detail": "One sentence (max 15 words)"
    },
    {
      "domain": "Support network",
      "score": 0-100,
      "trend": "improving | stable | declining | mixed",
      "detail": "One sentence (max 15 words)"
    },
    {
      "domain": "Engagement",
      "score": 0-100,
      "trend": "improving | stable | declining | mixed",
      "detail": "One sentence (max 15 words)"
    },
    {
      "domain": "Coping capacity",
      "score": 0-100,
      "trend": "improving | stable | declining | mixed",
      "detail": "One sentence (max 15 words)"
    }
  ],
  "interventions": [
    {
      "name": "Intervention name (max 5 words)",
      "sessionsUsed": 0,
      "effectivenessScore": 0-100,
      "verdict": "effective | partially-effective | limited-response | too-early",
      "recommendation": "One sentence: continue, adjust, or try alternative (max 15 words)"
    }
  ],
  "topRecommendations": [
    {
      "priority": "high | medium",
      "action": "Specific action (max 15 words)",
      "basis": "Clinical basis (max 10 words)"
    }
  ],
  "supervisionPoints": [
    "Short point for supervisor discussion (max 15 words each)"
  ]
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildOutcomesPrompt };
