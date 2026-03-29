# 🧪 RehabIQ — Judge's Demo Guide

This guide walks you through the key features of RehabIQ using the live deployed app. No setup required — just open the URL and follow the steps.

---

## 🚀 Logging In

1. Open the deployed app URL
2. Use the hackathon demo credentials:
   - **Email:** `demo@rehabiq.com`
   - **Password:** `demo123`
3. You'll land on the **Dashboard** with 7 pre-loaded clients

---

## 🗂️ The Dashboard — What You'll See

The dashboard shows your full active caseload sorted by risk level:

| Client | Diagnosis | Program | Risk | Sessions |
|---|---|---|---|---|
| **Aisha Torres** | Polysubstance Use Disorder (Alcohol, Cannabis) | IOP | 🔴 High | 5 |
| **Michael Chen** | Methamphetamine Use Disorder (Severe) | Residential | 🔴 High | 2 |
| **David Reeves** | Cocaine Use Disorder (Severe) | Outpatient | 🟡 Moderate | 4 |
| **Marcus Johnson** | Alcohol Use Disorder (Moderate) | IOP | 🟡 Moderate | 8 |
| **james kim** | Alcohol Use Disorder (Mild) | Outpatient | 🟢 Low | 4 |
| **Sarah Mitchell** | Opioid Use Disorder (Severe) | Outpatient | 🟢 Low | 5 |

At the top you'll see live stats: **7 total clients · 2 high risk · 5 in treatment · 4 avg sessions/client**

---

## 📋 Step 1 — Document a New Session (AI Feature #1)

> **What this demonstrates:** Paste rough counselor notes → Claude generates a full structured DAP note, clinical mood tags, risk indicators, and follow-up flags in seconds.

### Option A: Document for Aisha Torres _(High Risk — great for showing AI safety flagging)_

1. On the Dashboard, click **"Document"** next to **Aisha Torres**
2. Paste the following notes into the session notes field:

```
Aisha came in today looking more settled than last week. She's at 47 days sober — 
she seems proud of it but downplays it when I point it out. She mentioned her new 
friend from the housing fair, Keisha — they've been texting and walked around the 
neighborhood together twice this week. I want to check on Keisha's background more 
carefully — Aisha mentioned offhand that Keisha "used to party a lot." 

She found a room to rent in a shared house — move-in is in 12 days. She's nervous 
about being around strangers. PTSD symptoms: she had one nightmare this week (down 
from 4-5 last month), and one dissociative episode on the bus that she managed by 
grounding herself using the technique we practiced. She seemed genuinely proud when 
she told me that.

She brought up her ex-boyfriend briefly — says she doesn't think about him as much, 
but still crosses the street to avoid walking past his block. Mood overall: more 
stable. Affect brighter than last session. No SI. She asked about aftercare options 
for when IOP ends.
```

3. Click **"Document with AI"** — wait ~10 seconds
4. Claude will return:
   - **DAP Note** — Data, Assessment, Plan in clinical format
   - **Tags** — mood, triggers, coping strategies, key quotes, session sentiment
   - **Follow-up Flags** — including a flag about Keisha's recovery background

---

### Option B: Document for Marcus Johnson _(Moderate Risk — shows grief/relapse prevention work)_

1. Click **"Document"** next to **Marcus Johnson**
2. Paste these notes:

```
Marcus came in looking tired — said he had a bad week emotionally. The divorce was 
finalized on Tuesday. He knew it was coming but seeing it on paper hit him differently. 
He cried in session for the first time. He said he doesn't blame her, just blames 
himself — keeps calling himself a "failure as a husband." I gently challenged that 
framing.

No relapse. He called his sponsor David before and after the divorce papers arrived. 
He went to 2 support group meetings this week (down from 3 — his goal). He said he 
stayed home one night because he didn't want to talk to anyone. We worked on the 
difference between healthy solitude and isolation.

Job search is ongoing — he had a phone screen for a logistics coordinator role. Outcome 
pending. He said "at least I have something to look forward to." That felt significant.

No SI. He mentioned he keeps a photo of his kids on his phone lock screen now as a 
reminder. PHQ-9 today: 9 (mild depression — up from 6 last session, attributable to 
divorce finalization).
```

3. Click **"Document with AI"**

---

## 🔍 Step 2 — View an AI Briefing (AI Feature #2)

> **What this demonstrates:** Before walking into a session, a counselor gets an instant AI-generated brief — risk score, trajectory, pattern alerts, and suggested session focus based on the full session history.

1. Click on **Aisha Torres** → her Client Profile opens
2. The **Briefing** tab is active by default — you'll see:
   - **Quick Glance** — one-liner summary, risk score (Moderate), trajectory (↑ Improving), top priority
   - **Key Flags** — including the suicidal crisis from a previous session, new social connection risk, housing search status
   - **Last Session Highlight** — "Reconnected with college friend, attending housing fairs, 40 days sober"
3. Click **"Full Briefing"** to see:
   - Pattern alerts with session-number citations
   - Treatment plan progress per objective
   - Strengths to reinforce
   - Specific "Consider..." session focus suggestions

> 💡 Try the same for **Marcus Johnson** — you'll see how the briefing captures his divorce grief trajectory across 8 sessions.

---

## 📊 Step 3 — View Outcome Analysis (AI Feature #3)

> **What this demonstrates:** Multi-session trend analysis across 4 clinical domains, with prioritized evidence-based recommendations and supervision talking points.

1. Open **Aisha Torres** or **Marcus Johnson**
2. Click the **"Outcomes"** tab
3. Claude analyzes the full session history and returns:
   - **Intervention Effectiveness** — which techniques are working, with session evidence
   - **Outcome Trends** — scored across trigger management, support network, coping capacity, engagement
   - **Evidence-Based Recommendations** — prioritized by clinical urgency
   - **Supervision Talking Points** — ready-to-use bullet points for case consultation

---

## 👤 Step 4 — Add a Brand New Client

> **What this demonstrates:** The intake form captures a complete clinical profile with treatment objectives that immediately feeds into all AI features.

1. Click **"Add Client"** on the Dashboard (or the sidebar icon)
2. Fill in the form with the following sample data:

### Basic Information

| Field | Value |
|---|---|
| **Full Name** | `Jordan Hayes` |
| **Age** | `31` |
| **Gender** | `Male` |
| **Primary Diagnosis** | `Opioid Use Disorder (Moderate)` |
| **Co-Occurring Conditions** | `Generalized Anxiety Disorder` |

### Program Details

| Field | Value |
|---|---|
| **Program Type** | `Outpatient` |
| **Initial Risk Level** | `Moderate` _(click the Moderate button)_ |
| **MAT Medication** | `Suboxone 8mg/day` |
| **Insurance** | `Medicaid` |
| **Emergency Contact** | `Dana Hayes (Sister) — (614) 555-0174` |

### Treatment Plan Objectives

Click **"+ Add objective"** after each one:

| # | Objective |
|---|---|
| 1 | `Maintain MAT adherence and attend all clinic appointments` |
| 2 | `Identify and develop coping responses for 3 key anxiety-related relapse triggers` |
| 3 | `Re-establish employment or structured daily activity within 60 days` |

3. Click **"Create client"** — Jordan will appear on the Dashboard immediately

---

## ✅ End-to-End Demo Checklist

- [ ] Log in with `demo@rehabiq.com` / `demo123`
- [ ] View the Dashboard — 7 clients sorted by risk level with live stats
- [ ] Document a session for **Aisha Torres** using the sample notes above
- [ ] View AI Briefing for **Aisha Torres** — Quick Glance + Full Briefing
- [ ] View Outcome Analysis for **Marcus Johnson** (8 sessions = rich analysis)
- [ ] Add **Jordan Hayes** as a new client
- [ ] Toggle dark mode (top-right header)
- [ ] Use the search bar to filter clients by name

---

## 💡 Key Things to Point Out to Judges

| Feature | What to highlight |
|---|---|
| **Session Documentation** | AI flags safety concerns automatically (e.g. "PRIORITY:" prefix on urgent follow-ups) |
| **Briefing — Quick Glance** | Designed for a 30-second scan before walking into a session |
| **Briefing — Full Briefing** | Cites specific session numbers as evidence for every clinical claim |
| **Outcome Analysis** | Surfaces patterns a counselor might miss across 5–8 sessions of notes |
| **Caching** | Briefings and outcomes are cached per client — instant reload until a new session is added |
| **Risk sorting** | Dashboard auto-sorts by risk level so highest-need clients are always at the top |

---

> Built with React + Node.js + Claude Sonnet · Deployed on Vercel + Render
