// =============================================================
// Seed the database with realistic clinical demo data
// Runs automatically on first start when DB is empty
// =============================================================

const { getDb, isSeeded } = require("./database");

// ─────────────────────────────────────────────────────────────
// SEED DATA — 4 clients, varied substance use scenarios
// ─────────────────────────────────────────────────────────────
const SEED_CLIENTS = [
  // ── Client 1: Marcus Johnson ─────────────────────────────
  {
    id: "client-001",
    name: "Marcus Johnson",
    age: 34,
    gender: "Male",
    diagnosis: "Alcohol Use Disorder (Severe)",
    coOccurring: "Adjustment Disorder with Depressed Mood",
    programType: "Intensive Outpatient (IOP)",
    admissionDate: "2026-01-25",
    programDay: 62,
    mat: null,
    insurance: "Blue Cross Blue Shield",
    emergencyContact: "Linda Johnson (Mother) — (812) 555-0147",
    riskLevel: "moderate",
    treatmentPlan: {
      objectives: [
        { id: "obj-1", description: "Identify and manage top 3 personal triggers without using alcohol", status: "in-progress", targetDate: "2026-04-15" },
        { id: "obj-2", description: "Attend AA meetings at least 3x/week and reconnect with sponsor", status: "on-track", targetDate: "2026-05-01" },
        { id: "obj-3", description: "Develop a relapse prevention plan addressing work-related stress", status: "at-risk", targetDate: "2026-04-01" },
      ],
    },
    sessions: [
      {
        id: "sess-001-1",
        sessionNumber: 1,
        date: "2026-01-27",
        rawNotes: "First IOP session. Marcus came in guarded but engaged. Works in logistics management. Recent DUI is the reason he's here — wife threatened to leave if he didn't get help. Lost his driver's license. Says drinking started as social but became nightly over the past 3 years. Last drink was January 24th. Shaky hands during session, reports mild withdrawal symptoms. Has a sponsor from 8 years ago he hasn't called in years. Motivated mainly by fear of losing marriage.",
        dapNote: {
          data: "Client presented for initial IOP intake session. Reports 3-year history of escalating alcohol use, progressing from social drinking to nightly consumption. Last drink January 24th, currently experiencing mild withdrawal (hand tremors, sleep disruption). Primary precipitating event: DUI charge resulting in license suspension and marital ultimatum. Employment intact as logistics manager. No prior treatment history.",
          assessment: "Client presents with Severe AUD with mild to moderate withdrawal symptoms. Motivation appears primarily external (marriage preservation, legal consequences) rather than intrinsic. Ambivalence regarding full sobriety noted — minimizes impact of use. Co-occurring depressive symptoms likely secondary to AUD and marital stress. Sponsor relationship lapsed; social support network limited. DUI legal consequences may serve as protective motivator in early recovery.",
          plan: "1. Medical clearance obtained; monitor for CIWA escalation over next 72 hours. 2. Complete biopsychosocial assessment by session 3. 3. Assign daily self-monitoring journal for mood and cravings. 4. Provide AA meeting schedule; encourage client to text former sponsor this week. 5. Schedule spouse for collateral session within 2 weeks. 6. Return for IOP group tomorrow; individual session scheduled for Thursday.",
        },
        tags: {
          moodIndicators: ["guarded", "anxious", "cooperative", "tremulous"],
          substancesMentioned: ["alcohol — beer", "alcohol — spirits"],
          triggersIdentified: ["marital conflict", "work stress", "social isolation"],
          copingStrategiesDiscussed: ["AA meetings", "sponsor contact"],
          supportNetworkChanges: "Sponsor contact lapsed. Wife currently supportive but ultimatum given. Limited peer support.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["mild withdrawal symptoms", "external-only motivation"],
          sessionSentiment: "stable",
          keyQuotes: ["I'm here because I have to be, not because I want to be.", "I didn't think three beers a night was a problem until it wasn't three anymore."],
        },
        followUpFlags: [
          "Monitor CIWA symptoms — contact client Wednesday to assess withdrawal progression",
          "Encourage sponsor text this week — explore barriers to reconnection next session",
          "Coordinate collateral session with spouse within 14 days",
        ],
      },
      {
        id: "sess-001-2",
        sessionNumber: 2,
        date: "2026-02-03",
        rawNotes: "Marcus is a week clean. Withdrawal resolved. He came in more open today. He texted his sponsor — they had a 20-minute call. His wife joined him for a dinner without drinking this weekend and it went well. Work is still stressful — boss gave him a look about being late last week (he had a court date). AA meeting twice last week, didn't speak but attended. Still unsure if he 'belongs' in AA. We worked on trigger mapping — biggest ones are coming home to an empty house and conflict with wife.",
        dapNote: {
          data: "Client reports 10 days of continuous sobriety. Withdrawal symptoms fully resolved. Re-established contact with AA sponsor — initial call lasted approximately 20 minutes. AA attendance: 2 meetings in past week. Positive marital interaction noted: shared dinner without alcohol. Work-related stress ongoing; tardiness incident tied to court appearance. Completed initial trigger mapping exercise.",
          assessment: "Early recovery progressing well. External motivation beginning to shift toward intrinsic as client experiences tangible benefits of sobriety. Ambivalence about AA identity remains a barrier to full engagement. Trigger mapping reveals high-risk periods: evenings at home alone and marital tension. Sponsor relationship reactivated — important protective factor.",
          plan: "1. Assign evening structured activity plan to address 'empty house' trigger period (5–8 PM). 2. Review trigger mapping worksheet next session; add coping responses column. 3. Challenge AA ambivalence using cost-benefit analysis. 4. Encourage two additional AA meetings; suggest speaking at one meeting. 5. Check in re: court date outcomes next session.",
        },
        tags: {
          moodIndicators: ["more open", "cautiously optimistic", "anxious about work"],
          substancesMentioned: [],
          triggersIdentified: ["empty house in evenings", "marital conflict moments", "work pressure"],
          copingStrategiesDiscussed: ["AA attendance", "sponsor reconnection", "structured evening activities"],
          supportNetworkChanges: "Sponsor reactivated — weekly contact reestablished. Wife showing increased support after positive dinner experience.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: [],
          sessionSentiment: "cautiously-improving",
          keyQuotes: ["I texted him and he actually called me right back — I forgot how that felt.", "I sit down in those meetings and think, these aren't my people. But then I think, where else would I go?"],
        },
        followUpFlags: [
          "Review evening routine plan — has he implemented structured activities 5–8 PM?",
          "Court outcome update needed — assess legal stress level",
          "Encourage speaking at one AA meeting before next session",
        ],
      },
      {
        id: "sess-001-3",
        sessionNumber: 3,
        date: "2026-02-17",
        rawNotes: "Marcus came in stressed. Boss gave him a formal written warning for performance issues. He went to a bar parking lot on Saturday night but says he turned around and called his sponsor instead. Stayed on phone for 45 minutes. He went to 4 AA meetings this week. Wife is still supportive but frustrated with the legal situation. He's angry at his boss and at himself. Safety check — no SI, no plan, but expressed passive hopelessness about whether things will get better.",
        dapNote: {
          data: "Client reports significant occupational stressor: formal written performance warning. Critical self-report: client drove to bar parking lot Saturday evening, but exited situation by calling sponsor — conversation lasted approximately 45 minutes. AA attendance increased to 4 meetings in past week. Wife maintains support but expresses frustration regarding legal proceedings. Safety assessment completed: denies suicidal ideation or plan; endorses passive hopelessness.",
          assessment: "Client demonstrated significant protective behavior: self-initiated de-escalation of high-risk situation via sponsor call rather than relapse. This represents a meaningful recovery skill application. Employment threat adds acute stressor to existing recovery challenges. Passive hopelessness warrants monitoring but does not meet clinical threshold for acute risk. Anger prominent — may be a secondary trigger. AA engagement strengthening.",
          plan: "1. Validate and reinforce parking lot crisis response — explicitly label as recovery skill mastery. 2. Safety plan reviewed and updated; add sponsor call as Tier 1 crisis response. 3. Introduce cognitive reframing for work-related anger. 4. Discuss legal consultation options to reduce uncertainty-related stress. 5. Follow up on hopelessness at next session — administer PHQ-9. 6. Increase sponsor contact goal to minimum 3x/week.",
        },
        tags: {
          moodIndicators: ["angry", "stressed", "proud of himself", "hopeless undertones"],
          substancesMentioned: ["alcohol — bar (proximal exposure, no consumption)"],
          triggersIdentified: ["job performance threat", "self-criticism", "legal system stress"],
          copingStrategiesDiscussed: ["sponsor crisis call", "leaving high-risk environment", "AA meetings"],
          supportNetworkChanges: "Sponsor proving effective as crisis resource. Wife support present but strained by legal situation.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: ["passive hopelessness", "occupational threat to stability", "proximal alcohol exposure (bar parking lot)"],
          sessionSentiment: "mixed",
          keyQuotes: ["I sat in that parking lot for ten minutes. Then I called Dave.", "What's the point of all this if I'm going to lose my job anyway?"],
        },
        followUpFlags: [
          "PRIORITY: Administer PHQ-9 at next session — monitor hopelessness level",
          "Follow up on employment situation — written warning impact on job security",
          "Reinforce sponsor-as-crisis-contact — verify 3x/week contact frequency",
        ],
      },
      {
        id: "sess-001-4",
        sessionNumber: 4,
        date: "2026-03-03",
        rawNotes: "PHQ-9 score: 8 (mild depression). Marcus feels better than last session. Boss backed off after Marcus explained his treatment situation — HR got involved and created an accommodation plan. He's relieved. Sponsor relationship is strong now — talks to Dave 4-5 times a week. AA: 3 meetings this week, spoke for the first time at a meeting, talked about the parking lot moment. Wife and he went to couples therapy for the first time this weekend. We started relapse prevention planning.",
        dapNote: {
          data: "PHQ-9 score: 8 (mild depression, improved from clinically significant hopelessness noted session 3). Significant occupational development: HR-mediated accommodation plan established. Sponsor contact frequency: 4–5 times per week. AA: 3 meetings, client made first-ever share at meeting. Couples therapy initiated — first session attended. Relapse prevention planning commenced. Client self-reports 6 weeks continuous sobriety.",
          assessment: "Trajectory clearly improving across multiple domains. Employment stabilization removes a major acute stressor. Sponsor relationship now functioning at high quality. First AA share represents significant milestone in community integration. Couples therapy initiation is a protective factor for long-term recovery. Mild depressive symptoms likely to continue improving. Relapse prevention work is timely.",
          plan: "1. Continue relapse prevention planning — complete HALT trigger worksheet next session. 2. Administer PHQ-9 monthly to track depressive symptom trajectory. 3. Encourage ongoing couples therapy — obtain release to coordinate with therapist. 4. Review accommodation plan details. 5. Celebrate 6-week sobriety milestone; plan 90-day milestone goal-setting.",
        },
        tags: {
          moodIndicators: ["relieved", "cautiously hopeful", "more settled"],
          substancesMentioned: [],
          triggersIdentified: ["residual work anxiety", "fear of relapse"],
          copingStrategiesDiscussed: ["HALT framework", "sponsor calls", "couples therapy", "AA sharing"],
          supportNetworkChanges: "Major improvement: couples therapy started, wife re-engaged as partner. Sponsor relationship significantly strengthened. HR accommodation in place.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: ["I told them about the parking lot. People came up to me after.", "She cried in the therapist's office. I hadn't seen her cry in a year."],
        },
        followUpFlags: [
          "Complete HALT worksheet — review completed version at next session",
          "Obtain release of information for couples therapist coordination",
          "Plan 90-day sobriety milestone goal-setting activity",
        ],
      },
      {
        id: "sess-001-5",
        sessionNumber: 5,
        date: "2026-03-24",
        rawNotes: "Marcus is doing well. He hit 60 days last week and his sponsor threw him a small celebration. Work is stable — accommodation is working. He's been going to couples therapy every 2 weeks. Still 3 AA meetings a week. One craving this week on a Friday night — he used HALT, identified he was hungry and lonely, called his sponsor and they grabbed coffee. No relapse. He wants to talk about what happens when IOP ends — he's nervous about the transition. We discussed step-down to weekly outpatient.",
        dapNote: {
          data: "Client reports 60 days continuous sobriety — milestone celebrated with sponsor. Employment accommodation functioning well. Couples therapy continuing biweekly. AA: 3x/week. Single craving episode this week (Friday evening): successfully managed using HALT framework — identified hunger and loneliness, responded with sponsor contact and social engagement. No substance use. Client initiated discussion of treatment transition anxiety.",
          assessment: "Strong, sustained recovery trajectory across all domains. HALT framework application in real-world craving situation demonstrates internalization of coping skills. 60-day milestone represents substantial sobriety capital. Treatment transition anxiety is appropriate and expected; addressing it proactively is a sign of recovery maturity. Step-down to weekly outpatient is clinically indicated. Primary remaining vulnerability: transition periods and evening loneliness.",
          plan: "1. Begin formal step-down transition planning — target weekly outpatient start in 3–4 weeks. 2. Develop transition safety plan addressing evening loneliness vulnerability. 3. Coordinate with couples therapist re: transition support. 4. Set 90-day sobriety milestone celebration plan with sponsor. 5. Review relapse prevention plan completeness before IOP discharge.",
        },
        tags: {
          moodIndicators: ["confident", "slightly anxious about transition", "grounded"],
          substancesMentioned: [],
          triggersIdentified: ["Friday evenings", "loneliness", "hunger as vulnerability state"],
          copingStrategiesDiscussed: ["HALT framework", "sponsor coffee meetup", "proactive social planning"],
          supportNetworkChanges: "Sponsor relationship excellent — providing celebration and crisis support. Couples therapy ongoing. AA community deepening.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "stable-positive",
          keyQuotes: ["I used HALT and it actually worked. I didn't think it would.", "What happens when I don't have this place to come to?"],
        },
        followUpFlags: [
          "Begin step-down planning — identify outpatient program options for transition",
          "Transition safety plan: address Friday evening vulnerability specifically",
          "90-day sobriety milestone — schedule celebration plan with sponsor before IOP end",
        ],
      },
    ],
  },

  // ── Client 2: Sofia Reyes ─────────────────────────────────
  {
    id: "client-002",
    name: "Sofia Reyes",
    age: 29,
    gender: "Female",
    diagnosis: "Opioid Use Disorder (Moderate-Severe)",
    coOccurring: "Major Depressive Disorder (recurrent, moderate)",
    programType: "Outpatient + MAT",
    admissionDate: "2026-02-10",
    programDay: 46,
    mat: "Buprenorphine/Naloxone (Suboxone) 16mg/day",
    insurance: "Medicaid",
    emergencyContact: "Rosa Reyes (Mother) — (614) 555-0293",
    riskLevel: "high",
    treatmentPlan: {
      objectives: [
        { id: "obj-1", description: "Maintain medication adherence (Suboxone) and attend all MAT clinic appointments", status: "on-track", targetDate: "2026-06-01" },
        { id: "obj-2", description: "Identify and develop responses to 3 key relapse triggers related to social environment", status: "in-progress", targetDate: "2026-05-01" },
        { id: "obj-3", description: "Re-engage with mental health treatment for MDD — establish psychiatry contact", status: "at-risk", targetDate: "2026-04-15" },
      ],
    },
    sessions: [
      {
        id: "sess-002-1",
        sessionNumber: 1,
        date: "2026-02-12",
        rawNotes: "Sofia came in quiet, wouldn't make eye contact initially. Started with Percocet after a car accident at 23, progressed to heroin, now fentanyl. Has been on and off treatment for 3 years. Currently on Suboxone 16mg, started 2 weeks ago. Lives with her mother. Her boyfriend of 2 years still uses — she hasn't told him she's in treatment. She has a 4-year-old daughter Lily who lives with her mother because of DCS involvement. She wants her daughter back. That's her reason for being here.",
        dapNote: {
          data: "Client presented for initial outpatient session following MAT induction 2 weeks prior (Suboxone 16mg/day, adherent). History of OUD beginning at age 23 with prescription opioids post-MVA, progressing to heroin then fentanyl. Multiple prior treatment episodes over 3 years. Current living situation: mother's residence. Active intimate partner who is currently using — client has not disclosed treatment to partner. Daughter (age 4) in grandmother's care under DCS supervision; reunification is client's stated primary motivation.",
          assessment: "Client presents with moderate-severe OUD, currently stabilizing on MAT. Motivation appears genuine and intrinsically driven (parental reunification). Critical risk factor: partner's ongoing active use and lack of treatment disclosure represents a significant environmental threat to recovery. DCS involvement provides both motivational leverage and psychological stress. Co-occurring MDD likely exacerbating vulnerability. MAT adherence currently strong — this must be protected.",
          plan: "1. Affirm Suboxone adherence — coordinate with MAT clinic for monthly progress sharing (ROI needed). 2. Explore partner disclosure barriers next session — develop communication plan. 3. Referral to psychiatry for MDD evaluation and medication review. 4. Contact DCS case worker to obtain reunification plan and timeline. 5. Safety planning completed — coping cards provided. 6. Return weekly.",
        },
        tags: {
          moodIndicators: ["withdrawn", "quiet", "determined underneath surface"],
          substancesMentioned: ["opioids — fentanyl (history)", "opioids — heroin (history)", "opioids — prescription (history)"],
          triggersIdentified: ["partner's active use", "DCS stress", "grief over daughter's absence"],
          copingStrategiesDiscussed: ["MAT adherence", "mother as support figure", "motivation anchoring (daughter)"],
          supportNetworkChanges: "Mother is primary support. Partner is active user — significant risk factor. No peer recovery support yet.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["partner actively using", "treatment not disclosed to partner", "DCS case active", "MDD untreated"],
          sessionSentiment: "stable",
          keyQuotes: ["I want my daughter back. That's it. That's why I'm here.", "He doesn't know I'm here. I don't know how to tell him."],
        },
        followUpFlags: [
          "PRIORITY: Partner disclosure — develop communication plan; assess relationship safety",
          "Psychiatry referral — MDD treatment gap; initiate within 2 weeks",
          "DCS coordinator contact — obtain reunification requirements and visit schedule",
        ],
      },
      {
        id: "sess-002-2",
        sessionNumber: 2,
        date: "2026-02-19",
        rawNotes: "Sofia came in looking better — slept last week. Suboxone is helping with cravings significantly. She still hasn't told her boyfriend. We spent most of the session on that. She's scared he'll leave her, and also scared that if he leaves she'll relapse. She visited with her daughter Lily for the first time in 8 weeks last Saturday — supervised, 2 hours. She cried telling me about it. Daughter kept calling for mama. DCS says she needs 90 days clean and a stable housing plan. Psychiatry appointment scheduled for March 3rd. One near-miss: she ran into an old friend who offered her pills at a grocery store. She walked away and called her mom.",
        dapNote: {
          data: "Client reports improved sleep quality since MAT stabilization. Suboxone 16mg adherent — denies cravings since last session. First supervised visitation with daughter in 8 weeks (2 hours) — significant emotional event. DCS provided specific reunification benchmarks: 90 days continuous sobriety, stable housing plan. Psychiatry appointment scheduled March 3rd. High-risk exposure reported: unsolicited drug offer from acquaintance in grocery store — client exited situation and contacted mother. Partner disclosure not yet occurred.",
          assessment: "MAT stabilization progressing well. Daughter visitation is a powerful motivational anchor. DCS reunification criteria are clear and achievable. High-risk situation handled effectively via escape and social support — demonstrates emerging coping capacity. Partner disclosure barrier remains a significant therapeutic focus; ambivalence is complex. Psychiatric care initiation is a positive step.",
          plan: "1. Role-play partner disclosure conversation — use motivational interviewing to explore ambivalence. 2. Affirm grocery store coping response — add to personal strengths list. 3. DCS: create 90-day tracking calendar with client. 4. Confirm psychiatry appointment March 3rd; obtain ROI for treatment coordination. 5. Explore peer support options (NA, SMART Recovery).",
        },
        tags: {
          moodIndicators: ["more rested", "emotionally raw after daughter visit", "conflicted about partner"],
          substancesMentioned: ["opioids — pills (social offer, declined)"],
          triggersIdentified: ["partner disclosure anxiety", "fear of abandonment", "environmental drug offer"],
          copingStrategiesDiscussed: ["calling mother in crisis", "exiting high-risk environment", "daughter as motivational anchor"],
          supportNetworkChanges: "Daughter contact reestablished (supervised visits). Mother actively supporting recovery. Partner situation unresolved.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["partner active use — ongoing undisclosed", "social network with active users"],
          sessionSentiment: "cautiously-improving",
          keyQuotes: ["She ran to me and said 'mama' and I just — I can't lose that again.", "If I tell him and he leaves, what do I have? What if I fall apart?"],
        },
        followUpFlags: [
          "PRIORITY: Partner disclosure — complete role-play; develop plan with timeline",
          "DCS 90-day sobriety calendar — complete with client at next session",
          "Psychiatry appointment confirmation March 3rd — follow up on outcomes",
        ],
      },
      {
        id: "sess-002-3",
        sessionNumber: 3,
        date: "2026-03-05",
        rawNotes: "She told him. Her boyfriend didn't take it well initially — he got angry. But he called the next day and apologized. He's not in treatment and doesn't want to be. She decided she needs to put some distance — she's going to stay at her mom's and only see him in neutral places. This is huge. Psychiatry: she started Wellbutrin 150mg. The doctor thinks her depression is contributing to relapse risk. She has another daughter visit this Saturday. She's at 23 days clean.",
        dapNote: {
          data: "Client disclosed treatment to intimate partner. Initial partner response: anger. Follow-up contact: partner apologized and engaged in substantive conversation. Partner not willing to seek treatment. Client decision: maintain relationship with physical distance boundary — residing at mother's, limiting partner contact to neutral settings. Psychiatric evaluation completed March 3rd: Wellbutrin 150mg initiated for MDD. Second supervised daughter visitation scheduled. Client self-reports 23 days of continuous opioid-free days (Suboxone adherent).",
          assessment: "Partner disclosure is a major therapeutic milestone. Client's boundary-setting response reflects sophisticated recovery thinking — protection of sobriety without complete relationship severance. This decision should be affirmed and monitored. Wellbutrin initiation is appropriate for MDD; monitor for therapeutic response at 4–6 weeks. 23 days clean with strong motivation. Environmental risk reduced by partner boundary strategy.",
          plan: "1. Affirm partner boundary decision — develop sustainability plan if partner pressure increases. 2. Monitor Wellbutrin response at next session — side effects, mood improvement. 3. Daughter visitation: celebrate milestone, plan for expanded visitation request to DCS. 4. Build peer support — identify local women's NA meeting. 5. 30-day clean milestone approaching — acknowledge and plan recognition.",
        },
        tags: {
          moodIndicators: ["nervous but proud", "lighter affect", "clearer thinking"],
          substancesMentioned: [],
          triggersIdentified: ["partner's continued use", "relationship uncertainty"],
          copingStrategiesDiscussed: ["boundary setting", "physical distance from trigger environment", "maintaining relationship safely"],
          supportNetworkChanges: "Major shift: partner aware of treatment, boundary established. Mother's home now primary safe environment. Psychiatric care added.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: ["partner continues active use — ongoing exposure risk"],
          sessionSentiment: "improving",
          keyQuotes: ["I told him. I finally told him.", "I can't get clean with him around every day. So I'm choosing me. And Lily."],
        },
        followUpFlags: [
          "Monitor Wellbutrin response — mood and side effects at next session",
          "Partner boundary sustainability — check in on pressure from partner to return",
          "Request DCS expanded visitation — 30 days sobriety supports case for increase",
        ],
      },
      {
        id: "sess-002-4",
        sessionNumber: 4,
        date: "2026-03-26",
        rawNotes: "Sofia came in shaken. Her boyfriend showed up at her mom's house last night — he wasn't threatening but he was using and he wanted money. Her mom turned him away but Sofia was upset all night. She had a craving — her first real one since Suboxone stabilized. She called the crisis line at 2am and talked for 30 minutes. She didn't use. She's been 44 days clean. Wellbutrin seems to be helping — she's been getting up earlier, engaging more. Daughter visits weekly now. DCS updated reunification timeline — if 90 days clean and stable housing, she could have Lily back by mid-May.",
        dapNote: {
          data: "Acute stressor reported: intimate partner appeared at client's residence while intoxicated, requested money. Client's mother successfully managed situation. Client experienced significant emotional distress — first opioid craving since MAT stabilization. Crisis line contact at 2:00 AM: 30-minute call, no substance use. 44 days continuous sobriety maintained. Wellbutrin 150mg response noted: improved morning activation, increased session engagement. Daughter visitation now weekly. DCS updated reunification projection: mid-May if sobriety and housing targets met.",
          assessment: "Crisis management response demonstrates significant growth — client utilized crisis line rather than relapsing in high-stress situation at 2 AM. However, partner's unannounced appearance represents an escalating environmental threat requiring proactive boundary escalation. 44 days sobriety with this level of environmental stress is clinically noteworthy. Wellbutrin therapeutic response appears positive. Reunification timeline (mid-May) is now a concrete, proximal motivator. Crisis plan needs updating to include partner-specific protocol.",
          plan: "1. PRIORITY: Update crisis and safety plan to include specific protocol if partner contacts or appears. 2. Discuss options for formalizing safety boundaries at mother's residence regarding partner access. 3. Celebrate 44-day milestone and crisis response. 4. Wellbutrin: continue current dose, reassess at 6-week mark. 5. Mid-May reunification: develop concrete housing plan with mother. 6. Begin housing stability documentation for DCS.",
        },
        tags: {
          moodIndicators: ["shaken", "exhausted", "resilient", "still motivated"],
          substancesMentioned: ["opioids — craving episode (no use)"],
          triggersIdentified: ["partner intoxicated appearance", "nighttime stress", "financial vulnerability of partner"],
          copingStrategiesDiscussed: ["crisis hotline 2am call", "mother as buffer", "daughter reunification as anchor"],
          supportNetworkChanges: "Mother providing frontline boundary support. Partner escalating as environmental risk. DCS progress positive.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["PRIORITY: partner actively using, making unannounced contact at residence", "acute craving episode (first since stabilization)"],
          sessionSentiment: "mixed",
          keyQuotes: ["He showed up and I just — I could feel it. The pull. I called the line instead.", "I'm not going back. Not when I can see May from here."],
        },
        followUpFlags: [
          "PRIORITY: Partner safety boundary plan — formalize no-contact protocol at mother's residence",
          "Housing plan for DCS — begin documentation; review at next session",
          "Wellbutrin 6-week reassessment — mood improvement trajectory",
        ],
      },
    ],
  },

  // ── Client 3: Daniel Park ─────────────────────────────────
  {
    id: "client-003",
    name: "Daniel Park",
    age: 41,
    gender: "Male",
    diagnosis: "Stimulant Use Disorder, Severe (Methamphetamine)",
    coOccurring: "Bipolar II Disorder (hypomanic features, undertreated)",
    programType: "Residential",
    admissionDate: "2026-03-01",
    programDay: 27,
    mat: null,
    insurance: "Aetna",
    emergencyContact: "Karen Park (Sister) — (503) 555-0381",
    riskLevel: "high",
    treatmentPlan: {
      objectives: [
        { id: "obj-1", description: "Engage fully in residential program structure and maintain sobriety", status: "in-progress", targetDate: "2026-05-01" },
        { id: "obj-2", description: "Complete psychiatric evaluation and begin appropriate mood stabilization", status: "in-progress", targetDate: "2026-04-01" },
        { id: "obj-3", description: "Develop understanding of meth-bipolar interaction and personal relapse cycle", status: "in-progress", targetDate: "2026-05-15" },
      ],
    },
    sessions: [
      {
        id: "sess-003-1",
        sessionNumber: 1,
        date: "2026-03-03",
        rawNotes: "Daniel is 2 days post-admission. He's still in the acute phase — irritable, restless, can't sit still. He's a contractor, used to run his own business. Lost it 18 months ago when meth use took over. His wife left 8 months ago and took their two kids. His sister Karen brought him in — she found him in a really bad state. He says he's been using daily for about 2 years, started using more heavily when the business failed. He has a history of depression and what sounds like hypomanic episodes — he was briefly on Depakote 5 years ago but stopped. The meth and bipolar connection needs to be addressed.",
        dapNote: {
          data: "Client presents for individual session Day 2 post-residential admission. Currently in early acute withdrawal: motor restlessness, irritability, sleep disruption. History: severe methamphetamine use disorder, daily use for approximately 2 years, escalating after business closure 18 months ago. Personal history: small contracting business, marriage dissolved 8 months ago (wife departed with 2 minor children). Psychiatric history: Depakote trial approximately 5 years ago, self-discontinued. Sister (Karen) is primary support and arranged admission. Safety evaluated: denies SI.",
          assessment: "Client in early recovery phase — acute withdrawal management priority. History strongly suggests Bipolar II comorbidity (depressive episodes, hypomanic features, prior mood stabilizer trial). Meth use likely functioning as self-medication for mood episodes. Catastrophic loss cascade (business, marriage, children, housing) over 18 months represents extreme psychosocial stressor load. Psychiatric evaluation is urgent — untreated Bipolar II significantly increases relapse risk.",
          plan: "1. Prioritize comfort and safety in acute withdrawal phase. 2. Urgent psychiatric consult referral — within 72 hours. 3. Psychoeducation on stimulant use disorder and withdrawal timeline. 4. Introduce residential program structure gradually. 5. Contact sister Karen with ROI — she is primary support person. 6. Daily check-ins with nursing staff for withdrawal monitoring.",
        },
        tags: {
          moodIndicators: ["highly irritable", "restless", "guarded", "intermittently tearful"],
          substancesMentioned: ["methamphetamine — crystal (daily, 2 years)", "alcohol — occasional concurrent use"],
          triggersIdentified: ["business failure", "marriage dissolution", "loss of children", "financial ruin"],
          copingStrategiesDiscussed: [],
          supportNetworkChanges: "Sister Karen only active support. Wife estranged. No peer recovery network.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["acute stimulant withdrawal", "untreated Bipolar II", "significant loss history — grief unprocessed", "social isolation"],
          sessionSentiment: "concerning",
          keyQuotes: ["Everything fell apart at once. The business, then Sarah, then I didn't care what happened to me.", "I haven't slept more than 3 hours since I got here."],
        },
        followUpFlags: [
          "PRIORITY: Psychiatric consult within 72 hours — Bipolar II evaluation and mood stabilizer consideration",
          "Daily nursing check-in — withdrawal monitoring, sleep tracking",
          "Contact sister Karen — collateral information and family support planning",
        ],
      },
      {
        id: "sess-003-2",
        sessionNumber: 2,
        date: "2026-03-12",
        rawNotes: "Daniel is settling in after 11 days. Sleep improving — getting 5-6 hours. His mood is less explosive but he's depressed now. The crash after meth is real. Psychiatry saw him last week — started on Lamictal 25mg, titrating up. He's been attending group sessions and getting more engaged. He called his sister twice this week. He's angry about the divorce. He hasn't been allowed contact with his kids yet — wife has a no-contact order in place. He's starting to understand the meth-bipolar connection.",
        dapNote: {
          data: "Day 11 residential. Sleep duration improved: 5–6 hours per night. Affective presentation shifted from acute irritability to depressive withdrawal — consistent with post-stimulant crash. Psychiatric consultation completed: Lamictal 25mg initiated, titration protocol begun. Group therapy attendance: 80% — participation increasing. Sister contact: 2 calls this week. Ongoing barrier: court-imposed no-contact order prevents access to minor children. Client engaged in initial grief processing work.",
          assessment: "Progress in residential structure adaptation. Post-stimulant depression is expected and requires close monitoring — Lamictal initiation is appropriate but therapeutic effect requires weeks. No-contact order regarding children is a significant ongoing grief source. Grief work should be prioritized as psychostabilization allows. Emerging insight into meth-bipolar relationship is a therapeutic opening. Sister relationship protective.",
          plan: "1. Continue Lamictal titration monitoring — check in with psychiatry at week 4. 2. Begin structured grief processing — 3-phase approach. 3. Develop family reunification goals with legal advisor input (sister can help). 4. Build on group participation — encourage peer mentorship role as stabilization improves. 5. Introduce relapse cycle mapping — meth use patterns relative to mood episodes.",
        },
        tags: {
          moodIndicators: ["depressed", "more stable than admission", "tearful discussing children"],
          substancesMentioned: [],
          triggersIdentified: ["children separation and no-contact order", "grief over marriage loss", "identity loss (business, role as father)"],
          copingStrategiesDiscussed: ["sister contact", "group therapy participation", "grief journaling introduced"],
          supportNetworkChanges: "Sister relationship strengthening. Group peers beginning to form connections. Family estrangement remains.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: ["post-stimulant crash depression — suicide risk monitoring required", "no-contact order re: children — ongoing acute stressor"],
          sessionSentiment: "stable",
          keyQuotes: ["The meth made me feel like I could fix everything. And then it took everything.", "I just want to hear their voices."],
        },
        followUpFlags: [
          "PRIORITY: Monitor post-stimulant depression closely — PHQ-9 next session; suicide risk reassessment",
          "Lamictal week-4 psychiatric check — titration and response evaluation",
          "Legal consultation re: no-contact modification — explore family law resources with sister",
        ],
      },
      {
        id: "sess-003-3",
        sessionNumber: 3,
        date: "2026-03-25",
        rawNotes: "Day 24. Daniel is notably more stable. PHQ-9: 11 (moderate depression, improved from severe-range). He's becoming a resource in group — other residents ask him questions. He's got a dry sense of humor that's starting to come out. He got a letter from his wife's attorney — divorce proceeding. He handled it better than expected. He's thinking about what comes next — project management or something recovery-adjacent. He heard his kids' voices on a call mediated by his sister. 3 minutes. He cried after but he's okay.",
        dapNote: {
          data: "Day 24 residential. PHQ-9 score: 11 (moderate depression, improved from score of 19 at week 1). Lamictal titrating — currently at 50mg, psychiatry follow-up next week. Group therapy engagement notably increased — peers seeking client's input; emergent peer leadership role observed. Legal development: divorce proceedings formally initiated. 3-minute mediated phone contact with minor children via sister. Vocational exploration initiated: client expressing interest in project management or recovery-adjacent career.",
          assessment: "Meaningful trajectory improvement across mood, engagement, and stabilization. PHQ-9 drop from 19 to 11 over 3 weeks reflects both post-stimulant recovery and Lamictal early response. Peer leadership emergence is an important protective factor. Legal development (divorce) is painful but client's measured response suggests developing psychological resilience. Brief children contact is significant. Vocational reframing is healthy — recovery-adjacent interest may indicate emerging meaning-making.",
          plan: "1. Begin step-down planning discussion — target residential completion at day 45–60. 2. Vocational planning: connect with vocational rehabilitation resources. 3. Continue Lamictal titration — week 6 psychiatric review for mood stabilization assessment. 4. Grief processing: incorporate divorce finalization as part of loss work. 5. Children contact: work with sister to formalize supervised contact protocol. 6. Identify aftercare outpatient placement before discharge.",
        },
        tags: {
          moodIndicators: ["noticeably more stable", "dry humor returning", "tearful post-children contact but contained"],
          substancesMentioned: [],
          triggersIdentified: ["divorce proceeding formalization", "uncertainty about future", "separation from children"],
          copingStrategiesDiscussed: ["peer leadership in group", "humor as healthy coping", "vocational meaning-making", "grief journaling"],
          supportNetworkChanges: "Peer community in residential forming. Sister mediating limited children contact. Ex-wife boundary maintained.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: ["moderate depression ongoing — continued monitoring required", "divorce finalization approaching — acute grief trigger"],
          sessionSentiment: "stable",
          keyQuotes: ["I heard Maya say 'Daddy' and I just lost it. But in a good way.", "I built something once. Maybe I can build something different."],
        },
        followUpFlags: [
          "Begin step-down aftercare planning — identify outpatient program before residential discharge",
          "Vocational rehab referral — explore project management pathways",
          "Children contact formalization — work with sister and ex-wife mediator",
        ],
      },
    ],
  },

  // ── Client 4: Claire Bennett ──────────────────────────────
  {
    id: "client-004",
    name: "Claire Bennett",
    age: 38,
    gender: "Female",
    diagnosis: "Alcohol Use Disorder (Moderate)",
    coOccurring: "Generalized Anxiety Disorder",
    programType: "Outpatient",
    admissionDate: "2026-01-15",
    programDay: 72,
    mat: null,
    insurance: "United Healthcare",
    emergencyContact: "Tom Bennett (Husband) — (317) 555-0214",
    riskLevel: "low",
    treatmentPlan: {
      objectives: [
        { id: "obj-1", description: "Maintain complete abstinence from alcohol and establish stable sobriety routine", status: "on-track", targetDate: "2026-04-15" },
        { id: "obj-2", description: "Develop anxiety management toolkit — reduce alcohol use as anxiety coping mechanism", status: "on-track", targetDate: "2026-05-01" },
        { id: "obj-3", description: "Rebuild occupational functioning — return to part-time work by program completion", status: "in-progress", targetDate: "2026-05-15" },
      ],
    },
    sessions: [
      {
        id: "sess-004-1",
        sessionNumber: 1,
        date: "2026-01-17",
        rawNotes: "Claire came in very put-together — dressed professionally. She's a high school English teacher on medical leave. Two DUIs in the past 14 months. Her husband Tom pushed her to seek treatment. She describes herself as a 'functioning alcoholic' until recently. She's always had anxiety — used wine to wind down for years, it gradually became a bottle a night. She's on day 4 of sobriety, voluntarily. She's intellectually sharp and self-aware, which is both a strength and a defense mechanism. She already knows all the 'right' answers but hasn't internalized them emotionally.",
        dapNote: {
          data: "Client presented for initial outpatient session, day 4 voluntary sobriety. Occupation: high school English teacher, currently on medical leave. Legal history: two DUI convictions within 14 months. Presenting pattern: progressive alcohol use, origin in anxiety self-medication — wine consumption escalating from social use to approximately 1 bottle/night. Husband supportive and motivated treatment engagement. Client demonstrates high verbal intelligence and psychological insight. No withdrawal symptoms reported.",
          assessment: "Client presents as motivated, self-aware individual with clear insight into behavioral patterns. High functioning premorbidly — alcohol use disorder developed within a high-achieving identity. Intellectualization is a likely defense mechanism to monitor. Anxiety disorder appears primary and predates AUD — this must be treated in parallel. Supportive marital relationship is a significant protective factor. Two DUIs provide legal motivational leverage. Day 4 voluntary sobriety suggests internal motivation is present.",
          plan: "1. Establish rapport and assess depth of insight vs. emotional processing. 2. GAD assessment — administer GAD-7 next session. 3. Introduce anxiety-sobriety connection psychoeducation. 4. Identify current anxiety management strategies beyond alcohol. 5. Discuss medical leave status and return-to-work timeline. 6. Weekly outpatient schedule established — individual and group.",
        },
        tags: {
          moodIndicators: ["composed", "intellectually engaged", "slightly defensive"],
          substancesMentioned: ["alcohol — wine (1 bottle/night, progressive)"],
          triggersIdentified: ["evening anxiety", "work performance pressure", "perfectionism"],
          copingStrategiesDiscussed: ["voluntary sobriety initiation", "treatment-seeking"],
          supportNetworkChanges: "Husband highly supportive. No peer recovery network yet. Medical leave provides time for treatment.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: ["intellectualization as defense barrier to emotional processing"],
          sessionSentiment: "stable",
          keyQuotes: ["I know exactly what I've been doing. Knowing it and stopping it are apparently different skills.", "I kept telling myself: you still show up for work, you're fine."],
        },
        followUpFlags: [
          "GAD-7 assessment at next session — anxiety severity baseline",
          "Explore beneath intellectualization — emotional processing capacity",
          "Medical leave and return-to-work planning — timeline and conditions",
        ],
      },
      {
        id: "sess-004-2",
        sessionNumber: 2,
        date: "2026-01-26",
        rawNotes: "GAD-7 score: 16 (severe anxiety). She was surprised by the score, as if she'd normalized her anxiety level. We talked about the anxiety-alcohol loop for most of the session. She's never had anxiety treatment — just 'pushed through.' She's been going to an AA meeting twice a week with Tom. She doesn't love AA but she goes. Two weeks sober now. Sleeping terribly — racing thoughts at night. We started working on sleep hygiene and introduced basic progressive muscle relaxation. She's a natural at the technique.",
        dapNote: {
          data: "GAD-7 administered: score 16 (severe anxiety). Client expressed surprise at severity score — indicates normalization of chronic anxiety symptoms. Two weeks continuous sobriety. AA attendance: twice weekly with husband — client ambivalent but compliant. Sleep disruption reported: difficulty initiating sleep secondary to cognitive arousal. Introduced progressive muscle relaxation (PMR) — client demonstrated high technique aptitude. Initial psychoeducation on anxiety-alcohol reciprocal relationship delivered.",
          assessment: "GAD-7 score of 16 represents severe anxiety that has been chronically unaddressed — this is likely the primary driver of alcohol use as self-medication. Client normalization of severe anxiety is a key clinical finding. PMR aptitude is a clinical asset. Sleep disruption is expected and should improve with continued sobriety and anxiety skill development.",
          plan: "1. Build PMR into daily practice — evening routine target. 2. Introduce cognitive restructuring for nighttime rumination. 3. Consider referral to therapist specializing in CBT for GAD. 4. Explore AA ambivalence — SMART Recovery introduced as alternative. 5. Two-week sobriety milestone — acknowledge and reinforce. 6. Begin identifying anxiety triggers inventory.",
        },
        tags: {
          moodIndicators: ["surprised by own anxiety severity", "analytical about new information", "tired from sleep disruption"],
          substancesMentioned: [],
          triggersIdentified: ["nighttime cognitive arousal", "perfectionism", "performance anxiety"],
          copingStrategiesDiscussed: ["progressive muscle relaxation (PMR)", "sleep hygiene basics", "AA attendance"],
          supportNetworkChanges: "Husband attending AA with client — strong partnership. No additional peer support yet.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: [],
          sessionSentiment: "stable",
          keyQuotes: ["Sixteen? I thought maybe an eight.", "I've been anxious my whole life. I thought everyone felt this way."],
        },
        followUpFlags: [
          "PMR daily practice — check adherence and effectiveness next session",
          "CBT-GAD referral — identify local therapist with anxiety specialization",
          "SMART Recovery — provide information as AA alternative or complement",
        ],
      },
      {
        id: "sess-004-3",
        sessionNumber: 3,
        date: "2026-02-09",
        rawNotes: "She's 25 days sober. GAD-7 follow-up: 11 (moderate, down from 16). Sleep is better — she's been doing PMR every night before bed. She's starting to feel the difference. She found a SMART Recovery meeting she likes better than AA — went twice. Tom has been wonderful. She's been walking every morning. One hard moment: her school called about a parent complaint about her class before she left — triggered a shame spiral that lasted a day. She dealt with it by journaling instead of drinking.",
        dapNote: {
          data: "Day 25 sobriety. GAD-7 follow-up: score 11 (moderate, 5-point improvement from baseline 16). PMR practice adherence: nightly. Sleep quality notably improved. SMART Recovery: attending twice weekly — client reports strong preference over AA. Daily morning walks — self-initiated exercise routine. Acute stressor: school-related call regarding parent complaint — triggered shame response. Client managed through journaling (no substance use). Emotional processing capacity improving.",
          assessment: "Clear positive trajectory across sobriety, anxiety, and coping skill domains. GAD-7 improvement of 5 points in 2 weeks is clinically meaningful. PMR adherence and effectiveness demonstrate skill internalization. Shame response to school complaint is important to map — perfectionism-shame cycle was likely a primary anxiety driver and AUD trigger. The journaling response (vs. drinking) is a significant behavioral shift. SMART Recovery fit indicates peer support needs are being met.",
          plan: "1. Map perfectionism-shame-drinking cycle — introduce schema-based framework. 2. Continue GAD-7 monthly tracking. 3. Celebrate 25-day milestone; set 60-day goal. 4. Explore return-to-work conditions with department — what would a successful return look like? 5. CBT referral: confirm appointment. 6. Build shame resilience toolkit.",
        },
        tags: {
          moodIndicators: ["noticeably lighter", "more emotionally present", "brief shame episode (resolved)"],
          substancesMentioned: [],
          triggersIdentified: ["perfectionism — professional identity threat", "shame spiral from external criticism"],
          copingStrategiesDiscussed: ["journaling for shame processing", "morning exercise", "PMR nightly", "SMART Recovery community"],
          supportNetworkChanges: "SMART Recovery peer community forming. Husband remains highly engaged.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: ["I wrote for an hour instead of drinking. It worked and I hated that it worked.", "I always thought being anxious meant I cared. Maybe I cared too much."],
        },
        followUpFlags: [
          "CBT-GAD appointment — confirm status; coordinate with outpatient if adjunct confirmed",
          "Return-to-work planning — begin realistic timeline based on 60-day sobriety target",
          "Perfectionism-shame mapping — introduce schema work next session",
        ],
      },
      {
        id: "sess-004-4",
        sessionNumber: 4,
        date: "2026-02-23",
        rawNotes: "40 days clean. She's glowing a bit — physically healthy. She went back to grading papers for fun this weekend. She's thinking about what she wants from teaching now. Her principal called to check in and it went well. GAD-7 is down to 8 now. She started seeing a CBT therapist who specializes in anxiety. Sleep is normal now — she can't believe it. She's starting to think of the anxiety as something she has rather than something she is.",
        dapNote: {
          data: "40 days continuous sobriety. GAD-7: 8 (mild anxiety, continued improvement from baseline 16). CBT therapist engaged — first session completed, specialty match confirmed. Sleep fully normalized. Client independently engaged with occupational material (grading papers voluntarily) — indicates reconnecting with professional identity positively. Principal contact: positive — employer supportive of return. Physical health improvement self-reported and observable. Client articulating cognitive shift: anxiety as 'something I have' rather than core identity.",
          assessment: "Strong, multi-domain trajectory. GAD-7 reduction from 16 to 8 over 5 weeks reflects both sobriety benefits and skill application. Identity shift regarding anxiety is a profound therapeutic development — indicates schema-level change beginning. Voluntary occupational engagement signals return-to-work readiness emerging naturally. CBT integration is excellent. 40-day milestone represents significant sobriety capital.",
          plan: "1. Begin formal return-to-work planning — phased return, identify date target with principal. 2. Identity work: 'who am I without anxiety defining me?' — journaling assignment. 3. GAD-7 monthly check — target score <7 before return to work. 4. Coordinate with CBT therapist — brief progress note exchange (ROI). 5. Plan 60-day milestone recognition.",
        },
        tags: {
          moodIndicators: ["positive affect", "engaged", "identity clarity improving"],
          substancesMentioned: [],
          triggersIdentified: ["professional identity uncertainty", "reintegration anxiety"],
          copingStrategiesDiscussed: ["CBT for anxiety", "journaling for identity exploration", "proactive occupational reconnection"],
          supportNetworkChanges: "CBT therapist added to treatment team. Principal supportive. Husband strong. SMART Recovery ongoing.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: ["I sat down and graded those old papers for three hours. I forgot I actually love doing that.", "I'm starting to think anxiety is something that happens to me, not something I am."],
        },
        followUpFlags: [
          "Return-to-work date — concrete planning with principal; phased schedule discussion",
          "GAD-7 target < 7 before return — reassess at next session",
          "CBT coordinator ROI — brief progress note from adjunct therapist",
        ],
      },
      {
        id: "sess-004-5",
        sessionNumber: 5,
        date: "2026-03-23",
        rawNotes: "Claire hit 67 days sober yesterday. She and Tom celebrated at home with sparkling water and her favorite meal. GAD-7: 6. She starts back to work part-time next Monday — 3 days a week, two classes. She's nervous but ready. She says the anxiety feels like a low hum now instead of a freight train. She's been talking to her CBT therapist weekly and they're working on perfectionism specifically. SMART Recovery twice a week. She asked me today whether she still needs outpatient treatment — not to leave, but to understand what comes next. We talked about step-down planning.",
        dapNote: {
          data: "67 days continuous sobriety — milestone marked with meaningful personal celebration. GAD-7: 6 (minimal anxiety — below clinical threshold). Return to work commencing Monday: part-time, 3 days/week, 2 classes. Client describes anxiety as 'low hum instead of freight train.' CBT therapy ongoing weekly — perfectionism as current focus. SMART Recovery maintained 2x/week. Client-initiated discussion of treatment step-down — appropriate clinical question reflecting recovery confidence.",
          assessment: "Outstanding treatment trajectory. GAD-7 of 6 represents full transition from severe to minimal anxiety — a clinically significant achievement over 10 weeks. 67-day sobriety milestone with zero relapse episodes demonstrates robust recovery foundation. Return to work — her primary valued activity — is imminent and client-ready. The question about step-down reflects healthy autonomy and recovery confidence. Step-down to bi-weekly outpatient with continued CBT adjunct is clinically appropriate.",
          plan: "1. Step-down plan: reduce to bi-weekly outpatient sessions — trial for 6 weeks, then reassess for monthly maintenance or discharge. 2. Return-to-work check-in: schedule session day after first week back. 3. Relapse prevention plan: formal document before step-down. 4. 90-day sobriety milestone approaching — plan recognition. 5. Coordinate with CBT therapist on maintenance phase transition.",
        },
        tags: {
          moodIndicators: ["confident", "healthily nervous about return to work", "at peace"],
          substancesMentioned: [],
          triggersIdentified: ["return-to-work performance anxiety", "perfectionism patterns (CBT focus)"],
          copingStrategiesDiscussed: ["celebrating milestones soberly", "step-down as empowerment", "SMART Recovery maintenance", "CBT perfectionism work"],
          supportNetworkChanges: "Comprehensive support network: husband, CBT therapist, SMART Recovery community, outpatient team. Strongest network of any point in treatment.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "stable-positive",
          keyQuotes: ["The anxiety is still there. It's just not the boss anymore.", "I'm nervous about Monday. But the right kind of nervous — like before something good."],
        },
        followUpFlags: [
          "Return-to-work week-1 check-in — schedule session for day after first week back",
          "Relapse prevention plan — formalize document before step-down begins",
          "Step-down trial: bi-weekly sessions — schedule first 3 months of reduced cadence",
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// seedDatabase
// ─────────────────────────────────────────────────────────────
async function seedDatabase() {
  if (await isSeeded()) {
    console.log("   Database already seeded — skipping");
    return;
  }

  console.log("   Seeding database with demo data...");
  const db = await getDb();

  db.run("BEGIN TRANSACTION;");

  for (const client of SEED_CLIENTS) {
    db.run(
      `INSERT INTO clients (id, name, age, gender, diagnosis, co_occurring, program_type,
        admission_date, program_day, mat, insurance, emergency_contact, risk_level,
        treatment_plan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        client.id,
        client.name,
        client.age,
        client.gender,
        client.diagnosis,
        client.coOccurring || null,
        client.programType,
        client.admissionDate,
        client.programDay,
        client.mat || null,
        client.insurance || null,
        client.emergencyContact || null,
        client.riskLevel,
        JSON.stringify(client.treatmentPlan.objectives),
      ]
    );

    for (const session of client.sessions) {
      db.run(
        `INSERT INTO sessions (id, client_id, session_number, date, raw_notes, dap_note, tags, follow_up_flags, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          session.id,
          client.id,
          session.sessionNumber,
          session.date,
          session.rawNotes,
          JSON.stringify(session.dapNote),
          JSON.stringify(session.tags),
          JSON.stringify(session.followUpFlags),
        ]
      );
    }
  }

  db.run("COMMIT;");

  // Persist to disk
  const fs = require("fs");
  const path = require("path");
  const data = db.export();
  fs.writeFileSync(path.join(__dirname, "rehabiq.db"), Buffer.from(data));

  const clientCount = db.prepare("SELECT COUNT(*) as c FROM clients");
  clientCount.step();
  const cCount = clientCount.getAsObject().c;
  clientCount.free();

  const sessionCount = db.prepare("SELECT COUNT(*) as c FROM sessions");
  sessionCount.step();
  const sCount = sessionCount.getAsObject().c;
  sessionCount.free();

  console.log(`   ✅ Seeded ${cCount} clients with ${sCount} sessions`);
}

module.exports = { seedDatabase };
