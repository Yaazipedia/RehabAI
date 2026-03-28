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
      setBriefing(null);
      setOutcomes(null);
    }
  }, [clientId]);

  function loadBriefing() {
    if (briefing) return;
    setLoadingBriefing(true);
    fetchBriefing(clientId).then((d) => setBriefing(d.briefing)).catch(console.error).finally(() => setLoadingBriefing(false));
  }
  function loadOutcomes() {
    if (outcomes) return;
    setLoadingOutcomes(true);
    fetchOutcomes(clientId).then((d) => setOutcomes(d.outcomes)).catch(console.error).finally(() => setLoadingOutcomes(false));
  }

  useEffect(() => {
    if (tab === "briefing" && clientId) loadBriefing();
    if (tab === "outcomes" && clientId) loadOutcomes();
  }, [tab, clientId]);

  if (!client) {
    return (
      <div className="p-8">
        <div className="shimmer h-8 w-64 mb-4" />
        <div className="shimmer h-40 rounded-2xl mb-6" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  const tabs = [
    { id: "briefing", label: "Pre-session briefing", icon: "📋" },
    { id: "timeline", label: "Session timeline", icon: "📅" },
    { id: "outcomes", label: "Outcome insights", icon: "📊" },
  ];

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Back button */}
      <button onClick={onBack} className="text-sm font-medium mb-4 transition-base" style={{ color: "var(--clr-muted)" }}
        onMouseEnter={(e) => e.target.style.color = "var(--clr-primary)"}
        onMouseLeave={(e) => e.target.style.color = "var(--clr-muted)"}>
        ← Caseload
      </button>

      {/* Client header card */}
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{
                background: client.riskLevel === "high" ? "linear-gradient(135deg, #dc2626, #ef4444)"
                  : client.riskLevel === "moderate" ? "linear-gradient(135deg, #d97706, #f59e0b)"
                  : "linear-gradient(135deg, #059669, #10b981)"
              }}>
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="text-xl font-bold" style={{ color: "var(--clr-slate)" }}>{client.name}</h2>
                <StatusBadge status={client.riskLevel} />
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: "var(--clr-muted)" }}>
                <span>{client.age}yo {client.gender}</span>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{client.diagnosis}</span>
                {client.coOccurring && <>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span style={{ color: "var(--clr-warning)" }}>Co-occurring: {client.coOccurring}</span>
                </>}
                <span style={{ opacity: 0.4 }}>|</span>
                <span>{client.programType} • Day {client.programDay}</span>
                {client.mat && <>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span style={{ color: "var(--clr-primary)" }}>MAT: {client.mat}</span>
                </>}
              </div>
            </div>
          </div>
          <button onClick={() => onDocumentSession(clientId)} className="btn-primary" style={{ fontSize: 13 }}>
            Document session
          </button>
        </div>

        {/* Treatment plan objectives */}
        <div className="mt-5 pt-5 border-t" style={{ borderColor: "var(--clr-border)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--clr-muted)" }}>
            Treatment plan objectives
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {client.treatmentPlan.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-2 text-[12px] py-1">
                <StatusBadge status={obj.status} className="flex-shrink-0 mt-0.5" />
                <span style={{ color: "var(--clr-slate-mid)" }}>{obj.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1.5 rounded-xl" style={{ background: "#e2e8f0" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-base flex items-center justify-center gap-2"
            style={{
              background: tab === t.id ? "var(--clr-card)" : "transparent",
              color: tab === t.id ? "var(--clr-primary)" : "var(--clr-muted)",
              boxShadow: tab === t.id ? "var(--shadow-md)" : "none",
            }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "briefing" && <BriefingPanel briefing={briefing} loading={loadingBriefing} />}
      {tab === "timeline" && <TimelinePanel sessions={client.sessions} expandedSession={expandedSession} setExpandedSession={setExpandedSession} />}
      {tab === "outcomes" && <OutcomesPanel outcomes={outcomes} loading={loadingOutcomes} />}
    </div>
  );
}

/* ==================== BRIEFING ==================== */
function BriefingPanel({ briefing, loading }) {
  if (loading) return <div className="card p-6"><LoadingState message="Claude is preparing the pre-session briefing..." lines={8} /></div>;
  if (!briefing) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card p-5">
        <h3 className="text-sm font-bold mb-2" style={{ color: "var(--clr-slate)" }}>📸 Client snapshot</h3>
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "var(--clr-slate-mid)" }}>{briefing.clientSnapshot}</p>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-bold mb-2" style={{ color: "var(--clr-slate)" }}>📈 Recent trajectory</h3>
        <p className="text-[13.5px] leading-[1.7]" style={{ color: "var(--clr-slate-mid)" }}>{briefing.recentTrajectory}</p>
      </div>

      {briefing.patternAlerts?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--clr-slate)" }}>🔍 Pattern alerts</h3>
          <div className="space-y-3">
            {briefing.patternAlerts.map((alert, i) => {
              const isConcern = alert.type === "concern";
              const isPositive = alert.type === "positive";
              return (
                <div key={i} className="rounded-xl p-4" style={{
                  background: isConcern ? "var(--clr-danger-light)" : isPositive ? "var(--clr-success-light)" : "var(--clr-bg)",
                  borderLeft: `4px solid ${isConcern ? "var(--clr-danger)" : isPositive ? "var(--clr-success)" : "var(--clr-primary)"}`,
                }}>
                  <p className="text-[13px] font-semibold mb-1" style={{
                    color: isConcern ? "var(--clr-danger)" : isPositive ? "var(--clr-success)" : "var(--clr-slate)"
                  }}>
                    {isConcern ? "⚠ " : isPositive ? "✓ " : ""}{alert.pattern}
                  </p>
                  <p className="text-[12px]" style={{ color: "var(--clr-slate-mid)" }}>{alert.clinicalImplication}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {briefing.treatmentPlanProgress?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--clr-slate)" }}>🎯 Treatment plan progress</h3>
          <div className="space-y-3">
            {briefing.treatmentPlanProgress.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 py-1">
                <StatusBadge status={obj.status} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--clr-slate)" }}>{obj.objective}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "var(--clr-slate-mid)" }}>{obj.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {briefing.suggestedFocus?.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--clr-primary-light)", border: "1.5px solid var(--clr-primary-mid)" }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--clr-primary-dark)" }}>💡 Suggested session focus</h3>
          <ul className="space-y-2.5">
            {briefing.suggestedFocus.map((item, i) => (
              <li key={i} className="text-[13px] flex items-start gap-2.5" style={{ color: "var(--clr-primary-dark)" }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--clr-primary)" }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {briefing.strengthsToReinforce?.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--clr-success-light)", border: "1.5px solid var(--clr-success-border)" }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: "var(--clr-success)" }}>💪 Strengths to reinforce</h3>
          {briefing.strengthsToReinforce.map((s, i) => (
            <p key={i} className="text-[13px] mb-1 last:mb-0" style={{ color: "#065f46" }}>✓ {s}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================== TIMELINE ==================== */
function TimelinePanel({ sessions, expandedSession, setExpandedSession }) {
  const reversed = [...sessions].reverse();
  const sentimentColors = {
    improving: "var(--clr-success)", "cautiously-improving": "var(--clr-warning)", stable: "var(--clr-muted)",
    "stable-positive": "var(--clr-success)", declining: "var(--clr-danger)", concerning: "var(--clr-danger)",
    mixed: "var(--clr-warning)", "cautiously-stable": "var(--clr-warning)",
  };

  return (
    <div className="relative animate-fade-in">
      {/* Vertical timeline line */}
      <div className="absolute left-[23px] top-4 bottom-4 w-[2px] rounded-full" style={{ background: "var(--clr-border)" }} />

      <div className="space-y-3">
        {reversed.map((session, idx) => {
          const expanded = expandedSession === session.id;
          const dotColor = sentimentColors[session.tags.sessionSentiment] || "var(--clr-muted)";
          const hasRisk = session.tags.riskIndicators?.length > 0;

          return (
            <div key={session.id} className="relative pl-14 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}>
              {/* Timeline dot */}
              <div className="absolute left-[15px] top-[18px] w-[18px] h-[18px] rounded-full border-[3px] z-10"
                style={{
                  background: "var(--clr-card)",
                  borderColor: dotColor,
                  boxShadow: hasRisk ? `0 0 0 3px ${dotColor}33` : "none",
                }} />

              <div className={`card ${expanded ? "" : "card-interactive"} overflow-hidden`}
                style={{ borderColor: expanded ? "var(--clr-primary-mid)" : undefined }}>
                {/* Header */}
                <button onClick={() => setExpandedSession(expanded ? null : session.id)}
                  className="w-full p-4 flex items-center justify-between text-left">
                  <div>
                    <span className="text-[14px] font-bold" style={{ color: "var(--clr-slate)" }}>Session {session.sessionNumber}</span>
                    <span className="text-[12px] ml-2" style={{ color: "var(--clr-muted)" }}>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={session.tags.sessionSentiment} showIcon />
                    {hasRisk && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "var(--clr-danger-light)", color: "var(--clr-danger)", border: "1px solid var(--clr-danger-border)" }}>
                        {session.tags.riskIndicators.length} risk
                      </span>
                    )}
                    <span className="text-[11px] transition-base" style={{ color: "var(--clr-muted)", transform: expanded ? "rotate(180deg)" : "" }}>▼</span>
                  </div>
                </button>

                {/* Expanded */}
                {expanded && (
                  <div className="px-5 pb-5 border-t animate-fade-in" style={{ borderColor: "var(--clr-border)" }}>
                    <div className="mt-4 space-y-4">
                      {["data", "assessment", "plan"].map((key) => (
                        <div key={key}>
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--clr-primary)" }}>{key}</span>
                          <p className="text-[13px] leading-[1.7] mt-1" style={{ color: "var(--clr-slate-mid)" }}>{session.dapNote[key]}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-[12px]" style={{ borderColor: "var(--clr-border)" }}>
                      <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Mood: </span><span style={{ color: "var(--clr-slate-mid)" }}>{session.tags.moodIndicators.join(", ")}</span></div>
                      {session.tags.triggersIdentified?.length > 0 && (
                        <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Triggers: </span><span style={{ color: "var(--clr-slate-mid)" }}>{session.tags.triggersIdentified.join(", ")}</span></div>
                      )}
                      <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Coping: </span><span style={{ color: "var(--clr-slate-mid)" }}>{session.tags.copingStrategiesDiscussed.join(", ")}</span></div>
                      <div><span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Support: </span><span style={{ color: "var(--clr-slate-mid)" }}>{session.tags.supportNetworkChanges}</span></div>
                    </div>

                    {hasRisk && (
                      <div className="mt-3 rounded-xl p-3.5" style={{ background: "var(--clr-danger-light)", border: "1px solid var(--clr-danger-border)" }}>
                        <p className="text-[11px] font-bold mb-1.5" style={{ color: "var(--clr-danger)" }}>⚠ Risk indicators</p>
                        {session.tags.riskIndicators.map((r, i) => (
                          <p key={i} className="text-[12px] mb-0.5" style={{ color: "var(--clr-danger)" }}>• {r}</p>
                        ))}
                      </div>
                    )}

                    {session.tags.keyQuotes?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {session.tags.keyQuotes.map((q, i) => (
                          <blockquote key={i} className="quote">"{q}"</blockquote>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--clr-border)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--clr-muted)" }}>Follow-up flags</p>
                      {session.followUpFlags.map((f, i) => {
                        const urgent = f.startsWith("PRIORITY:") || f.startsWith("URGENT:");
                        return (
                          <p key={i} className="text-[12px] mb-1 flex items-start gap-2" style={{ color: urgent ? "var(--clr-danger)" : "var(--clr-slate-mid)", fontWeight: urgent ? 600 : 400 }}>
                            <span className="flex-shrink-0">{urgent ? "🔴" : "→"}</span>{f}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================== OUTCOMES ==================== */
function OutcomesPanel({ outcomes, loading }) {
  if (loading) return <div className="card p-6"><LoadingState message="Claude is analyzing clinical outcomes..." lines={10} /></div>;
  if (!outcomes) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {outcomes.interventionEffectiveness?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--clr-slate)" }}>💊 Intervention effectiveness</h3>
          <div className="space-y-3">
            {outcomes.interventionEffectiveness.map((intv, i) => (
              <div key={i} className="rounded-xl border p-4" style={{ borderColor: "var(--clr-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[13px] font-bold" style={{ color: "var(--clr-slate)" }}>{intv.intervention}</h4>
                  <StatusBadge status={intv.effectiveness} />
                </div>
                <p className="text-[11px] mb-2" style={{ color: "var(--clr-muted)" }}>Sessions: {intv.sessionsUsed?.join(", ")}</p>
                <p className="text-[12.5px] mb-2" style={{ color: "var(--clr-slate-mid)" }}>{intv.progressIndicators}</p>
                <div className="rounded-lg p-3 text-[12px]" style={{ background: "var(--clr-bg)", color: "var(--clr-primary-dark)" }}>
                  <span className="font-semibold">Recommendation:</span> {intv.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {outcomes.outcomeTrends && (
        <div className="card p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--clr-slate)" }}>📈 Outcome trends</h3>
          <div className="space-y-4">
            {Object.entries(outcomes.outcomeTrends).map(([key, val]) => (
              <div key={key} className="pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: "var(--clr-border)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold capitalize" style={{ color: "var(--clr-slate)" }}>
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <StatusBadge status={val.trend} showIcon />
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--clr-slate-mid)" }}>{val.evidence || val.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {outcomes.evidenceBasedRecommendations?.length > 0 && (
        <div className="rounded-xl p-6" style={{ background: "var(--clr-primary-light)", border: "1.5px solid var(--clr-primary-mid)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--clr-primary-dark)" }}>🔬 Evidence-based recommendations</h3>
          <div className="space-y-3">
            {outcomes.evidenceBasedRecommendations.map((rec, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.7)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[12.5px] font-semibold" style={{ color: "var(--clr-slate)" }}>{rec.observation}</p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: rec.priority === "high" ? "var(--clr-danger-light)" : rec.priority === "medium" ? "var(--clr-amber-light)" : "var(--clr-bg)",
                      color: rec.priority === "high" ? "var(--clr-danger)" : rec.priority === "medium" ? "var(--clr-warning)" : "var(--clr-muted)",
                    }}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[12px] mb-1" style={{ color: "var(--clr-primary-dark)" }}>→ {rec.recommendation}</p>
                <p className="text-[11px] italic" style={{ color: "var(--clr-slate-mid)" }}>Basis: {rec.clinicalBasis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {outcomes.supervisionTalkingPoints?.length > 0 && (
        <div className="card p-6">
          <h3 className="text-sm font-bold mb-3" style={{ color: "var(--clr-slate)" }}>👩‍⚕️ Supervision talking points</h3>
          {outcomes.supervisionTalkingPoints.map((pt, i) => (
            <p key={i} className="text-[13px] mb-2 last:mb-0 flex items-start gap-2" style={{ color: "var(--clr-slate-mid)" }}>
              <span style={{ color: "var(--clr-primary)" }}>•</span>{pt}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
