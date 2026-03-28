// =============================================================
// RehabIQ Mock Data
// 5 clients with 4-8 sessions each, designed to tell specific
// stories during the demo. Each client has a narrative arc.
// =============================================================

const clients = [
  {
    id: "client-001",
    name: "Marcus Johnson",
    age: 34,
    gender: "Male",
    diagnosis: "Alcohol Use Disorder (Moderate)",
    coOccurring: "Adjustment Disorder with Depressed Mood (suspected, undiagnosed)",
    programType: "Intensive Outpatient (IOP)",
    admissionDate: "2026-01-25",
    programDay: 62,
    mat: null,
    insurance: "Blue Cross Blue Shield",
    emergencyContact: "Linda Johnson (Mother) — (812) 555-0147",
    treatmentPlan: {
      objectives: [
        {
          id: "obj-1",
          description: "Identify and manage top 3 personal triggers",
          status: "in-progress",
          targetDate: "2026-04-01",
        },
        {
          id: "obj-2",
          description: "Attend minimum 3 support group meetings per week",
          status: "at-risk",
          targetDate: "2026-03-30",
        },
        {
          id: "obj-3",
          description: "Develop and practice 5 sober coping strategies",
          status: "in-progress",
          targetDate: "2026-04-15",
        },
        {
          id: "obj-4",
          description: "Rebuild communication with family members",
          status: "not-started",
          targetDate: "2026-05-01",
        },
      ],
    },
    riskLevel: "moderate",
    sessions: [
      {
        id: "sess-001-1",
        sessionNumber: 1,
        date: "2026-01-27",
        rawNotes:
          "First session. Marcus is cooperative but guarded. Works as a warehouse supervisor. Divorced 2 years ago, says that was the catalyst. Drinks primarily beer, escalated to hard liquor in the last 6 months. Last drink was 3 days ago. Reports mild withdrawal symptoms — headaches, irritability. Has a sponsor through AA but hasn't called him in 2 weeks. Mother is supportive. No SI/HI. Motivated by fear of losing his job.",
        dapNote: {
          data: "Client presented for initial IOP session. Cooperative but guarded affect. Reports alcohol use escalation over past 6 months, transitioning from beer to hard liquor. Last use 3 days prior to session. Endorses mild withdrawal symptoms including headaches and irritability. Client is employed as warehouse supervisor — identifies fear of job loss as primary motivator for treatment. Divorced 2 years ago, identifies this as catalyst for increased use. Has AA sponsor but reports no contact in 2 weeks. Mother identified as primary support. Denies suicidal/homicidal ideation.",
          assessment:
            "Client presents with moderate AUD with recent escalation pattern. Motivation appears externally driven (employment) which may be less durable than intrinsic motivation. Guarded affect may indicate shame or ambivalence. Lapsed sponsor contact is a concern for early recovery support. Withdrawal symptoms are mild and do not appear to require medical intervention.",
          plan: "1. Complete comprehensive biopsychosocial assessment next session. 2. Encourage sponsor contact this week — discuss barriers. 3. Begin identifying personal triggers. 4. Introduce concept of HALT (Hungry, Angry, Lonely, Tired) as basic trigger framework. 5. Continue monitoring withdrawal symptoms.",
        },
        tags: {
          moodIndicators: ["guarded", "cooperative", "irritable"],
          substancesMentioned: ["alcohol — beer", "alcohol — hard liquor"],
          triggersIdentified: ["divorce", "job stress (general)"],
          copingStrategiesDiscussed: ["AA sponsor (lapsed)"],
          supportNetworkChanges: "Sponsor contact lapsed. Mother supportive.",
          objectivesAddressed: ["obj-1"],
          riskIndicators: [],
          sessionSentiment: "stable",
          keyQuotes: [
            "I can't lose this job too.",
            "I just stopped calling him, I don't know why.",
          ],
        },
        followUpFlags: [
          "Encourage sponsor reconnection — explore barriers",
          "Monitor withdrawal symptoms",
          "Assess motivation depth beyond employment concerns",
        ],
      },
      {
        id: "sess-001-2",
        sessionNumber: 3,
        date: "2026-02-03",
        rawNotes:
          "Marcus seemed more open today. Did the biopsychosocial last session, today we started on triggers. He identified work stress, loneliness on weekends, and driving past his old bar as top triggers. We worked through the HALT framework and he said the 'Lonely' piece really resonated. He called his sponsor once this week. Attended 2 AA meetings. Sleeping okay. No withdrawal symptoms now. Mentioned his boss has been 'on his case' about productivity but said it's manageable.",
        dapNote: {
          data: "Client presented with improved openness and engagement. Identified three primary triggers: work stress, weekend loneliness, and environmental cue (driving past former bar). HALT framework was introduced; client identified strongly with 'Lonely' component. Reports reconnecting with sponsor — one phone call this past week. Attended 2 AA meetings (below 3/week target). Withdrawal symptoms have resolved. Sleep reported as adequate. Client mentioned supervisor criticism regarding productivity, described as 'manageable.'",
          assessment:
            "Positive trajectory in engagement and self-awareness. Trigger identification is progressing well — loneliness component aligns with post-divorce adjustment and may warrant deeper exploration. Sponsor reconnection is encouraging but still below therapeutic ideal. AA attendance at 2/week is below treatment plan target of 3/week. Work stress mentioned casually but warrants monitoring given its identification as a primary trigger.",
          plan: "1. Develop specific coping strategies for each identified trigger. 2. Explore loneliness trigger in depth — connection to divorce grief. 3. Set concrete goal for 3 AA meetings this week. 4. Introduce weekend structure planning to address loneliness. 5. Monitor work stress — currently described as manageable.",
        },
        tags: {
          moodIndicators: ["open", "engaged", "reflective"],
          substancesMentioned: [],
          triggersIdentified: [
            "work stress",
            "loneliness (weekends)",
            "environmental cue (old bar)",
          ],
          copingStrategiesDiscussed: [
            "HALT framework",
            "sponsor contact",
            "AA meetings",
          ],
          supportNetworkChanges:
            "Sponsor reconnected (1 call). 2 AA meetings attended.",
          objectivesAddressed: ["obj-1", "obj-2"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "The lonely part really hit me. Weekends are the hardest.",
            "My boss has been on my case but I can handle it.",
          ],
        },
        followUpFlags: [
          "AA attendance still below target (2 vs 3)",
          "Explore loneliness and divorce grief connection",
          "Weekend structure planning needed",
        ],
      },
      {
        id: "sess-001-3",
        sessionNumber: 5,
        date: "2026-02-17",
        rawNotes:
          "Good session. Marcus has been using the weekend planning strategy and it's helping. He went to 3 meetings last week for the first time. Sponsor relationship is strengthening — they met for coffee. We did CBT work on his trigger around work stress. Identified some cognitive distortions — catastrophizing about getting fired. He's sleeping well. Mood seems lighter. No cravings reported this week.",
        dapNote: {
          data: "Client reports successful implementation of weekend structure planning — identifies this as helpful for managing loneliness trigger. Achieved treatment plan target of 3 support group meetings for the first time. Sponsor relationship strengthening — met for coffee in person. CBT work focused on work stress trigger — identified catastrophizing pattern ('I'm definitely getting fired') as primary cognitive distortion. Reports adequate sleep and improved mood. Denies cravings this week.",
          assessment:
            "Significant positive progress across multiple domains. Weekend planning strategy is effectively addressing loneliness trigger. Support network engagement is improving (meetings target met, sponsor relationship deepening). CBT approach to work stress is appropriate — catastrophizing distortion identified and initial restructuring begun. Absence of cravings and improved mood are encouraging indicators. Client appears to be in early action stage of change.",
          plan: "1. Continue CBT work on catastrophizing — introduce thought records for work situations. 2. Reinforce weekend planning strategy — build on success. 3. Explore expanding social connections beyond AA. 4. Begin discussing longer-term relapse prevention planning. 5. Acknowledge progress explicitly to reinforce motivation.",
        },
        tags: {
          moodIndicators: ["lighter", "positive", "engaged"],
          substancesMentioned: [],
          triggersIdentified: ["work stress — catastrophizing pattern"],
          copingStrategiesDiscussed: [
            "weekend planning",
            "CBT — cognitive restructuring",
            "AA meetings",
            "sponsor relationship",
          ],
          supportNetworkChanges:
            "3 AA meetings achieved. Sponsor met in person for coffee.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "Having a plan for Saturday mornings changed everything.",
            "I know I'm not actually getting fired but my brain goes there.",
          ],
        },
        followUpFlags: [
          "Build on CBT progress — introduce thought records",
          "Explore social connections beyond recovery community",
        ],
      },
      {
        id: "sess-001-4",
        sessionNumber: 7,
        date: "2026-03-03",
        rawNotes:
          "Marcus was a bit off today. Said work has been really stressful — his team is short-staffed and he's working overtime. Missed one AA meeting last week because he was too tired. Still seeing sponsor but only texting, not meeting. Sleep has been worse — waking up at 3am and can't fall back asleep. Said he's 'fine' when I asked about mood but body language was closed off. We tried to do thought records but he wasn't very engaged. Mentioned he almost drove past the bar on purpose on Wednesday 'just to see if he could handle it.' I flagged that as a concern.",
        dapNote: {
          data: "Client presented with flattened affect and closed body language, inconsistent with verbal report of 'fine.' Reports significant work stress due to short staffing and overtime. Missed one AA meeting last week citing fatigue — attendance dropped to 2/week. Sponsor contact reduced to texting only. Reports sleep disturbance — waking at 3 AM with difficulty returning to sleep. Attempted thought record exercise but client showed low engagement. Client disclosed intentionally driving past former bar on Wednesday to 'test' himself. Describes this as a test of willpower.",
          assessment:
            "Concerning shift from previous positive trajectory. Multiple indicators suggest emerging difficulty: sleep disturbance, reduced meeting attendance, decreased sponsor contact quality, flattened affect with incongruent verbal report, and deliberate exposure to environmental trigger (bar). The 'testing' behavior is a recognized relapse warning sign. Work stress appears to be escalating beyond the 'manageable' level reported in earlier sessions. Client may be minimizing current distress level. Cognitive engagement with CBT exercises has declined.",
          plan: "1. Address the bar drive-by directly next session — explore what he was feeling before, during, and after. 2. Revisit relapse prevention plan with focus on early warning signs. 3. Assess sleep disturbance further — consider referral for sleep hygiene psychoeducation. 4. Encourage return to in-person sponsor meetings. 5. Consider discussing work-life balance strategies. 6. Monitor closely — schedule may need to increase if trajectory continues.",
        },
        tags: {
          moodIndicators: [
            "flat affect",
            "closed off",
            "minimizing",
            "fatigued",
          ],
          substancesMentioned: [],
          triggersIdentified: [
            "work stress — escalating",
            "environmental cue — deliberate exposure",
          ],
          copingStrategiesDiscussed: [
            "thought records (low engagement)",
            "AA meetings (declined to 2)",
          ],
          supportNetworkChanges:
            "AA attendance dropped to 2. Sponsor contact reduced to texting only.",
          objectivesAddressed: ["obj-1"],
          riskIndicators: [
            "Deliberate exposure to trigger (drove past bar)",
            "Sleep disturbance",
            "Affect incongruent with verbal report",
            "Declining engagement with coping strategies",
          ],
          sessionSentiment: "declining",
          keyQuotes: [
            "I'm fine, just tired.",
            "I just wanted to see if I could handle it. I drove right past.",
          ],
        },
        followUpFlags: [
          "PRIORITY: Address bar drive-by — relapse warning sign",
          "Sleep disturbance pattern emerging",
          "Re-engage with in-person sponsor meetings",
          "Consider increasing session frequency if decline continues",
        ],
      },
      {
        id: "sess-001-5",
        sessionNumber: 8,
        date: "2026-03-10",
        rawNotes:
          "Tough session. Marcus admitted the work situation has gotten worse. Got a formal written warning from his boss on Friday. Said he couldn't sleep all weekend. He went to the bar parking lot on Saturday night but says he didn't go in. Called his sponsor after and talked for 30 minutes. Went to only 1 meeting this week. He's angry — at his boss, at himself. We talked about how anger is a trigger for him and he hadn't identified that before. I'm concerned about the escalation pattern. We did a safety check — no SI, but he said 'what's the point of all this if I'm gonna lose my job anyway.' We rebuilt his crisis plan and updated his trigger list.",
        dapNote: {
          data: "Client reports significant escalation in work stress — received formal written warning from supervisor on Friday. Reports severe sleep disturbance over the weekend. Client disclosed going to bar parking lot Saturday evening but reports he did not enter. Called sponsor afterward — 30-minute conversation. AA attendance dropped to 1 meeting this week. Client presenting with notable anger directed at supervisor and self. Anger newly identified as a trigger during session. Safety assessment conducted — client denies SI/HI but made statement suggesting hopelessness: 'what's the point of all this if I'm gonna lose my job anyway.' Crisis plan reviewed and updated. Trigger list updated to include anger.",
          assessment:
            "Escalating pattern of concern continues from session 7. The progression from driving past the bar (session 7) to sitting in the parking lot (session 8) represents behavioral escalation toward relapse. However, the fact that client called his sponsor afterward demonstrates that some coping mechanisms are still engaged. Anger as a newly identified trigger is significant — it may have been an underlying factor in previous work stress episodes. The hopelessness statement, while not constituting suicidal ideation, suggests demoralization that could undermine recovery motivation. The employment threat is now the dominant stressor and is directly impacting all recovery domains: sleep, meeting attendance, mood, and trigger exposure.",
          plan: "1. Explore anger management techniques — consider introducing DBT distress tolerance skills. 2. Strengthen crisis plan — add specific steps for when he feels the urge to go to the bar. 3. Discuss the employment situation practically — what are realistic outcomes and contingency plans. 4. Reinforce the positive: he called his sponsor from the parking lot. That's recovery working. 5. Consider increasing session frequency to 2x/week during this crisis period. 6. Consult with supervisor about this case.",
        },
        tags: {
          moodIndicators: ["angry", "frustrated", "hopeless undertone", "distressed"],
          substancesMentioned: ["alcohol — proximity to bar"],
          triggersIdentified: [
            "work stress — written warning",
            "anger (newly identified)",
            "environmental cue — went to bar parking lot",
          ],
          copingStrategiesDiscussed: [
            "sponsor call (30 min — positive)",
            "crisis plan review",
          ],
          supportNetworkChanges:
            "AA attendance dropped to 1. Sponsor contact meaningful (30 min call in crisis moment).",
          objectivesAddressed: ["obj-1", "obj-3"],
          riskIndicators: [
            "Went to bar parking lot — escalation from session 7",
            "Hopelessness statement re: employment",
            "AA attendance at lowest point (1 meeting)",
            "Severe sleep disturbance",
          ],
          sessionSentiment: "concerning",
          keyQuotes: [
            "I sat in the parking lot for 20 minutes. I didn't go in.",
            "What's the point of all this if I'm gonna lose my job anyway.",
            "I called my sponsor right there from the car.",
          ],
        },
        followUpFlags: [
          "URGENT: Escalating proximity to relapse — parking lot visit",
          "Introduce anger management / distress tolerance skills",
          "Consider increasing session frequency to 2x/week",
          "Discuss with clinical supervisor",
          "Reinforce sponsor call as evidence that recovery tools work",
        ],
      },
      {
        id: "sess-001-6",
        sessionNumber: 9,
        date: "2026-03-17",
        rawNotes:
          "Scheduled extra session this week. Marcus came in calmer than expected. Said the sponsor talk really helped and they've been talking every day since. Went to 2 meetings this week — not 3 but better than last week. Sleep is still rough but he's trying melatonin. The work situation is still bad but he's decided to start looking for other warehouse jobs rather than just spiraling about it. We introduced DBT distress tolerance — TIPP technique. He said the cold water on the face thing actually worked when he felt the urge on Wednesday. We talked about anger as a trigger more — connected it back to the divorce. He got emotional. Overall I feel cautiously better about this week but he's still fragile.",
        dapNote: {
          data: "Client presented for additional mid-week session. Affect calmer than previous session. Reports daily phone contact with sponsor since the parking lot incident. AA attendance improved to 2 meetings this week. Sleep disturbance continues — client trying melatonin (OTC). Client reports shift in coping with employment stress — transitioning from catastrophizing to active problem-solving (job search). DBT distress tolerance skills introduced — TIPP technique. Client reports successful use of cold water technique to manage urge on Wednesday. Deeper exploration of anger trigger — client connected anger to unresolved feelings about divorce. Client became emotional during this exploration. Counselor assessment: cautious improvement but client remains in a fragile state.",
          assessment:
            "Encouraging stabilization following crisis escalation. Daily sponsor contact represents the strongest support network engagement since treatment began. The shift from catastrophizing about job loss to proactive job searching is a meaningful cognitive change. Successful implementation of TIPP technique demonstrates receptivity to new coping strategies. The emotional connection between anger and divorce grief suggests deeper therapeutic work may be needed — this could be a significant underlying factor. However, client remains fragile — sleep disruption continues, meeting attendance is below target, and the employment stressor is unresolved.",
          plan: "1. Continue DBT distress tolerance skills — practice TIPP and add STOP technique. 2. Begin exploring divorce grief as underlying factor in anger trigger — proceed carefully. 3. Support job search process — consider as therapeutic activity (agency, self-efficacy). 4. Monitor sleep — if melatonin insufficient, discuss with prescriber. 5. Maintain increased session frequency for at least 2 more weeks. 6. Reinforce daily sponsor contact — this is a major strength right now.",
        },
        tags: {
          moodIndicators: ["calmer", "emotional", "fragile but improving"],
          substancesMentioned: [],
          triggersIdentified: [
            "anger — connected to divorce grief",
            "work stress — ongoing but coping shifting",
          ],
          copingStrategiesDiscussed: [
            "DBT — TIPP technique (successful)",
            "daily sponsor calls",
            "proactive job searching",
            "melatonin for sleep",
          ],
          supportNetworkChanges:
            "Daily sponsor contact — strongest engagement yet. AA at 2 meetings.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3"],
          riskIndicators: [
            "Sleep disturbance continues",
            "Employment situation unresolved",
            "Emotional fragility despite improvement",
          ],
          sessionSentiment: "cautiously-improving",
          keyQuotes: [
            "He's been calling me every day. I didn't realize how much I needed that.",
            "I put cold water on my face and the urge just... went down. It was weird but it worked.",
            "I think the anger about work isn't really about work.",
          ],
        },
        followUpFlags: [
          "Continue increased session frequency (2x/week)",
          "Divorce grief exploration — proceed carefully, monitor emotional tolerance",
          "Monitor sleep — may need prescriber consultation",
          "Support job search as therapeutic activity",
        ],
      },
    ],
  },

  {
    id: "client-002",
    name: "Sarah Mitchell",
    age: 28,
    gender: "Female",
    diagnosis: "Opioid Use Disorder (Severe)",
    coOccurring: "Generalized Anxiety Disorder",
    programType: "Outpatient + MAT",
    admissionDate: "2025-12-28",
    programDay: 90,
    mat: "Suboxone 8mg/day",
    insurance: "Medicaid",
    emergencyContact: "Rachel Mitchell (Sister) — (812) 555-0293",
    treatmentPlan: {
      objectives: [
        {
          id: "obj-1",
          description:
            "Maintain MAT adherence and attend all prescriber appointments",
          status: "on-track",
          targetDate: "2026-06-01",
        },
        {
          id: "obj-2",
          description:
            "Develop anxiety management skills without substance use",
          status: "on-track",
          targetDate: "2026-04-15",
        },
        {
          id: "obj-3",
          description: "Build stable daily routine including employment",
          status: "in-progress",
          targetDate: "2026-05-01",
        },
        {
          id: "obj-4",
          description: "Repair relationship with sister and establish sober support network",
          status: "on-track",
          targetDate: "2026-05-15",
        },
      ],
    },
    riskLevel: "low",
    sessions: [
      {
        id: "sess-002-1",
        sessionNumber: 4,
        date: "2026-01-20",
        rawNotes:
          "Sarah is doing well. Suboxone adherence is 100%. She's been using the breathing exercises we taught for anxiety and says they help at night. Started a part-time job at a bookstore last week — she's nervous but excited. Sister is coming to family session next week. No cravings reported. She's attending NA twice a week and found a women's meeting she likes.",
        dapNote: {
          data: "Client reports 100% MAT adherence (Suboxone 8mg/day). Successfully implementing breathing exercises for nighttime anxiety management. Began part-time employment at bookstore within the past week — reports mixed feelings of nervousness and excitement. Sister confirmed for family session next week. Denies cravings. Attending NA 2x/week and has identified a preferred women's meeting.",
          assessment:
            "Client demonstrating consistent positive trajectory across all treatment domains. MAT adherence is strong. Anxiety management skills being applied independently and effectively. Employment initiation represents meaningful progress toward daily structure objective. Support network expanding appropriately (sister engagement, NA women's group). Absence of cravings at day 90 with MAT support is encouraging.",
          plan: "1. Prepare for family session with sister — set goals and boundaries. 2. Monitor job adjustment — watch for anxiety escalation in new environment. 3. Encourage continued NA attendance — consider increasing to 3x/week. 4. Introduce grounding techniques as additional anxiety tool for workplace. 5. Celebrate 90-day milestone next session.",
        },
        tags: {
          moodIndicators: ["positive", "nervous", "excited"],
          substancesMentioned: [],
          triggersIdentified: [
            "new situations (job)",
            "nighttime anxiety",
          ],
          copingStrategiesDiscussed: [
            "breathing exercises (effective)",
            "NA meetings — women's group",
          ],
          supportNetworkChanges:
            "Started part-time job. Sister attending family session. Found women's NA meeting.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "The breathing thing actually works. I used it three nights this week.",
            "I'm scared about the job but I need to feel normal again.",
          ],
        },
        followUpFlags: [
          "Prep for family session with sister",
          "Monitor anxiety in new work environment",
        ],
      },
      {
        id: "sess-002-2",
        sessionNumber: 6,
        date: "2026-02-03",
        rawNotes:
          "Great family session with Sarah and her sister Rachel. A lot of tears but productive. Rachel expressed how scared she was during Sarah's active use. Sarah was able to hear it without getting defensive — big growth. They agreed on boundaries around communication — Rachel won't 'check up' on Sarah constantly, Sarah will call Rachel once a week minimum. Job is going well — manager praised her reliability. Anxiety still present but she's managing it. Suboxone adherence continues 100%.",
        dapNote: {
          data: "Family session conducted with client and sister Rachel. Emotionally productive — both expressed feelings regarding client's active use period. Client demonstrated ability to receive sister's fear and pain without defensiveness. Established communication boundaries: sister will reduce frequency of check-ins, client commits to minimum weekly call. Employment continues positively — received manager recognition for reliability. Anxiety present but managed with established techniques. MAT adherence 100%.",
          assessment:
            "Family session represents significant therapeutic milestone. Client's ability to tolerate sister's emotional expression without defensiveness indicates growth in emotional regulation and reduced shame. Mutually agreed boundaries demonstrate healthy relationship repair. Employment stability is reinforcing daily structure and self-efficacy. Overall trajectory remains strongly positive.",
          plan: "1. Process family session content — check in on emotional response post-session. 2. Reinforce the communication boundary agreement. 3. Continue anxiety management skills building. 4. Begin discussing long-term recovery planning — what does life look like at 6 months, 1 year. 5. Maintain current session frequency.",
        },
        tags: {
          moodIndicators: ["emotional", "open", "growth-oriented"],
          substancesMentioned: [],
          triggersIdentified: [],
          copingStrategiesDiscussed: [
            "family boundary setting",
            "emotional tolerance",
          ],
          supportNetworkChanges:
            "Major: Family session completed. Communication boundaries established with sister. Manager recognition at work.",
          objectivesAddressed: ["obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "I could hear her this time. Before I would have just shut down.",
            "She's not checking up on me, she's just scared. I get that now.",
          ],
        },
        followUpFlags: [
          "Process emotional impact of family session",
          "Begin long-term recovery planning",
        ],
      },
      {
        id: "sess-002-3",
        sessionNumber: 8,
        date: "2026-02-17",
        rawNotes:
          "Sarah is having a good week. Hit 60 days at work — she's proud. Anxiety is less frequent, maybe 2-3 times a week instead of daily. Weekly calls with Rachel are happening. She brought up wanting to go back to community college in the fall — used to study graphic design before things fell apart. We talked about that as a recovery goal. NA attendance steady at 2x/week. She's made a friend in the women's group named Kesha. Suboxone still 100%. No cravings.",
        dapNote: {
          data: "Client reports 60 days of continuous employment — identifies this as source of pride. Anxiety frequency reduced from daily to 2-3 times per week. Weekly communication with sister maintained per agreement. Client expressed interest in returning to community college for graphic design — previous academic pursuit prior to substance use. NA attendance stable at 2x/week. Client developing new social connection through women's NA group (Kesha). MAT adherence 100%. Denies cravings.",
          assessment:
            "Broad-based, sustained improvement continues. Anxiety reduction suggests effective skill application and possibly stabilizing effect of routine and social connection. Expressed interest in returning to education is a significant indicator of future orientation and identity reconstruction beyond 'person in recovery.' New friendship through NA represents organic support network expansion. Client is demonstrating the building blocks of a sustainable recovery.",
          plan: "1. Explore community college timeline and practical steps — could be a powerful recovery milestone. 2. Continue supporting anxiety management — frequency reduction is encouraging. 3. Encourage the Kesha friendship — peer support is critical. 4. Begin thinking about MAT timeline with prescriber — not reducing yet, but planning. 5. Consider transitioning to less intensive session frequency if progress maintains.",
        },
        tags: {
          moodIndicators: ["proud", "hopeful", "stable"],
          substancesMentioned: [],
          triggersIdentified: [],
          copingStrategiesDiscussed: [
            "breathing exercises",
            "structured routine",
            "NA attendance",
            "peer support",
          ],
          supportNetworkChanges:
            "New friend (Kesha) from NA. Sister calls maintained. Employment stable 60 days.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "Sixty days. I've never held a job that long in the last 3 years.",
            "I used to love graphic design. I forgot I used to be that person.",
          ],
        },
        followUpFlags: [
          "Support community college exploration",
          "Assess readiness for reduced session frequency",
        ],
      },
      {
        id: "sess-002-4",
        sessionNumber: 10,
        date: "2026-03-03",
        rawNotes:
          "Sarah is doing well. She looked into the community college — enrollment is in June, she wants to take 2 classes in the fall. Still working at the bookstore, her manager mentioned making her full-time. Anxiety is manageable — she had a panic attack on the bus last week but used her grounding technique and got through it without leaving. That's huge for her. Still seeing Kesha regularly. Rachel relationship is good. Suboxone stable. We talked about what it means to build a life in recovery — she got emotional and said 'I actually want things now.' Beautiful session.",
        dapNote: {
          data: "Client researched community college enrollment — plans to take 2 graphic design classes starting fall semester. Employment progressing — manager discussed potential full-time promotion. Client experienced panic attack on public transit but successfully employed grounding technique without avoidance behavior — identified as significant milestone. Continued social connection with NA peer. Sister relationship described as 'good.' MAT adherence 100%. Client emotional when discussing building a meaningful life — expressed renewed sense of desire and future orientation.",
          assessment:
            "Client is solidly in the maintenance/growth phase of recovery. The panic attack management without avoidance is a critical milestone — demonstrates internalized coping capacity. Future planning (education, career advancement) reflects identity expansion beyond recovery. Emotional response to life-building conversation suggests genuine intrinsic motivation has developed. Recommend considering step-down in treatment intensity.",
          plan: "1. Support college enrollment planning — practical steps and timeline. 2. Discuss full-time work implications for treatment schedule. 3. Begin formally planning treatment step-down — transition to standard outpatient. 4. Develop long-term relapse prevention plan. 5. Celebrate progress — client has earned recognition of how far she's come.",
        },
        tags: {
          moodIndicators: ["hopeful", "emotional", "motivated", "proud"],
          substancesMentioned: [],
          triggersIdentified: [
            "public transit — managed successfully",
          ],
          copingStrategiesDiscussed: [
            "grounding technique (used successfully in crisis)",
            "future planning",
            "peer support",
          ],
          supportNetworkChanges:
            "Employment may increase to full-time. College plan forming. Friendships stable.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "I had a panic attack on the bus and I didn't run. I just breathed.",
            "I actually want things now. I haven't wanted things in years.",
          ],
        },
        followUpFlags: [
          "Begin treatment step-down planning",
          "Support college enrollment process",
          "Develop long-term relapse prevention plan",
        ],
      },
    ],
  },

  {
    id: "client-003",
    name: "David Reeves",
    age: 45,
    gender: "Male",
    diagnosis: "Cocaine Use Disorder (Severe)",
    coOccurring: null,
    programType: "Outpatient",
    admissionDate: "2025-11-27",
    programDay: 121,
    mat: null,
    insurance: "Employer-provided (UnitedHealthcare)",
    emergencyContact: "Patricia Reeves (Wife) — (812) 555-0388",
    treatmentPlan: {
      objectives: [
        {
          id: "obj-1",
          description: "Maintain complete abstinence from cocaine and all substances",
          status: "on-track",
          targetDate: "2026-06-01",
        },
        {
          id: "obj-2",
          description:
            "Identify and interrupt the binge cycle pattern",
          status: "plateau",
          targetDate: "2026-03-15",
        },
        {
          id: "obj-3",
          description: "Rebuild trust with wife and children",
          status: "in-progress",
          targetDate: "2026-06-01",
        },
        {
          id: "obj-4",
          description:
            "Develop healthy stress management for high-pressure work environment",
          status: "plateau",
          targetDate: "2026-04-01",
        },
      ],
    },
    riskLevel: "moderate",
    sessions: [
      {
        id: "sess-003-1",
        sessionNumber: 6,
        date: "2026-01-15",
        rawNotes:
          "David is maintaining sobriety — 49 days clean. He's a finance guy, VP at a regional bank. Cocaine use was weekend binges, usually after stressful weeks. Wife found out 6 months ago and gave him an ultimatum. He's motivated but I notice he treats recovery like a work project — all logic, no emotion. We've been doing motivational interviewing to connect him to the emotional side but it's slow. He says all the right things but I'm not sure he feels them. He goes to NA but admits he 'doesn't connect' with the other members. Marriage counseling with wife is going okay.",
        dapNote: {
          data: "Client maintains 49 days abstinence from cocaine. Employment stable as VP at regional bank. Historical pattern: weekend cocaine binges following high-stress work weeks. Wife's discovery 6 months ago and subsequent ultimatum identified as primary treatment motivator. Client demonstrates intellectual engagement with recovery concepts but limited emotional connection. Motivational interviewing techniques yielding slow progress on emotional engagement. NA attendance maintained but client reports difficulty connecting with peers. Couples counseling ongoing.",
          assessment:
            "Client presents with a characteristic intellectualized approach to recovery — common in high-functioning professionals. While sobriety is maintained and external compliance is strong, the disconnect between intellectual understanding and emotional engagement is a therapeutic concern. Inability to connect with NA peers may reflect avoidance of vulnerability or perceived status differences. Motivation remains primarily external (wife's ultimatum) rather than internalized. This pattern can sustain short-term sobriety but is a risk factor for long-term recovery.",
          plan: "1. Continue MI — explore what recovery means beyond 'keeping my marriage.' 2. Consider alternative peer support — SMART Recovery may be a better fit than NA for this client. 3. Introduce experiential techniques to bypass intellectualization. 4. Explore the function cocaine served — what need was it meeting? 5. Support couples counseling progress.",
        },
        tags: {
          moodIndicators: ["controlled", "intellectual", "guarded emotionally"],
          substancesMentioned: ["cocaine — historical pattern discussed"],
          triggersIdentified: [
            "work stress — weekly cycle",
            "weekend unstructured time",
          ],
          copingStrategiesDiscussed: [
            "MI — emotional engagement",
            "NA (limited connection)",
            "couples counseling",
          ],
          supportNetworkChanges: "Wife engaged in couples counseling. NA attendance but no connection.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-4"],
          riskIndicators: [
            "Motivation primarily external",
            "Limited emotional engagement with recovery",
            "Difficulty connecting with peer support",
          ],
          sessionSentiment: "stable",
          keyQuotes: [
            "I'm doing everything on the list. What else do you need?",
            "I go to the meetings but those people aren't like me.",
          ],
        },
        followUpFlags: [
          "Explore alternative peer support (SMART Recovery)",
          "Address intellectualization pattern gently",
          "Explore the function of cocaine use",
        ],
      },
      {
        id: "sess-003-2",
        sessionNumber: 9,
        date: "2026-02-05",
        rawNotes:
          "Not much has changed with David and that's actually the problem. He's clean, going to meetings, doing couples therapy, says everything is fine. But we're stuck. He still can't tell me what cocaine did for him emotionally. He gets uncomfortable every time I push below the surface. Tried an exercise where I asked him to describe how he felt on a Friday night before using — he said 'I don't know, I just did it.' I'm starting to think there's something deeper — maybe the pressure of performing all the time, never being allowed to be anything other than competent. He mentioned his father was 'old school — you don't talk about feelings.' That felt like a door opening but he shut it down quickly.",
        dapNote: {
          data: "Client maintains sobriety and external compliance. Reports 'everything is fine.' Therapeutic exploration of the emotional function of cocaine use continues to meet resistance — client unable or unwilling to articulate emotional experience preceding use. When asked to describe Friday night feelings, client responded 'I don't know, I just did it.' Client briefly referenced father's emotional restrictiveness ('old school — you don't talk about feelings') but quickly redirected away from topic. Couples therapy and meeting attendance continue unchanged.",
          assessment:
            "Treatment has reached a plateau. Client is maintaining behavioral compliance but therapeutic depth is stalled. The inability to access emotional drivers of use is a significant barrier to sustainable recovery. Brief reference to father's emotional restrictiveness suggests potential intergenerational pattern of emotional suppression that may be core to the clinical picture. This client may benefit from a shift in therapeutic approach — the current MI framework may have reached its ceiling without addressing the underlying avoidant pattern.",
          plan: "1. Consider introducing ACT (Acceptance and Commitment Therapy) concepts — may help with emotional avoidance without requiring direct emotional processing initially. 2. Gently explore father relationship in future sessions — don't push, but leave the door open. 3. Introduce the concept of 'high-functioning' as its own risk factor. 4. SMART Recovery referral — structured, cognitive approach may provide entry point. 5. Discuss treatment plateau openly with client — enlist him in problem-solving.",
        },
        tags: {
          moodIndicators: ["flat", "controlled", "avoidant"],
          substancesMentioned: [],
          triggersIdentified: [
            "performance pressure (ongoing)",
            "emotional suppression pattern",
          ],
          copingStrategiesDiscussed: [
            "MI — reaching ceiling",
            "meetings (no change in engagement)",
          ],
          supportNetworkChanges: "No change from previous session.",
          objectivesAddressed: ["obj-2"],
          riskIndicators: [
            "Treatment plateau — behavioral compliance without emotional engagement",
            "Inability to access emotional function of use",
            "Intergenerational emotional suppression pattern identified",
          ],
          sessionSentiment: "stable",
          keyQuotes: [
            "I don't know, I just did it.",
            "My dad was old school. You don't talk about feelings in our house.",
          ],
        },
        followUpFlags: [
          "Consider shifting to ACT-based approach",
          "Treatment plateau — discuss openly with client",
          "Father relationship — leave door open, don't push",
          "SMART Recovery referral",
        ],
      },
      {
        id: "sess-003-3",
        sessionNumber: 11,
        date: "2026-02-19",
        rawNotes:
          "Made a decision to try something different with David. Talked to him directly about the plateau — that he's doing all the right things but we're stuck, and asked him what he thought about that. He actually appreciated the honesty. Said 'yeah, I know I'm going through the motions.' I introduced ACT concepts — values-based living vs. rule-following. Did a values card sort exercise. He got really engaged with it — more than I've seen before. His top values were family, integrity, and competence. When I asked if cocaine was consistent with those values he got quiet and then said 'no, it's the opposite of all of them.' That was the most genuine moment we've had. I think we might have found the way in.",
        dapNote: {
          data: "Treatment plateau addressed directly with client — counselor named the stagnation pattern and invited client's perspective. Client acknowledged 'going through the motions.' Therapeutic approach shifted: introduced Acceptance and Commitment Therapy (ACT) framework. Values card sort exercise conducted — client identified family, integrity, and competence as core values. Client demonstrated notable engagement with exercise — highest observed engagement level. When asked to evaluate cocaine use against stated values, client paused and responded 'no, it's the opposite of all of them.' Counselor notes this as the most emotionally genuine therapeutic moment to date.",
          assessment:
            "Significant therapeutic breakthrough. The direct conversation about treatment plateau was well-received — client appears to respect directness. The ACT values-based approach appears to be more effective than MI for this client, likely because it leverages his cognitive strengths while creating a bridge to emotional content. The values identification and the genuine recognition of incongruence between values and cocaine use represents a meaningful shift from intellectualized compliance to emerging authentic engagement. This may represent the beginning of internalized motivation.",
          plan: "1. Build on ACT values work — develop committed action plans aligned with family, integrity, competence. 2. Use values as touchstone when exploring emotional function of use in future sessions. 3. Continue values exploration — what does 'living with integrity' look like in recovery specifically? 4. Consider whether couples therapy could incorporate values work. 5. Maintain momentum — this breakthrough needs reinforcement.",
        },
        tags: {
          moodIndicators: ["surprised", "reflective", "genuine", "engaged"],
          substancesMentioned: [
            "cocaine — discussed in context of values conflict",
          ],
          triggersIdentified: [],
          copingStrategiesDiscussed: [
            "ACT — values card sort (strong engagement)",
            "direct plateau conversation",
          ],
          supportNetworkChanges: "No change.",
          objectivesAddressed: ["obj-2", "obj-3"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "Yeah, I know I'm going through the motions.",
            "No, it's the opposite of all of them.",
          ],
        },
        followUpFlags: [
          "Build on ACT values work — committed action plans",
          "Integrate values into couples therapy if appropriate",
          "Maintain therapeutic momentum from breakthrough",
        ],
      },
      {
        id: "sess-003-4",
        sessionNumber: 13,
        date: "2026-03-05",
        rawNotes:
          "David came in and told me he tried SMART Recovery last week. He liked it better than NA — said it felt more practical and less 'spiritual.' He related to several other professionals in the group. Good sign. We continued the ACT work — focused on what 'being a man of integrity' looks like day to day. He said he realized he's been hiding behind competence his whole life — being good at things so no one asks how he's feeling. That's big. He connected it to his marriage — says he's been reliable but not emotionally available to Patricia. Couples counselor apparently said something similar. He wants to work on being more open with her. Still clean, 98 days.",
        dapNote: {
          data: "Client attended SMART Recovery meeting — reports preference over NA due to practical approach and connection with other professionals in attendance. ACT values work continued — focused on operationalizing 'integrity' value in daily life. Client achieved significant insight: identified pattern of using competence as shield against emotional vulnerability. Connected this pattern to marriage — recognizes he has been 'reliable but not emotionally available' to wife. Reports couples counselor offered consistent observation. Client expresses motivation to increase emotional openness with wife. Maintains 98 days sobriety.",
          assessment:
            "Therapeutic momentum building from session 11 breakthrough. SMART Recovery appears to be a better peer support fit — client connecting with others who share similar backgrounds. The insight about competence as emotional avoidance strategy is clinically significant and represents deepening self-awareness. The convergence of this insight with couples therapy feedback strengthens its impact. Client is beginning to develop a coherent narrative connecting emotional avoidance, cocaine use, and relational patterns. This narrative understanding is essential for sustainable recovery.",
          plan: "1. Support SMART Recovery engagement — this is filling the peer support gap. 2. Continue ACT — move toward committed actions around emotional openness with wife. 3. Explore competence-as-shield pattern — how does it show up at work? 4. Coordinate with couples counselor if appropriate. 5. Prepare for 100-day milestone — use it as values reflection point.",
        },
        tags: {
          moodIndicators: ["insightful", "open", "motivated", "vulnerable"],
          substancesMentioned: [],
          triggersIdentified: [
            "emotional avoidance — using competence as shield",
          ],
          copingStrategiesDiscussed: [
            "SMART Recovery (good fit)",
            "ACT — values operationalization",
            "emotional openness practice",
          ],
          supportNetworkChanges:
            "SMART Recovery connection — positive. Couples therapy aligning with individual work.",
          objectivesAddressed: ["obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "improving",
          keyQuotes: [
            "I've been hiding behind being good at things so no one asks how I'm doing.",
            "Patricia deserves more than a reliable roommate.",
          ],
        },
        followUpFlags: [
          "Continue ACT — committed actions around emotional openness",
          "Coordinate with couples counselor",
          "100-day milestone reflection",
        ],
      },
    ],
  },

  {
    id: "client-004",
    name: "Aisha Torres",
    age: 22,
    gender: "Female",
    diagnosis: "Polysubstance Use Disorder (Alcohol, Cannabis)",
    coOccurring: "Post-Traumatic Stress Disorder (PTSD)",
    programType: "Intensive Outpatient (IOP)",
    admissionDate: "2026-02-26",
    programDay: 30,
    mat: null,
    insurance: "Medicaid",
    emergencyContact: "Maria Torres (Aunt) — (812) 555-0519",
    treatmentPlan: {
      objectives: [
        {
          id: "obj-1",
          description: "Achieve and maintain abstinence from alcohol and cannabis",
          status: "in-progress",
          targetDate: "2026-05-01",
        },
        {
          id: "obj-2",
          description:
            "Develop trauma-informed coping skills to replace substance use",
          status: "in-progress",
          targetDate: "2026-06-01",
        },
        {
          id: "obj-3",
          description: "Secure stable housing",
          status: "at-risk",
          targetDate: "2026-04-15",
        },
        {
          id: "obj-4",
          description:
            "Establish safety plan for PTSD flashback episodes",
          status: "in-progress",
          targetDate: "2026-03-30",
        },
      ],
    },
    riskLevel: "high",
    sessions: [
      {
        id: "sess-004-1",
        sessionNumber: 1,
        date: "2026-02-27",
        rawNotes:
          "First session with Aisha. She's 22, referred from the ER after a panic attack that she thought was a heart attack. Uses alcohol and cannabis to manage PTSD symptoms — trauma history involves domestic violence from a former partner, about 2 years ago. She's been couch-surfing with friends and her aunt Maria. No stable housing. She's wary of therapy — says she tried it once before and the therapist pushed her to talk about the trauma too fast. I assured her we'd go at her pace. She's smart and articulate when she feels safe. Started with grounding techniques — 5-4-3-2-1 sensory exercise. She was receptive. No SI/HI.",
        dapNote: {
          data: "Client presenting for initial IOP session following ER referral for panic attack (r/o cardiac — cleared medically). Reports polysubstance use (alcohol and cannabis) as PTSD symptom management. Trauma history: domestic violence from former partner approximately 2 years ago. Currently without stable housing — rotating between friends and aunt (Maria). Previous therapy experience described as negative — felt pressured to process trauma prematurely. Client expressed wariness about therapy. Grounding technique introduced (5-4-3-2-1 sensory exercise) — client receptive. Client presents as intelligent and articulate when rapport is established. Denies SI/HI.",
          assessment:
            "Client presents with a complex clinical picture: polysubstance use as self-medication for PTSD symptoms, housing instability, and therapy wariness from previous negative experience. Establishing trust and pacing will be critical — previous therapeutic rupture around trauma processing speed is a significant consideration. The ER panic attack may represent escalating PTSD symptoms that are overwhelming current coping capacity (substance use). Housing instability adds compounding stress. Strengths: self-awareness, intelligence, willingness to try grounding techniques, has at least one family support (aunt).",
          plan: "1. Prioritize rapport building — let client set the pace. 2. Focus on stabilization before any trauma processing (safety-first model). 3. Continue grounding techniques — build a toolkit of 3-4 options. 4. Assess housing situation — connect with case manager for housing resources. 5. Psychoeducation on PTSD and the substance use connection — normalize her experience. 6. Establish safety plan for flashback episodes.",
        },
        tags: {
          moodIndicators: ["wary", "guarded", "receptive when safe"],
          substancesMentioned: ["alcohol", "cannabis"],
          triggersIdentified: [
            "PTSD flashbacks",
            "housing instability",
            "feeling unsafe",
          ],
          copingStrategiesDiscussed: [
            "5-4-3-2-1 grounding (introduced, receptive)",
          ],
          supportNetworkChanges: "Aunt Maria identified as support. No peer support yet.",
          objectivesAddressed: ["obj-2", "obj-4"],
          riskIndicators: [
            "Housing instability",
            "PTSD symptoms escalating (ER visit)",
            "Substance use as primary coping mechanism",
            "Previous negative therapy experience",
          ],
          sessionSentiment: "cautiously-stable",
          keyQuotes: [
            "The last therapist wanted me to talk about it right away. I couldn't.",
            "I just need something to stop the noise in my head.",
          ],
        },
        followUpFlags: [
          "Housing — connect with case manager immediately",
          "Build grounding toolkit before any trauma processing",
          "Go at client's pace — do not repeat previous therapy mistake",
        ],
      },
      {
        id: "sess-004-2",
        sessionNumber: 3,
        date: "2026-03-06",
        rawNotes:
          "Aisha is settling in a little. She said the grounding exercise helped during a flashback on Tuesday — she was on the bus and something triggered her but she did the 5-4-3-2-1 and it 'turned the volume down.' That's her language. We added two more techniques — butterfly tapping and container visualization. She liked the container one. Housing update: case manager found a spot in a transitional living program but there's a 2 week wait. She's staying with her aunt for now. She's been sober for 8 days — says the cravings are worst at night. We're not touching the trauma yet. Building trust.",
        dapNote: {
          data: "Client reports successful use of 5-4-3-2-1 grounding during a flashback episode on public transit — describes effect as 'turning the volume down.' Two additional grounding techniques introduced: butterfly tapping and container visualization. Client preferred container visualization. Housing update: transitional living program placement identified with 2-week waitlist. Currently stable with aunt. Client reports 8 days sobriety. Identifies nighttime as peak craving period. No trauma processing initiated — continuing stabilization phase.",
          assessment:
            "Encouraging early progress. Successful independent use of grounding technique during a real flashback episode is a meaningful milestone — it indicates skill transfer beyond the therapy room. Client's metaphor ('volume down') suggests she's developing a functional framework for managing PTSD symptoms. Two-week housing wait adds temporary stress but the transitional living placement is a positive step. Nighttime cravings are consistent with PTSD pattern — likely linked to hyperarousal and sleep disturbance. Building trust remains the priority.",
          plan: "1. Practice and reinforce grounding toolkit — aim for client to have 3-4 reliable techniques. 2. Address nighttime cravings — explore sleep hygiene and bedtime grounding routine. 3. Follow up on housing — support transition to TLP when available. 4. Continue building therapeutic rapport. 5. Introduce psychoeducation about PTSD when client is ready. 6. Begin developing the flashback safety plan (obj-4).",
        },
        tags: {
          moodIndicators: ["slightly more open", "engaged", "cautious"],
          substancesMentioned: ["alcohol — cravings at night", "cannabis — cravings at night"],
          triggersIdentified: [
            "PTSD flashback — bus trigger",
            "nighttime — peak craving time",
          ],
          copingStrategiesDiscussed: [
            "5-4-3-2-1 grounding (used independently — success)",
            "butterfly tapping (introduced)",
            "container visualization (preferred)",
          ],
          supportNetworkChanges: "Staying with aunt. Transitional housing in 2-week queue.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [
            "Housing still unstable (2-week wait)",
            "Nighttime cravings",
            "PTSD flashbacks continuing",
          ],
          sessionSentiment: "cautiously-improving",
          keyQuotes: [
            "It turned the volume down. It didn't make it go away but I could function.",
            "Nighttime is the worst. That's when my brain won't shut up.",
          ],
        },
        followUpFlags: [
          "Develop nighttime coping routine",
          "Follow up on transitional housing placement",
          "Begin flashback safety plan",
        ],
      },
      {
        id: "sess-004-3",
        sessionNumber: 5,
        date: "2026-03-20",
        rawNotes:
          "Good news and hard news. Good: Aisha moved into the transitional living program last week. She has her own room for the first time in months. She cried when she talked about it. Bad: the stability seems to have let the PTSD symptoms come forward. She's having more flashbacks now, not fewer. She said 'when I was running around trying to find a place to sleep I didn't have time to think. Now I have time and it's all coming up.' That makes clinical sense — stabilization can surface suppressed trauma. We completed her flashback safety plan. She's 22 days sober. She asked me if she'll ever feel normal. We talked about what healing looks like — not the absence of pain but learning to carry it differently.",
        dapNote: {
          data: "Client transitioned into transitional living program — first stable housing in months. Emotional response to having own room (tearful, relieved). Reports increase in PTSD flashback frequency since housing stabilization. Client identifies the connection: 'when I was running around trying to find a place to sleep I didn't have time to think. Now I have time and it's all coming up.' Flashback safety plan completed. Client maintains 22 days sobriety. Client asked 'will I ever feel normal?' — discussed healing as a process of learning to carry pain differently rather than eliminating it.",
          assessment:
            "The increase in PTSD symptoms following housing stabilization is a clinically expected phenomenon — when survival-level stressors reduce, the nervous system can begin processing previously suppressed trauma. This is actually a sign of progress, though it doesn't feel like it to the client. The client's own insight about this connection demonstrates strong self-awareness. The question about normalcy suggests she may be approaching readiness for more active (but still gentle) trauma processing. Sobriety maintained through this difficult period is encouraging. Safety plan completion addresses a key treatment objective.",
          plan: "1. Normalize the increase in symptoms — psychoeducation about stabilization surfacing trauma. 2. Assess readiness for gentle trauma processing — not yet, but possibly in 2-4 weeks. 3. Reinforce grounding toolkit — she'll need it more now. 4. Monitor substance use closely — increased PTSD symptoms are a relapse risk. 5. Support adjustment to transitional living — new environment, new stressors. 6. Consider trauma-specific modality introduction (PE or CPT) when ready.",
        },
        tags: {
          moodIndicators: ["emotional", "relieved", "overwhelmed", "questioning"],
          substancesMentioned: [],
          triggersIdentified: [
            "stability paradox — safety surfacing trauma",
            "unstructured time / quiet",
          ],
          copingStrategiesDiscussed: [
            "flashback safety plan (completed)",
            "grounding toolkit",
            "psychoeducation on healing",
          ],
          supportNetworkChanges:
            "Major: Moved into transitional living program. Own room. New stable environment.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [
            "PTSD symptoms increasing",
            "Relapse risk elevated due to symptom increase",
            "Emotional overwhelm in new stable environment",
          ],
          sessionSentiment: "mixed",
          keyQuotes: [
            "When I was running around I didn't have time to think. Now I have time and it's all coming up.",
            "Will I ever feel normal?",
          ],
        },
        followUpFlags: [
          "Monitor substance use closely — PTSD escalation is relapse risk",
          "Assess readiness for trauma processing in 2-4 weeks",
          "Support transitional living adjustment",
          "Reinforce grounding toolkit — increased need expected",
        ],
      },
    ],
  },

  {
    id: "client-005",
    name: "James Kim",
    age: 55,
    gender: "Male",
    diagnosis: "Alcohol Use Disorder (Mild)",
    coOccurring: null,
    programType: "Outpatient",
    admissionDate: "2025-09-15",
    programDay: 194,
    mat: null,
    insurance: "Medicare",
    emergencyContact: "Helen Kim (Wife) — (812) 555-0672",
    treatmentPlan: {
      objectives: [
        {
          id: "obj-1",
          description: "Maintain sobriety and manage occasional cravings",
          status: "on-track",
          targetDate: "2026-06-01",
        },
        {
          id: "obj-2",
          description: "Develop retirement transition plan that supports recovery",
          status: "on-track",
          targetDate: "2026-04-01",
        },
        {
          id: "obj-3",
          description: "Strengthen marriage and family relationships",
          status: "on-track",
          targetDate: "2026-05-01",
        },
        {
          id: "obj-4",
          description: "Establish ongoing peer support and community involvement",
          status: "on-track",
          targetDate: "2026-04-15",
        },
      ],
    },
    riskLevel: "low",
    sessions: [
      {
        id: "sess-005-1",
        sessionNumber: 18,
        date: "2026-02-20",
        rawNotes:
          "James is doing great. 158 days today. He retired from his accounting firm in December and was worried it would be hard — we spent a lot of time planning for it. Turns out it's been mostly positive. He's volunteering at the library twice a week and loves it. Helen and him are taking a cooking class together. He had a craving at a Super Bowl party but used his surfing the urge technique and it passed in about 10 minutes. We talked about transitioning to biweekly sessions. He's ready. AA attendance steady at 2x/week, he's been asked to sponsor someone.",
        dapNote: {
          data: "Client presents at 158 days sobriety. Post-retirement adjustment proceeding positively — volunteering at library 2x/week. Engaged in cooking class with wife. Reports one craving episode at Super Bowl party — managed with 'surfing the urge' technique, resolved in approximately 10 minutes. Discussed transition to biweekly sessions — client agreeable. AA attendance maintained at 2x/week. Client has been invited to become a sponsor.",
          assessment:
            "Client demonstrates strong, sustained recovery with well-developed coping skills. Retirement transition — previously identified as a risk period — has been managed successfully due to proactive planning. Craving management at a social event demonstrates internalized coping capacity. Library volunteering provides purpose, structure, and social connection. Cooking class with wife represents positive relationship investment. Being asked to sponsor reflects community recognition of his recovery. Client is appropriate for reduced session frequency.",
          plan: "1. Transition to biweekly sessions beginning next appointment. 2. Discuss sponsorship opportunity — readiness, boundaries, self-care. 3. Develop a long-term maintenance plan for post-treatment support. 4. Continue monitoring retirement adjustment. 5. Reinforce the positive — client has built an excellent recovery foundation.",
        },
        tags: {
          moodIndicators: ["content", "confident", "positive"],
          substancesMentioned: [
            "alcohol — craving at social event, managed successfully",
          ],
          triggersIdentified: ["social events with alcohol"],
          copingStrategiesDiscussed: [
            "surfing the urge (10 min, successful)",
            "AA attendance",
            "volunteering",
          ],
          supportNetworkChanges:
            "Asked to sponsor someone in AA. Volunteering at library. Cooking class with wife.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "stable-positive",
          keyQuotes: [
            "Retirement was supposed to be the hard part. Turns out having time is actually nice.",
            "Someone asked me to sponsor them. I didn't think I was far enough along but maybe I am.",
          ],
        },
        followUpFlags: [
          "Transition to biweekly sessions",
          "Discuss sponsorship readiness",
        ],
      },
      {
        id: "sess-005-2",
        sessionNumber: 20,
        date: "2026-03-20",
        rawNotes:
          "Biweekly session. James is continuing to do well. He started sponsoring the new guy — says it's actually helping his own recovery to give back. Helen told him she's proud of him and he got choked up telling me about it. Library volunteering expanded — they asked him to help with tax prep for low-income families since he's a CPA. He was genuinely excited about it. No cravings in the last month. We're starting to talk about a formal discharge plan — probably 4-6 more weeks if things stay on track. This is what recovery can look like when it works.",
        dapNote: {
          data: "Biweekly session. Client continues strong recovery trajectory. Actively sponsoring a new AA member — reports the experience as mutually beneficial. Wife expressed pride in his recovery — client emotionally affected by this feedback. Library volunteering expanding — invited to provide tax preparation services for low-income families, leveraging professional CPA background. Reports no cravings in the past month. Initiated discussion of formal discharge planning — estimated 4-6 weeks if current trajectory maintained.",
          assessment:
            "Client demonstrates mature, well-integrated recovery. The transition from receiving support to providing it (sponsorship, tax prep volunteering) indicates a level of stability and generativity that bodes well for long-term outcomes. Wife's expressed pride represents meaningful relationship healing. The absence of cravings over a full month, combined with active community involvement and strong relationship functioning, supports discharge planning. Client has successfully addressed all treatment plan objectives.",
          plan: "1. Begin formal discharge planning — develop post-treatment support structure. 2. Create a maintenance-phase relapse prevention plan. 3. Support sponsorship role — ensure appropriate boundaries. 4. Plan for a meaningful discharge celebration/recognition. 5. Establish post-discharge check-in schedule.",
        },
        tags: {
          moodIndicators: ["fulfilled", "emotional", "content", "excited"],
          substancesMentioned: [],
          triggersIdentified: [],
          copingStrategiesDiscussed: [
            "sponsorship (giving back)",
            "volunteering (expanded)",
            "marriage investment",
          ],
          supportNetworkChanges:
            "Now sponsoring someone. Tax prep volunteering added. Wife expressing pride.",
          objectivesAddressed: ["obj-1", "obj-2", "obj-3", "obj-4"],
          riskIndicators: [],
          sessionSentiment: "stable-positive",
          keyQuotes: [
            "Helen told me she's proud of me. I don't think she's said that in years.",
            "Helping with taxes for people who can't afford it — that's what I should have been doing all along.",
          ],
        },
        followUpFlags: [
          "Begin formal discharge planning",
          "Develop post-treatment relapse prevention plan",
        ],
      },
    ],
  },
];

// Helper function to get a client by ID
function getClientById(id) {
  return clients.find((c) => c.id === id) || null;
}

// Helper function to get all clients (summary view for dashboard)
function getClientsSummary() {
  return clients.map((c) => ({
    id: c.id,
    name: c.name,
    age: c.age,
    diagnosis: c.diagnosis,
    programType: c.programType,
    programDay: c.programDay,
    riskLevel: c.riskLevel,
    totalSessions: c.sessions.length,
    lastSessionDate: c.sessions[c.sessions.length - 1]?.date || null,
    nextObjectiveAtRisk: c.treatmentPlan.objectives.find(
      (o) => o.status === "at-risk" || o.status === "plateau"
    ),
    lastSessionSentiment:
      c.sessions[c.sessions.length - 1]?.tags?.sessionSentiment || "unknown",
  }));
}

// Helper to add a new session to a client (for live demo)
function addSession(clientId, sessionData) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;
  client.sessions.push(sessionData);
  return sessionData;
}

module.exports = {
  clients,
  getClientById,
  getClientsSummary,
  addSession,
};
