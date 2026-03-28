// =============================================================
// Prompt 1: Session Documentation Engine
// Transforms rough counselor notes into structured DAP notes
// with clinical tags and follow-up flags
// =============================================================

function buildDocumentationPrompt(clientProfile, rawNotes, sessionNumber) {
  const systemPrompt = `You are a clinical documentation assistant for substance abuse rehabilitation counselors. Your job is to transform rough, informal session notes into properly structured clinical documentation.

You write in a professional clinical voice appropriate for medical records. You are thorough but concise. You NEVER diagnose — you only note observations and patterns. You flag safety concerns prominently.

IMPORTANT RULES:
- Use the counselor's perspective (third person references to client)
- If information is ambiguous, note it as "counselor to clarify" rather than assuming
- Flag ANY safety concerns (SI/HI, relapse risk, safety) in the follow-up flags with "PRIORITY:" or "URGENT:" prefix
- Clinical tags must be specific and actionable, not vague
- The DAP note should read as if the counselor wrote it themselves — professional but human
- Keep the Assessment section focused on clinical interpretation, not just restating the Data
- The Plan should contain specific, numbered action items

You must respond in VALID JSON only. No markdown, no backticks, no preamble. Just the JSON object.`;

  const userPrompt = `Here is the client profile and the counselor's rough session notes. Generate structured clinical documentation.

CLIENT PROFILE:
- Name: ${clientProfile.name}
- Age: ${clientProfile.age}
- Diagnosis: ${clientProfile.diagnosis}
- Co-occurring: ${clientProfile.coOccurring || "None documented"}
- Program: ${clientProfile.programType}
- Program Day: ${clientProfile.programDay}
- MAT: ${clientProfile.mat || "None"}
- Session Number: ${sessionNumber}

CURRENT TREATMENT PLAN OBJECTIVES:
${clientProfile.treatmentPlan.objectives
  .map((o) => `- [${o.status}] ${o.description}`)
  .join("\n")}

COUNSELOR'S RAW SESSION NOTES:
"""
${rawNotes}
"""

Generate the following JSON structure:
{
  "dapNote": {
    "data": "Observable facts, client statements, behaviors noted. 3-5 sentences.",
    "assessment": "Clinical interpretation of the data. What does this mean clinically? 3-5 sentences.",
    "plan": "Numbered next steps, homework, follow-up items. 4-6 items."
  },
  "tags": {
    "moodIndicators": ["list of observed mood/affect descriptors"],
    "substancesMentioned": ["any substances discussed, with context"],
    "triggersIdentified": ["specific triggers mentioned or identified"],
    "copingStrategiesDiscussed": ["strategies discussed or used, with effectiveness if noted"],
    "supportNetworkChanges": "one sentence describing any changes in support system",
    "objectivesAddressed": ["list of objective IDs from the treatment plan that were addressed, e.g. obj-1, obj-2"],
    "riskIndicators": ["any concerning signals — be specific. Empty array if none."],
    "sessionSentiment": "one of: improving, stable, declining, concerning, mixed, cautiously-improving",
    "keyQuotes": ["1-3 significant client statements, verbatim if possible"]
  },
  "followUpFlags": ["specific items for counselor to address. Prefix urgent items with PRIORITY: or URGENT:"]
}`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildDocumentationPrompt };
