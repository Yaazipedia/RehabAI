import { useState, useEffect } from "react";
import { fetchClient, fetchBriefing, fetchOutcomes } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";
import LoadingState from "../Shared/LoadingState";

export default function ClientView({ clientId, onBack, onDocumentSession }) {
  const [client, setClient] = useState(null);
  const [tab, setTab] = useState("briefing");
  const [briefing, setBriefing] = useState(null);
  const [outcomes, setOutcomes] = useState(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    if (clientId) {
      fetchClient(clientId).then(setClient).catch(console.error);
      setBriefing(null); setOutcomes(null);
    }
  }, [clientId]);

  useEffect(() => {
    if (tab === "briefing" && clientId && !briefing && !loadingBriefing) {
      setLoadingBriefing(true);
      fetchBriefing(clientId).then(d => setBriefing(d.briefing)).catch(console.error).finally(() => setLoadingBriefing(false));
    }
    if (tab === "outcomes" && clientId && !outcomes && !loadingOutcomes) {
      setLoadingOutcomes(true);
      fetchOutcomes(clientId).then(d => setOutcomes(d.outcomes)).catch(console.error).finally(() => setLoadingOutcomes(false));
    }
  }, [tab, clientId]);

  if (!client) return <div className="p-8"><div className="shimmer h-32 rounded-2xl mb-4" /><div className="shimmer h-64 rounded-2xl" /></div>;

  const tabs = [
    { id: "briefing", label: "Briefing", icon: "📋" },
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "outcomes", label: "Outcomes", icon: "📊" },
  ];

  return (
    <div className="p-8 max-w-[1000px]">
      <button onClick={onBack} className="text-sm font-medium mb-3 transition-base block" style={{ color: "var(--clr-muted)" }}
        onMouseEnter={e => e.target.style.color = "var(--clr-primary)"} onMouseLeave={e => e.target.style.color = "var(--clr-muted)"}>
        ← Caseload
      </button>

      {/* Client header */}
      <div className="card p-5 mb-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: client.riskLevel === "high" ? "linear-gradient(135deg,#dc2626,#ef4444)" : client.riskLevel === "moderate" ? "linear-gradient(135deg,#d97706,#f59e0b)" : "linear-gradient(135deg,#059669,#10b981)" }}>
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: "var(--clr-slate)" }}>{client.name}</h2>
                <StatusBadge status={client.riskLevel} />
              </div>
              <p className="text-[12px]" style={{ color: "var(--clr-muted)" }}>
                {client.age}yo {client.gender} · {client.diagnosis} · {client.programType} · Day {client.programDay}
                {client.coOccurring && <span style={{ color: "var(--clr-warning)" }}> · {client.coOccurring}</span>}
                {client.mat && <span style={{ color: "var(--clr-primary)" }}> · {client.mat}</span>}
              </p>
            </div>
          </div>
          <button onClick={() => onDocumentSession(clientId)} className="btn-primary" style={{ fontSize: 13 }}>Document session</button>
        </div>

        {/* Objectives row */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--clr-border)" }}>
          {(client.treatmentPlan?.objectives || []).map((obj, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg"
              style={{ background: "var(--clr-bg)", color: "var(--clr-slate-mid)" }}>
              <StatusBadge status={obj.status} />
              <span className="max-w-[200px] truncate">{obj.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: "#e2e8f0" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-base flex items-center justify-center gap-1.5"
            style={{ background: tab === t.id ? "var(--clr-card)" : "transparent", color: tab === t.id ? "var(--clr-primary)" : "var(--clr-muted)", boxShadow: tab === t.id ? "var(--shadow-md)" : "none" }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {tab === "briefing" && <BriefingPanel briefing={briefing} loading={loadingBriefing} />}
      {tab === "timeline" && <TimelinePanel sessions={client.sessions} expanded={expandedSession} setExpanded={setExpandedSession} />}
      {tab === "outcomes" && <OutcomesPanel outcomes={outcomes} loading={loadingOutcomes} />}
    </div>
  );
}

// ==================== BRIEFING (TABBED) ====================
function BriefingPanel({ briefing, loading }) {
  const [subTab, setSubTab] = useState("quick");

  if (loading) return <div className="card p-6"><LoadingState message="Preparing briefing..." lines={6} /></div>;
  if (!briefing) return null;

  const qg = briefing.quickGlance;
  const full = briefing.fullBriefing;

  // Handle old format (no quickGlance)
  if (!qg && !full) {
    return (
      <div className="card p-6 animate-fade-in">
        <p className="text-sm" style={{ color: "var(--clr-slate-mid)" }}>{briefing.clientSnapshot || "Briefing data unavailable in expected format."}</p>
      </div>
    );
  }

  const riskColors = {
    low: { bg: "var(--clr-success-light)", color: "var(--clr-success)", border: "var(--clr-success-border)" },
    moderate: { bg: "var(--clr-warning-light)", color: "var(--clr-warning)", border: "var(--clr-warning-border)" },
    elevated: { bg: "var(--clr-danger-light)", color: "var(--clr-danger)", border: "var(--clr-danger-border)" },
    high: { bg: "var(--clr-danger-light)", color: "var(--clr-danger)", border: "var(--clr-danger-border)" },
  };
  const trendIcon = { improving: "↑", stable: "→", declining: "↓", mixed: "↕" };
  const trendClass = { improving: "trend-up", stable: "trend-stable", declining: "trend-down", mixed: "trend-mixed" };

  return (
    <div className="animate-fade-in">
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-4">
        {[{ id: "quick", label: "⚡ Quick glance" }, { id: "full", label: "📖 Full briefing" }].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-base"
            style={{
              background: subTab === t.id ? "var(--clr-primary)" : "var(--clr-card)",
              color: subTab === t.id ? "white" : "var(--clr-slate-mid)",
              border: `1.5px solid ${subTab === t.id ? "var(--clr-primary)" : "var(--clr-border)"}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* QUICK GLANCE */}
      {subTab === "quick" && qg && (
        <div className="space-y-3 animate-fade-in">
          {/* Top row: risk + trajectory + one-liner */}
          <div className="card p-5">
            <p className="text-[15px] font-semibold mb-4" style={{ color: "var(--clr-slate)" }}>{qg.oneLiner}</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: riskColors[qg.riskScore]?.bg || "var(--clr-bg)", border: `1px solid ${riskColors[qg.riskScore]?.border || "var(--clr-border)"}` }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: riskColors[qg.riskScore]?.color }}>Risk</p>
                <p className="text-lg font-bold capitalize" style={{ color: riskColors[qg.riskScore]?.color }}>{qg.riskScore}</p>
              </div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{ background: "var(--clr-bg)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--clr-muted)" }}>Trajectory</p>
                <p className={`text-lg font-bold capitalize ${trendClass[qg.trajectory] || ""}`}>
                  {trendIcon[qg.trajectory] || ""} {qg.trajectory}
                </p>
              </div>
              <div className="flex-2 rounded-xl p-3" style={{ background: "var(--clr-primary-light)", border: "1px solid var(--clr-primary-mid)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--clr-primary)" }}>Top priority</p>
                <p className="text-[14px] font-semibold" style={{ color: "var(--clr-primary-dark)" }}>{qg.topPriority}</p>
              </div>
            </div>
          </div>

          {/* Key flags */}
          <div className="card p-5">
            <p className="section-label mb-3">Key flags for this session</p>
            <div className="space-y-2">
              {(qg.keyFlags || []).map((flag, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: i === 0 ? "var(--clr-danger)" : i === 1 ? "var(--clr-warning)" : "var(--clr-muted)" }}>{i + 1}</span>
                  <span className="text-[14px]" style={{ color: "var(--clr-slate)" }}>{flag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Last session */}
          {qg.lastSessionHighlight && (
            <div className="rounded-xl p-4" style={{ background: "var(--clr-bg)", border: "1px solid var(--clr-border)" }}>
              <span className="text-[11px] font-semibold" style={{ color: "var(--clr-muted)" }}>Last session: </span>
              <span className="text-[13px]" style={{ color: "var(--clr-slate-mid)" }}>{qg.lastSessionHighlight}</span>
            </div>
          )}
        </div>
      )}

      {/* FULL BRIEFING */}
      {subTab === "full" && full && (
        <div className="space-y-3 animate-fade-in">
          <div className="card p-5">
            <p className="section-label mb-2">Client snapshot</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--clr-slate-mid)" }}>{full.clientSnapshot}</p>
          </div>

          <div className="card p-5">
            <p className="section-label mb-2">Recent trajectory</p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--clr-slate-mid)" }}>{full.recentTrajectory}</p>
          </div>

          {full.patternAlerts?.length > 0 && (
            <div className="card p-5">
              <p className="section-label mb-3">Pattern alerts</p>
              <div className="space-y-2.5">
                {full.patternAlerts.map((a, i) => (
                  <div key={i} className="rounded-lg p-3" style={{
                    background: a.type === "concern" ? "var(--clr-danger-light)" : a.type === "positive" ? "var(--clr-success-light)" : "var(--clr-bg)",
                    borderLeft: `3px solid ${a.type === "concern" ? "var(--clr-danger)" : a.type === "positive" ? "var(--clr-success)" : "var(--clr-primary)"}`,
                  }}>
                    <p className="text-[13px] font-semibold" style={{ color: a.type === "concern" ? "var(--clr-danger)" : a.type === "positive" ? "var(--clr-success)" : "var(--clr-slate)" }}>
                      {a.title || a.pattern}
                    </p>
                    {a.detail && <p className="text-[12px] mt-1" style={{ color: "var(--clr-slate-mid)" }}>{a.detail}</p>}
                    {a.clinicalImplication && <p className="text-[11px] mt-1 italic" style={{ color: "var(--clr-muted)" }}>{a.clinicalImplication}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {full.treatmentPlanProgress?.length > 0 && (
            <div className="card p-5">
              <p className="section-label mb-3">Treatment plan progress</p>
              <div className="space-y-3">
                {full.treatmentPlanProgress.map((obj, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium" style={{ color: "var(--clr-slate)" }}>{obj.objective}</span>
                      <StatusBadge status={obj.status} />
                    </div>
                    <div className="progress-bar mb-1">
                      <div className="progress-bar-fill" style={{ width: `${obj.progressPercent || 0}%`, background: getProgressColor(obj.progressPercent || 0) }} />
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--clr-muted)" }}>{obj.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {full.suggestedFocus?.length > 0 && (
            <div className="rounded-xl p-5" style={{ background: "var(--clr-primary-light)", border: "1px solid var(--clr-primary-mid)" }}>
              <p className="section-label mb-2" style={{ color: "var(--clr-primary)" }}>Suggested focus</p>
              {full.suggestedFocus.map((s, i) => (
                <p key={i} className="text-[13px] mb-1.5 flex items-start gap-2" style={{ color: "var(--clr-primary-dark)" }}>
                  <span>→</span><span>{s}</span>
                </p>
              ))}
            </div>
          )}

          {full.strengthsToReinforce?.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: "var(--clr-success-light)", border: "1px solid var(--clr-success-border)" }}>
              <p className="section-label mb-2" style={{ color: "var(--clr-success)" }}>Strengths to reinforce</p>
              {full.strengthsToReinforce.map((s, i) => (
                <p key={i} className="text-[13px] mb-1" style={{ color: "#065f46" }}>✓ {s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== TIMELINE ====================
function TimelinePanel({ sessions, expanded, setExpanded }) {
  const reversed = [...sessions].reverse();
  const sentimentColors = {
    improving: "var(--clr-success)", "cautiously-improving": "var(--clr-warning)", stable: "var(--clr-muted)",
    "stable-positive": "var(--clr-success)", declining: "var(--clr-danger)", concerning: "var(--clr-danger)",
    mixed: "var(--clr-warning)", "cautiously-stable": "var(--clr-warning)",
  };

  return (
    <div className="space-y-2.5 animate-fade-in">
      {reversed.map((s, idx) => {
        const isOpen = expanded === s.id;
        const dotColor = sentimentColors[s.tags?.sessionSentiment] || "var(--clr-muted)";
        const risks = s.tags?.riskIndicators || [];

        return (
          <div key={s.id} className="card overflow-hidden animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both", borderColor: isOpen ? "var(--clr-primary-mid)" : undefined }}>
            {/* Compact header */}
            <button onClick={() => setExpanded(isOpen ? null : s.id)}
              className="w-full px-5 py-3.5 flex items-center gap-4 text-left transition-base"
              onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "#fafbfc"; }}
              onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}>
              {/* Dot */}
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: dotColor, boxShadow: risks.length ? `0 0 0 3px ${dotColor}30` : "none" }} />

              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-semibold" style={{ color: "var(--clr-slate)" }}>Session {s.sessionNumber}</span>
                <span className="text-[12px] ml-2" style={{ color: "var(--clr-muted)" }}>{s.date}</span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {risks.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "var(--clr-danger-light)", color: "var(--clr-danger)" }}>
                    {risks.length} risk
                  </span>
                )}
                <StatusBadge status={s.tags?.sessionSentiment} showIcon />
                <span className="text-[10px]" style={{ color: "var(--clr-muted)", transform: isOpen ? "rotate(180deg)" : "", display: "inline-block", transition: "transform 0.2s" }}>▼</span>
              </div>
            </button>

            {/* Expanded */}
            {isOpen && (
              <div className="px-5 pb-5 border-t animate-fade-in" style={{ borderColor: "var(--clr-border)" }}>
                {/* DAP in 3 columns */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {["data", "assessment", "plan"].map(key => (
                    <div key={key}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--clr-primary)" }}>{key}</p>
                      <p className="text-[12px] leading-relaxed" style={{ color: "var(--clr-slate-mid)" }}>{s.dapNote?.[key]}</p>
                    </div>
                  ))}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-3 border-t text-[11px]" style={{ borderColor: "var(--clr-border)" }}>
                  {s.tags?.moodIndicators?.length > 0 && (
                    <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Mood: </span>{s.tags.moodIndicators.join(", ")}</div>
                  )}
                  {s.tags?.triggersIdentified?.length > 0 && (
                    <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Triggers: </span>{s.tags.triggersIdentified.join(", ")}</div>
                  )}
                  {s.tags?.copingStrategiesDiscussed?.length > 0 && (
                    <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Coping: </span>{s.tags.copingStrategiesDiscussed.join(", ")}</div>
                  )}
                </div>

                {/* Risk indicators */}
                {risks.length > 0 && (
                  <div className="mt-3 rounded-lg p-3" style={{ background: "var(--clr-danger-light)" }}>
                    {risks.map((r, i) => <p key={i} className="text-[11px] mb-0.5" style={{ color: "var(--clr-danger)" }}>⚠ {r}</p>)}
                  </div>
                )}

                {/* Quotes */}
                {s.tags?.keyQuotes?.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {s.tags.keyQuotes.map((q, i) => <blockquote key={i} className="quote">"{q}"</blockquote>)}
                  </div>
                )}

                {/* Follow-ups */}
                {(s.followUpFlags || []).length > 0 && (
                  <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--clr-border)" }}>
                    {s.followUpFlags.map((f, i) => {
                      const urgent = f.startsWith("PRIORITY:") || f.startsWith("URGENT:");
                      return <p key={i} className="text-[11px] mb-0.5" style={{ color: urgent ? "var(--clr-danger)" : "var(--clr-slate-mid)", fontWeight: urgent ? 600 : 400 }}>
                        {urgent ? "🔴 " : "→ "}{f}
                      </p>;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== OUTCOMES DASHBOARD ====================
function OutcomesPanel({ outcomes, loading }) {
  if (loading) return <div className="card p-6"><LoadingState message="Analyzing outcomes..." lines={6} /></div>;
  if (!outcomes) return null;

  const overall = outcomes.overallScore;
  const domains = outcomes.domainScores || [];
  const interventions = outcomes.interventions || outcomes.interventionEffectiveness || [];
  const recs = outcomes.topRecommendations || outcomes.evidenceBasedRecommendations || [];
  const supervision = outcomes.supervisionPoints || outcomes.supervisionTalkingPoints || [];

  const trendIcon = { improving: "↑", stable: "→", declining: "↓", mixed: "↕" };
  const trendClass = { improving: "trend-up", stable: "trend-stable", declining: "trend-down", mixed: "trend-mixed" };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Overall score card */}
      {overall && (
        <div className="card p-6">
          <div className="flex items-center gap-6">
            <ScoreRing score={overall.score} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold" style={{ color: "var(--clr-slate)" }}>{overall.label}</h3>
                <span className={`text-lg font-bold ${trendClass[overall.trend] || ""}`}>{trendIcon[overall.trend] || ""}</span>
              </div>
              <p className="text-[13px]" style={{ color: "var(--clr-slate-mid)" }}>{overall.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Domain scores */}
      {domains.length > 0 && (
        <div className="card p-5">
          <p className="section-label mb-4">Recovery domains</p>
          <div className="grid grid-cols-2 gap-4">
            {domains.map((d, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "var(--clr-bg)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--clr-slate)" }}>{d.domain}</span>
                  <span className={`text-[13px] font-bold ${trendClass[d.trend] || ""}`}>
                    {d.score}/100 {trendIcon[d.trend] || ""}
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${d.score}%`, background: getProgressColor(d.score) }} />
                </div>
                <p className="text-[11px] mt-1.5" style={{ color: "var(--clr-muted)" }}>{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interventions */}
      {interventions.length > 0 && (
        <div className="card p-5">
          <p className="section-label mb-4">Intervention effectiveness</p>
          <div className="space-y-3">
            {interventions.map((intv, i) => {
              const score = intv.effectivenessScore ?? intv.score ?? 50;
              const name = intv.name || intv.intervention;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium truncate" style={{ color: "var(--clr-slate)" }}>{name}</span>
                      <span className="text-[12px] font-bold" style={{ color: getProgressColor(score) }}>{score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${score}%`, background: getProgressColor(score) }} />
                    </div>
                    <p className="text-[11px] mt-1" style={{ color: "var(--clr-muted)" }}>
                      {intv.sessionsUsed ? `${intv.sessionsUsed} sessions` : ""} · {intv.recommendation || intv.verdict}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--clr-primary-light)", border: "1px solid var(--clr-primary-mid)" }}>
          <p className="section-label mb-3" style={{ color: "var(--clr-primary)" }}>Recommendations</p>
          <div className="space-y-2">
            {recs.map((r, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: (r.priority === "high") ? "var(--clr-danger)" : "var(--clr-warning)" }}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--clr-primary-dark)" }}>{r.action || r.recommendation || r.observation}</p>
                  <p className="text-[11px]" style={{ color: "var(--clr-muted)" }}>{r.basis || r.clinicalBasis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supervision */}
      {supervision.length > 0 && (
        <div className="card p-5">
          <p className="section-label mb-2">Supervision talking points</p>
          {supervision.map((p, i) => (
            <p key={i} className="text-[13px] mb-1 flex items-start gap-2" style={{ color: "var(--clr-slate-mid)" }}>
              <span style={{ color: "var(--clr-primary)" }}>•</span>{typeof p === "string" ? p : p.point || JSON.stringify(p)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== SHARED HELPERS ====================
function getProgressColor(score) {
  if (score >= 70) return "var(--clr-success)";
  if (score >= 40) return "var(--clr-warning)";
  return "var(--clr-danger)";
}

function ScoreRing({ score }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getProgressColor(score);

  return (
    <div className="score-ring flex-shrink-0">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--clr-border)" strokeWidth="6" />
        <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="score-ring-text" style={{ color }}>{score}</div>
    </div>
  );
}
