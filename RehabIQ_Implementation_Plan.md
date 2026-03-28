# RehabIQ — AI-Powered Clinical Intelligence Platform for Rehabilitation Counselors

## The Vision (Beyond the Hackathon)

RehabIQ isn't a summarizer. It's a **clinical intelligence layer** that transforms how rehab counselors work by closing the loop between documentation, insight, and outcomes. Today, counselors document sessions in isolation — each note is a standalone artifact that lives in a filing cabinet (physical or digital) and is rarely looked at again. The result: patterns get missed, treatment plans go stale, and nobody knows if what they're doing is actually working until a client relapses.

RehabIQ creates a **continuous intelligence loop**:

```
Session Happens → Smart Documentation → Pattern Detection → Outcome Tracking → Treatment Adjustment Suggestions → Next Session Prep → Session Happens → ...
```

The key differentiator: **RehabIQ doesn't just record what happened — it connects the dots across time, surfaces what matters, and helps counselors make better clinical decisions faster.**

---

## The Three Pillars

### Pillar 1: Smart Session Documentation (The Foundation)
- Counselor inputs rough session notes (typed or voice-to-text)
- Claude generates structured clinical documentation (DAP/SOAP notes)
- BUT ALSO: auto-tags key clinical themes (triggers, coping strategies used, mood indicators, substances mentioned, social support changes, treatment plan objectives addressed)
- These tags become the structured data layer that powers everything else

### Pillar 2: Caseload Intelligence Dashboard (The Brain)
- Pre-session briefings with context and continuity
- Cross-session pattern detection per client
- Caseload-wide risk prioritization ("Who needs attention today?")
- Treatment plan progress tracking — are objectives actually being met?

### Pillar 3: Clinical Outcome Insights (The Transformation — this is the "beyond" piece)
- **Treatment Effectiveness Tracking**: For each client, RehabIQ tracks whether the interventions being used are correlating with improvement or stagnation. "You've used CBT-based interventions for triggers with this client across 6 sessions — reported trigger incidents have decreased from 4/week to 1/week. This appears to be working." vs. "You've focused on motivational interviewing for 5 sessions but ambivalence scores haven't shifted — consider adjusting approach."
- **Evidence-Based Intervention Suggestions**: When patterns surface a problem (emerging depression, social isolation, treatment plateau), RehabIQ doesn't just flag it — it suggests specific, evidence-based clinical interventions from the research literature, matched to the client's profile. The counselor gets: "Pattern detected: increasing social withdrawal + sleep disturbance over last 3 sessions. Research suggests Behavioral Activation (BA) techniques are effective for emerging depressive symptoms in SUD recovery. Here are 3 specific BA interventions you could introduce." The counselor decides whether to use them.
- **Supervision Prep**: Generates a structured supervision summary — "Here's what happened across your caseload this week, here are the cases you might want to discuss with your supervisor, here's the clinical reasoning." This helps junior counselors learn faster and helps supervisors be more effective.

---

## Why This Is Transformative (The Pitch Story)

**Without RehabIQ:**
A counselor sees 7 clients on Monday. Spends 3 hours that evening writing notes from memory. On Thursday, before seeing Client #4 again, they flip through last week's note for 2 minutes to remember what happened. They don't have time to re-read the last 8 weeks of notes to see the bigger picture. They go with their gut. Sometimes their gut is right. Sometimes a client relapses and in hindsight, the signs were there — scattered across weeks of notes nobody had time to connect.

**With RehabIQ:**
The same counselor finishes each session and spends 3 minutes typing rough notes into RehabIQ. Documentation is done — properly formatted, tagged, and filed. On Thursday morning, they open their dashboard and see: "Before your 2 PM with Marcus — he's on day 62 of treatment. Over the last 3 sessions, he's mentioned work stress with increasing intensity (sessions 7, 8, 9). Session 8 he reported skipping his Tuesday NA meeting. His treatment plan objective around building a support network has stalled — no new contacts added in 4 weeks. Last session you planned to revisit his relapse prevention plan. Suggested focus: Explore whether work stress is becoming a trigger, and consider adding a workplace-specific coping module."

That counselor walks into the room prepared, informed, and effective. Multiply that by 35 clients and 52 weeks and you're talking about fundamentally better care.

**Beyond the hackathon pitch:** This is a real SaaS product for behavioral health organizations. The behavioral health EHR market is fragmented and the existing tools (Kipu, BestNotes, Sunwave) are essentially form-filling software with zero intelligence. RehabIQ could be a standalone product or an integration layer on top of existing EHRs.

---

## Architecture & Tech Stack

### For the Hackathon MVP

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│              React + Vite + Tailwind                 │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Session Doc  │  │  Dashboard   │  │  Client    │ │
│  │    View      │  │   (Caseload) │  │  Timeline  │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                │         │
└─────────┼─────────────────┼────────────────┼─────────┘
          │                 │                │
          ▼                 ▼                ▼
┌─────────────────────────────────────────────────────┐
│                  API LAYER                           │
│           Express.js / Node.js Backend               │
│                                                      │
│  • Session note processing endpoint                  │
│  • Caseload briefing generation endpoint             │
│  • Pattern analysis endpoint                         │
│  • Intervention suggestion endpoint                  │
│                                                      │
└───────────────────┬─────────────────────────────────┘
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
   ┌──────────┐ ┌────────┐ ┌────────────┐
   │ Claude   │ │ In-    │ │ Mock       │
   │ API      │ │ Memory │ │ Clinical   │
   │ (Sonnet) │ │ Store  │ │ Data       │
   └──────────┘ └────────┘ └────────────┘
```

**Frontend**: React + Vite + Tailwind CSS (Naishal's comfort zone)
**Backend**: Node.js / Express (lightweight, fast to build)
**AI**: Claude API (Sonnet for speed during demo, system prompts are the secret sauce)
**Data**: In-memory store with pre-loaded mock client data (no DB needed for hackathon)
**Deployment**: Vercel (frontend) + can run backend locally for demo, or deploy to Render/Railway

### For Production (Beyond Hackathon — mention in pitch)
- PostgreSQL for persistent storage
- HIPAA-compliant infrastructure (AWS GovCloud or similar)
- EHR integration layer (HL7 FHIR APIs)
- Role-based access control
- Audit logging for compliance
- End-to-end encryption for session data

---

## Mock Data Design

Create 5-6 realistic mock clients with 4-8 sessions each. This gives enough data for pattern detection to be meaningful.

### Mock Client Profiles

**Client 1: Marcus J. (The "Signs Were There" Case)**
- Age 34, Alcohol Use Disorder, 62 days in outpatient program
- Co-occurring: Mild depression (undiagnosed)
- Pattern to surface: Increasing work stress mentions, declining meeting attendance, sleep issues emerging
- Story arc: Slowly deteriorating — RehabIQ catches what a busy counselor might miss

**Client 2: Sarah M. (The "Treatment Is Working" Case)**
- Age 28, Opioid Use Disorder, 90 days, on MAT (Suboxone)
- Pattern to surface: Steady improvement — trigger incidents decreasing, support network growing
- Story arc: Positive trajectory — RehabIQ confirms the current approach is effective

**Client 3: David R. (The "Treatment Plateau" Case)**
- Age 45, Cocaine Use Disorder, 120 days
- Pattern to surface: Initial rapid improvement, then flatline for 4 weeks
- Story arc: Current interventions worked initially but have stalled — time to adjust

**Client 4: Aisha T. (The "Complex Case" — for demo depth)**
- Age 22, Polysubstance (alcohol + cannabis), 30 days
- Co-occurring: PTSD, housing instability
- Pattern to surface: PTSD symptoms intensifying as sobriety continues (common), avoidance behaviors
- Story arc: Needs trauma-informed care adjustment

**Client 5: James K. (The "Quiet Success")**
- Age 55, Alcohol Use Disorder, 180 days
- Pattern to surface: Consistent, quiet progress — easy to overlook in a busy caseload
- Story arc: RehabIQ confirms he's doing well, suggest transitioning to less intensive care

---

## System Prompt Architecture

### Prompt 1: Session Documentation Engine

```
Role: You are a clinical documentation assistant for substance abuse 
rehabilitation counselors. You transform rough session notes into 
structured clinical documentation.

Input: Unstructured counselor notes from a therapy session.

Output: Generate ALL of the following:

1. DAP NOTE (Data, Assessment, Plan)
   - Data: Observable facts, client statements, behaviors noted
   - Assessment: Clinical interpretation of the data
   - Plan: Next steps, homework, follow-up items

2. CLINICAL TAGS (structured metadata — return as JSON):
   - mood_indicators: [list]
   - substances_mentioned: [list]
   - triggers_identified: [list]
   - coping_strategies_discussed: [list]
   - support_network_changes: [any changes noted]
   - treatment_plan_objectives_addressed: [which objectives from the 
     treatment plan were worked on]
   - risk_indicators: [any concerning signals — suicidal ideation, 
     relapse indicators, safety concerns]
   - session_sentiment: [overall trajectory — improving / stable / 
     declining / concerning]
   - key_quotes: [significant client statements, anonymized]

3. FOLLOW-UP FLAGS:
   - Items the counselor should revisit next session
   - Any escalation needs (supervisor consultation, crisis protocol, 
     medication review)

Rules:
- Use professional clinical language appropriate for medical records
- Never diagnose — only note observations and patterns
- Flag any safety concerns prominently
- If information is ambiguous, note it as "counselor to clarify" 
  rather than assuming
- Maintain the counselor's clinical voice — this should read as if 
  they wrote it, not an AI
```

### Prompt 2: Pre-Session Briefing Generator

```
Role: You are a clinical intelligence assistant preparing a counselor 
for their next session with a client.

Input: 
- Client profile (demographics, diagnosis, treatment plan, program day)
- All previous session documentation and clinical tags
- Current treatment plan objectives and status

Output: Generate a concise pre-session briefing:

1. CLIENT SNAPSHOT (2-3 sentences)
   - Where they are in their program, key context

2. RECENT TRAJECTORY (3-4 sentences)  
   - What's been happening across the last 3-5 sessions
   - Mood/engagement trend
   - Any concerning or encouraging patterns

3. PATTERN ALERTS (if any)
   - Cross-session patterns the counselor should be aware of
   - Connect dots across time that individual session notes might not 
     reveal
   - Be specific: cite which sessions, what was said, what the pattern 
     suggests

4. TREATMENT PLAN PROGRESS
   - Which objectives are being actively worked on
   - Which are progressing vs. stalled vs. not yet addressed

5. SUGGESTED SESSION FOCUS (2-3 bullet points)
   - Based on patterns, treatment plan status, and clinical best 
     practices
   - Frame as suggestions, never directives
   - Include specific evidence-based techniques when relevant

Rules:
- Be concise — counselors read this in 2-3 minutes before a session
- Always frame suggestions as "Consider..." or "You might explore..."
- Never tell the counselor what to do — surface information and 
  options
- If data is insufficient for a pattern, say so rather than 
  speculating
```

### Prompt 3: Outcome & Intervention Effectiveness Analyzer

```
Role: You are a clinical outcomes analyst for substance abuse 
treatment. You analyze the relationship between interventions used 
and client progress indicators.

Input:
- Complete session history with clinical tags for one client
- Treatment plan with objectives
- Interventions/techniques used per session (from tags)

Output:

1. INTERVENTION EFFECTIVENESS SUMMARY
   - For each intervention/technique used across sessions, assess:
     - How many sessions it's been used
     - What progress indicators suggest about its effectiveness
     - Whether the data supports continuing, adjusting, or 
       reconsidering

2. OUTCOME TRENDS (with supporting evidence from session data)
   - Trigger frequency: increasing / stable / decreasing
   - Support network strength: growing / stable / shrinking
   - Engagement level: improving / stable / declining
   - Coping strategy utilization: expanding / stable / narrowing

3. EVIDENCE-BASED RECOMMENDATIONS
   - If an intervention appears stalled, suggest alternatives grounded 
     in clinical research
   - If a pattern suggests an emerging co-occurring issue, recommend 
     appropriate screening or intervention
   - Always cite the clinical basis (e.g., "CBT-based approaches for 
     trigger management" or "Behavioral Activation for emerging 
     depressive symptoms in SUD recovery")

4. SUPERVISION TALKING POINTS
   - 2-3 items this counselor might want to discuss with their 
     clinical supervisor
   - Frame as professional development opportunities, not criticisms

Rules:
- Correlation is not causation — frame findings carefully
- Never claim an intervention "failed" — frame as "data suggests 
  limited response, consider alternatives"
- Ground all recommendations in established evidence-based practices 
  for SUD treatment
- Acknowledge limitations of the data
```

---

## Implementation Plan (36 Hours)

### Team Role Assignments (4 People)

| Role | Person | Responsibilities |
|------|--------|-----------------|
| **Frontend Lead** | Person A (Naishal?) | React app, all UI views, Tailwind styling, data flow |
| **AI/Prompt Engineer** | Person B | System prompts, Claude API integration, response parsing, mock data |
| **Backend + Data** | Person C | Express server, API endpoints, in-memory data store, mock client data |
| **Product + Pitch** | Person D | Demo script, presentation, ethical framework doc, video |

### Hour-by-Hour Build Plan

#### Friday Night (6 PM – 12 AM) — FOUNDATION [6 hrs]

**All Team (6:00 – 7:00 PM)** — Opening ceremony + case reveal + team align
- Confirm track choice (Track 2: Neuroscience & Mental Health)
- Align on product scope and assign roles
- Set up shared GitHub repo, Discord/Slack channel

**Hour 1-2 (7:00 – 9:00 PM)** — Parallel kickoff
- **Frontend Lead**: Scaffold Vite + React + Tailwind project. Set up routing (3 views: Session Doc, Dashboard, Client Timeline). Build the Session Documentation input form UI.
- **AI/Prompt Engineer**: Write and test Prompt 1 (Session Documentation) in Claude console. Iterate until output quality is high. Define the JSON schema for clinical tags.
- **Backend + Data**: Set up Express server with CORS. Create the mock client data (all 5 clients, their profiles, 4-8 sessions each as seed data). Define API endpoint contracts.
- **Product + Pitch**: Draft the 3 required answers (who, what could go wrong, how it helps). Start writing the demo script. Research existing rehab documentation workflows for authenticity.

**Hour 3-4 (9:00 – 11:00 PM)** — First integration
- **Frontend Lead**: Build the Session Documentation output view (DAP note display, clinical tags display, follow-up flags). Style it to look clinical and professional.
- **AI/Prompt Engineer**: Integrate Prompt 1 with Express endpoint. Test end-to-end: raw input → Claude → structured response → parsed JSON.
- **Backend + Data**: Build `/api/document-session` endpoint. Build `/api/clients` and `/api/clients/:id/sessions` endpoints serving mock data.
- **Product + Pitch**: Create the ethical framework document. Define guardrails and limitations.

**Hour 5-6 (11:00 PM – 12:00 AM)** — Milestone 1 checkpoint
- **Goal**: Session Documentation flow works end-to-end (type notes → get DAP note + tags)
- Review together, identify bugs, align on Saturday priorities
- Everyone commits their work and goes home

#### Saturday (All Day Async) — CORE BUILD [10-12 hrs]

**Morning Block (9:00 AM – 1:00 PM)**

- **Frontend Lead**: Build the Caseload Dashboard view — card-based layout showing all clients with risk indicators, next session date, trajectory arrows. Build the pre-session briefing modal/panel.
- **AI/Prompt Engineer**: Write and test Prompt 2 (Pre-Session Briefing). Write and test Prompt 3 (Outcome Analysis). Ensure all prompts handle edge cases (new client with only 1 session, client doing well, etc.)
- **Backend + Data**: Build `/api/briefing/:clientId` endpoint. Build `/api/outcomes/:clientId` endpoint. Ensure mock session data has enough tagged sessions for pattern detection to work.
- **Product + Pitch**: Finalize demo scenarios (which clients tell the best story). Start drafting presentation slides.

**Afternoon Block (1:00 PM – 6:00 PM)**

- **Frontend Lead**: Build the Client Timeline view — vertical timeline showing sessions, with expandable notes, tags, and pattern highlights. Build the Outcome Insights panel (intervention effectiveness, trend charts).
- **AI/Prompt Engineer**: Fine-tune all prompts based on mock data results. Add the evidence-based intervention suggestion logic to Prompt 3. Handle error states and loading states.
- **Backend + Data**: Build any remaining endpoints. Add error handling. Create a "demo mode" flag that pre-loads the perfect dataset.
- **Product + Pitch**: Record rough video walkthrough. Identify gaps in the story. Draft the "beyond hackathon" slide.

**Evening Block (6:00 PM – 10:00 PM)**

- **Frontend Lead**: Polish UI — transitions, loading states, responsive layout, color scheme (clinical but not cold — think calm blues/greens). Add micro-interactions.
- **AI/Prompt Engineer**: Integration testing — run every demo scenario end-to-end. Fix any prompt issues.
- **Backend + Data**: Performance testing. Ensure Claude API calls return in reasonable time for demo. Add caching if needed.
- **Product + Pitch**: Refine demo script. Practice the narrative flow.

**Saturday Night Milestone**: All 3 pillars functional. Full demo flow works.

#### Sunday (Until 6 PM) — POLISH & PITCH [8 hrs]

**Morning (9:00 AM – 12:00 PM)**
- Bug fixes and edge case handling
- UI polish pass — fonts, spacing, colors, empty states
- Add any "wow factor" details (subtle animations, smart defaults)
- Full team run-through of the demo

**Afternoon (12:00 PM – 4:00 PM)**
- Record the video demo (clean, scripted, focused)
- Finalize presentation
- Practice Q&A — anticipate judge questions about ethics, accuracy, scalability
- Deploy frontend to Vercel for a live URL

**Final (4:00 PM – 6:00 PM)**
- Submit everything
- Final practice run
- Closing ceremony

---

## Live Demo Script (5 Minutes)

### Opening (30 seconds)
"Meet Dr. Rivera. She's a substance abuse counselor with 35 clients. She's great at her job — but she's drowning. She spends 3 hours a day on documentation, she can't remember what happened in session 7 with Marcus when she's prepping for session 10, and she has no systematic way to know if her treatment approaches are actually working. RehabIQ changes that."

### Demo Beat 1: Session Documentation (90 seconds)
- Show the Session Doc view — clean input area
- Type/paste rough session notes for Marcus (the "signs were there" case):
  > "Marcus came in agitated. Said boss gave him a written warning on Friday. Couldn't sleep all weekend. Admitted he thought about stopping by the bar but called his sponsor instead. Talked about his triggers list — work stress is #1 now. We did some CBT work on cognitive distortions around the work situation. He said he's thinking about skipping his Thursday NA meeting because he's tired. I pushed back on that."
- Hit "Document" → Show the generated DAP note, clinical tags, follow-up flags
- **Key moment**: Point out the risk flag: "Client expressed intent to skip NA meeting — monitor support network engagement"
- "What took 25 minutes now takes 3 — and it's more thorough."

### Demo Beat 2: Caseload Dashboard (90 seconds)
- Switch to Dashboard view — show all 5 clients in a prioritized view
- Marcus is flagged yellow/orange — "needs attention"
- Sarah is green — "on track"
- David is yellow — "treatment plateau detected"
- Click into Marcus's pre-session briefing
- Show the AI-generated briefing: pattern detection across sessions (work stress escalating, NA attendance declining, sleep disturbance emerging)
- **Key moment**: "Dr. Rivera hasn't re-read Marcus's last 8 session notes. She doesn't need to. RehabIQ connected the dots: work stress was mentioned in sessions 6, 7, 8, and 9 with increasing intensity. Combined with declining meeting attendance, this is a known relapse risk pattern."

### Demo Beat 3: Clinical Outcome Insights (90 seconds)
- Click into Marcus's Client Timeline — show the progression visually
- Open Outcome Insights panel
- Show intervention effectiveness: "CBT for trigger management has been used in 5 sessions — trigger frequency has decreased for environmental triggers but work-related triggers have intensified"
- Show the evidence-based suggestion: "Pattern consistent with occupational stress as emerging primary trigger. Consider adding Functional Analysis focused on workplace situations, or exploring SMART Recovery workplace module."
- **Key moment**: "RehabIQ isn't telling Dr. Rivera what to do. It's telling her what the data says and what the research suggests. She makes the call."

### Closing (30 seconds)
- "RehabIQ gives counselors back their time, their memory, and their ability to see the big picture. It doesn't replace clinical judgment — it supercharges it. In a field where one counselor's insight can be the difference between recovery and relapse, that matters."
- Briefly mention: HIPAA considerations, counselor-in-the-loop design, scalability to behavioral health organizations

---

## Ethical Framework (Judges Will Ask)

### Who benefits?
- Primary: Counselors — time savings, better clinical decisions, reduced burnout
- Secondary: Clients — more individualized care, patterns caught earlier, evidence-based treatment adjustments
- Tertiary: Rehab organizations — better outcomes, documentation compliance, training tool for junior counselors

### Who could be harmed? What could go wrong?
| Risk | Mitigation |
|------|-----------|
| AI generates inaccurate clinical documentation | Counselor MUST review and approve every note before it's finalized. Prominent "Draft — Counselor Review Required" watermark. |
| Over-reliance — counselor stops thinking critically | Suggestions framed as "Consider..." never as directives. System explicitly says "This is pattern-based, not diagnostic." |
| Privacy — session content is deeply sensitive | In production: HIPAA-compliant infrastructure, encryption at rest and in transit, no data used for model training. For hackathon: acknowledge this as a critical production requirement. |
| Bias — AI suggestions may reflect biases in training data | Evidence-based interventions grounded in published clinical research. Cultural competency guidelines in system prompts. Flag when data is insufficient rather than guessing. |
| Client doesn't know AI is involved in their care | Transparency requirement: clients should be informed that AI assists with documentation and clinical analysis. Informed consent process. |
| Algorithmic "labeling" — client gets flagged as high-risk unfairly | Risk indicators are based on observable behavioral patterns, not predictions about the person. Counselor interprets all flags. No automated actions. |

### How does this help people rather than make decisions for them?
- Every output is a DRAFT or SUGGESTION — never a final document or directive
- The counselor reviews, edits, and approves all documentation
- Clinical suggestions include the reasoning and evidence basis so the counselor can evaluate them
- The system explicitly defers to clinical judgment in all framing
- No direct client interaction — the AI never speaks to or about a client directly

---

## Color Scheme & UI Direction

**Aesthetic**: Clinical trust meets modern warmth — not a cold hospital UI, not a playful consumer app. Think: "the best-designed healthcare software you've seen."

**Colors**:
- Primary: Deep teal (#0D7377) — trustworthy, calm, clinical
- Secondary: Warm slate (#374151) — grounding, readable
- Accent: Amber (#F59E0B) — for alerts and attention items
- Success: Sage green (#059669) — for positive trajectories
- Warning: Warm orange (#D97706) — for flags and concerns  
- Danger: Rose (#E11D48) — for urgent escalations only
- Background: Warm off-white (#F9FAFB) with subtle warm undertone
- Cards: White with soft shadow, slight border radius

**Typography**: 
- Headlines: Something with character but still professional (DM Sans, Outfit, or similar)
- Body: Clean and readable (Inter for body is fine in a clinical context — readability > novelty here)
- Monospace for clinical tags/metadata

**Key UI Principles**:
- Information density done right — counselors need to see a lot at once, but it shouldn't feel cluttered
- Clear visual hierarchy — what needs attention NOW is obvious
- Subtle status colors (green/amber/red) that are meaningful, not decorative
- Smooth transitions between views — feels modern and responsive
- Dark mode option (counselors working late evenings)

---

## File Structure (for the hackathon)

```
rehabiq/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/         # Sidebar, header, navigation
│   │   │   ├── SessionDoc/     # Session documentation view
│   │   │   │   ├── NoteInput.jsx
│   │   │   │   ├── DAPNoteDisplay.jsx
│   │   │   │   ├── ClinicalTags.jsx
│   │   │   │   └── FollowUpFlags.jsx
│   │   │   ├── Dashboard/      # Caseload dashboard
│   │   │   │   ├── ClientCard.jsx
│   │   │   │   ├── RiskOverview.jsx
│   │   │   │   ├── PreSessionBriefing.jsx
│   │   │   │   └── CaseloadStats.jsx
│   │   │   ├── ClientView/     # Individual client deep dive
│   │   │   │   ├── SessionTimeline.jsx
│   │   │   │   ├── OutcomeInsights.jsx
│   │   │   │   ├── InterventionTracker.jsx
│   │   │   │   └── TreatmentPlanProgress.jsx
│   │   │   └── Shared/         # Reusable components
│   │   │       ├── StatusBadge.jsx
│   │   │       ├── TrendIndicator.jsx
│   │   │       └── LoadingState.jsx
│   │   ├── data/
│   │   │   └── mockClients.js  # All mock client + session data
│   │   ├── services/
│   │   │   └── api.js          # API call functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Backend
│   ├── routes/
│   │   ├── sessions.js         # Session documentation endpoints
│   │   ├── clients.js          # Client data endpoints
│   │   ├── briefings.js        # Pre-session briefing endpoints
│   │   └── outcomes.js         # Outcome analysis endpoints
│   ├── prompts/
│   │   ├── documentSession.js  # Prompt 1
│   │   ├── generateBriefing.js # Prompt 2
│   │   └── analyzeOutcomes.js  # Prompt 3
│   ├── data/
│   │   └── mockData.js         # Seed data
│   ├── server.js
│   └── package.json
└── README.md
```

---

## What Makes This a "Beyond Hackathon" Product

When pitching scalability, mention:
1. **Market size**: ~16,000 substance abuse treatment facilities in the US alone
2. **Revenue model**: SaaS per-counselor-seat pricing ($50-100/month/counselor)
3. **Expansion**: Same architecture works for any counseling context — not just rehab (therapy practices, social work, school counseling)
4. **Integration**: FHIR-based API can plug into existing EHR systems (Kipu, BestNotes, etc.)
5. **Data moat**: With enough anonymized, aggregated data, the pattern detection and intervention suggestions get better over time
6. **Regulatory path**: FDA doesn't currently regulate clinical documentation tools — this is a software tool for clinicians, not a medical device (but monitor regulatory landscape)

---

## Backup Plan

If Claude API is slow or flaky during the demo:
- Pre-generate responses for ALL demo scenarios and cache them
- Build a "demo mode" toggle that uses cached responses instead of live API calls
- Still show the live API for one scenario to prove it works
- Have the cached version as seamless fallback

---

## Team Prep Before Friday 6 PM

- [ ] Everyone installs Node.js, npm, Vite, and has Claude API access
- [ ] Set up GitHub repo with basic project structure
- [ ] Person B: Start testing system prompts in Claude console NOW
- [ ] Person D: Research real DAP note formats, real treatment plan structures
- [ ] Everyone: Read about evidence-based practices in SUD treatment (CBT, DBT, MI, SMART Recovery, 12-step facilitation)
- [ ] Agree on communication channel and check-in schedule for Saturday
