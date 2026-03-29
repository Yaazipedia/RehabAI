import { useState, useEffect } from "react";
import { fetchClient, fetchBriefing, fetchOutcomes } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";
import LoadingState from "../Shared/LoadingState";

// ====== Simple in-memory cache ======
const briefingCache = new Map();
const outcomesCache = new Map();

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
      fetchClient(clientId).then(c => {
        setClient(c);
        setBriefing(null);
        setOutcomes(null);
      }).catch(console.error);
    }
  }, [clientId]);

  useEffect(() => {
    if (!client) return;
    const sessionCount = client.sessions?.length ?? 0;

    if (tab === "briefing" && !briefing && !loadingBriefing) {
      const cacheKey = `${clientId}:${sessionCount}`;
      if (briefingCache.has(cacheKey)) { setBriefing(briefingCache.get(cacheKey)); return; }
      setLoadingBriefing(true);
      fetchBriefing(clientId)
        .then(d => { setBriefing(d.briefing); briefingCache.set(cacheKey, d.briefing); })
        .catch(console.error)
        .finally(() => setLoadingBriefing(false));
    }

    if (tab === "outcomes" && !outcomes && !loadingOutcomes) {
      const cacheKey = `${clientId}:${sessionCount}`;
      if (outcomesCache.has(cacheKey)) { setOutcomes(outcomesCache.get(cacheKey)); return; }
      setLoadingOutcomes(true);
      fetchOutcomes(clientId)
        .then(d => { setOutcomes(d.outcomes); outcomesCache.set(cacheKey, d.outcomes); })
        .catch(console.error)
        .finally(() => setLoadingOutcomes(false));
    }
  }, [tab, client]);

  if (!client) return (
    <div style={{ padding: "32px" }}>
      <div className="shimmer" style={{ height: "120px", borderRadius: "20px", marginBottom: "16px" }} />
      <div className="shimmer" style={{ height: "48px", borderRadius: "14px", marginBottom: "16px" }} />
      <div className="shimmer" style={{ height: "300px", borderRadius: "20px" }} />
    </div>
  );

  const tabs = [
    { id: "briefing", label: "Briefing", icon: null },
    { id: "timeline", label: "Timeline", icon: null },
    { id: "outcomes", label: "Outcomes", icon: null },
  ];

  return (
    <div style={{ padding: "28px 32px 40px", maxWidth: "1000px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "13px", fontWeight: 500, color: "var(--text-muted)",
          marginBottom: "16px", display: "flex", alignItems: "center", gap: "4px",
          fontFamily: "inherit", padding: 0, transition: "color 0.15s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--accent-indigo)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
      >
        ← Caseload
      </button>

      {/* Client header — NO objectives row (removed, redundant with Full Briefing) */}
      <div style={{
        background: "var(--nm-bg)", boxShadow: "var(--nm-flat)",
        borderRadius: "20px", padding: "24px", marginBottom: "20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "white",
              background: client.riskLevel === "high" ? "var(--gradient-rose)"
                : client.riskLevel === "moderate" ? "var(--gradient-amber)" : "var(--gradient-emerald)",
              boxShadow: "var(--nm-flat-sm)",
            }}>
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                  {client.name}
                </h2>
                <StatusBadge status={client.riskLevel} />
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                {client.age}yo {client.gender} · {client.diagnosis} · {client.programType} · Day {client.programDay}
                {client.coOccurring && <span style={{ color: "var(--accent-amber)" }}> · {client.coOccurring}</span>}
                {client.mat && <span style={{ color: "var(--accent-indigo)" }}> · {client.mat}</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDocumentSession(clientId)}
            style={{
              padding: "14px 24px", borderRadius: "14px", border: "none",
              background: "var(--gradient-indigo)", color: "white",
              fontWeight: 600, fontSize: "14px", fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(99,102,241,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Document session
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "6px", marginBottom: "20px",
        padding: "6px", borderRadius: "16px",
        background: "var(--nm-bg)", boxShadow: "var(--nm-inset-sm)",
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "12px 16px", borderRadius: "12px",
            fontSize: "14px", fontWeight: tab === t.id ? 600 : 500,
            fontFamily: "inherit", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            background: tab === t.id ? "var(--nm-bg)" : "transparent",
            color: tab === t.id ? "var(--accent-indigo)" : "var(--text-muted)",
            boxShadow: tab === t.id ? "var(--nm-flat-sm)" : "none",
            transition: "all 0.2s ease",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "briefing" && <BriefingPanel briefing={briefing} loading={loadingBriefing} />}
      {tab === "timeline" && <TimelinePanel sessions={client.sessions} expanded={expandedSession} setExpanded={setExpandedSession} />}
      {tab === "outcomes" && <OutcomesPanel outcomes={outcomes} loading={loadingOutcomes} />}
    </div>
  );
}

// ==================== BRIEFING ====================
function BriefingPanel({ briefing, loading }) {
  const [subTab, setSubTab] = useState("quick");

  if (loading) return (
    <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "32px" }}>
      <LoadingState message="Preparing briefing..." lines={6} />
    </div>
  );
  if (!briefing) return null;

  const qg = briefing.quickGlance;
  const full = briefing.fullBriefing;

  if (!qg && !full) return (
    <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{briefing.clientSnapshot || "Briefing data unavailable."}</p>
    </div>
  );

  const riskColors = {
    low:      { bg: "rgba(16,185,129,0.1)", color: "var(--accent-emerald)", border: "rgba(16,185,129,0.3)" },
    moderate: { bg: "rgba(245,158,11,0.1)", color: "var(--accent-amber)",   border: "rgba(245,158,11,0.3)" },
    elevated: { bg: "rgba(244,63,94,0.1)",  color: "var(--accent-rose)",    border: "rgba(244,63,94,0.3)" },
    high:     { bg: "rgba(244,63,94,0.1)",  color: "var(--accent-rose)",    border: "rgba(244,63,94,0.3)" },
  };
  const trendIcon  = { improving: "↑", stable: "→", declining: "↓", mixed: "↕" };
  const trendColor = { improving: "var(--accent-emerald)", stable: "var(--text-muted)", declining: "var(--accent-rose)", mixed: "var(--accent-amber)" };

  return (
    <div style={{ animation: "fadeInUp 0.35s ease forwards" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[
          { id: "quick", label: "Quick Glance", svgPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
          { id: "full", label: "Full Briefing", svgPath: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" },
        ].map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            padding: "11px 24px", borderRadius: "12px", fontSize: "14px",
            fontWeight: subTab === t.id ? 600 : 500, fontFamily: "inherit",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "8px",
            background: subTab === t.id ? "var(--gradient-indigo)" : "var(--nm-bg)",
            color: subTab === t.id ? "white" : "var(--text-secondary)",
            boxShadow: subTab === t.id ? "0 4px 14px rgba(99,102,241,0.35)" : "var(--nm-button)",
            transition: "all 0.2s ease",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {t.id === "quick" ? <><path d={t.svgPath}/></> : <><path d={t.svgPath}/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>}
            </svg>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "quick" && qg && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.5 }}>{qg.oneLiner}</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1, borderRadius: "14px", padding: "16px", textAlign: "center", background: riskColors[qg.riskScore]?.bg || "var(--nm-bg)", border: `1.5px solid ${riskColors[qg.riskScore]?.border || "transparent"}`, boxShadow: "var(--nm-flat-sm)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: riskColors[qg.riskScore]?.color, marginBottom: "6px" }}>Risk</p>
                <p style={{ fontSize: "18px", fontWeight: 700, textTransform: "capitalize", color: riskColors[qg.riskScore]?.color }}>{qg.riskScore}</p>
              </div>
              <div style={{ flex: 1, borderRadius: "14px", padding: "16px", textAlign: "center", background: "var(--nm-bg)", boxShadow: "var(--nm-flat-sm)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "6px" }}>Trajectory</p>
                <p style={{ fontSize: "18px", fontWeight: 700, textTransform: "capitalize", color: trendColor[qg.trajectory] || "var(--text-primary)" }}>{trendIcon[qg.trajectory] || ""} {qg.trajectory}</p>
              </div>
              <div style={{ flex: 2, borderRadius: "14px", padding: "16px", background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.2)", boxShadow: "var(--nm-flat-sm)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-indigo)", marginBottom: "6px" }}>Top Priority</p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent-indigo)", lineHeight: 1.4 }}>{qg.topPriority}</p>
              </div>
            </div>
          </div>
          <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "16px" }}>Key Flags for This Session</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {(qg.keyFlags || []).map((flag, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0, background: i === 0 ? "var(--accent-rose)" : i === 1 ? "var(--accent-amber)" : i === 2 ? "var(--accent-indigo)" : "var(--text-muted)" }}>{i + 1}</span>
                  <span style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.4 }}>{flag}</span>
                </div>
              ))}
            </div>
          </div>
          {qg.lastSessionHighlight && (
            <div style={{ borderRadius: "14px", padding: "16px 20px", background: "var(--nm-bg)", boxShadow: "var(--nm-inset-sm)", borderLeft: "3px solid var(--accent-indigo-light)" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)" }}>Last session: </span>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic" }}>{qg.lastSessionHighlight}</span>
            </div>
          )}
        </div>
      )}

      {subTab === "full" && full && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BriefingSection title="Client Snapshot" content={full.clientSnapshot} />
          <BriefingSection title="Recent Trajectory" content={full.recentTrajectory} />
          {full.patternAlerts?.length > 0 && (
            <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "16px" }}>Pattern Alerts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {full.patternAlerts.map((a, i) => {
                  const colors = a.type === "concern" ? { bg: "rgba(244,63,94,0.08)", border: "var(--accent-rose)", text: "var(--accent-rose)" } : a.type === "positive" ? { bg: "rgba(16,185,129,0.08)", border: "var(--accent-emerald)", text: "var(--accent-emerald)" } : { bg: "rgba(99,102,241,0.08)", border: "var(--accent-indigo)", text: "var(--accent-indigo)" };
                  return (
                    <div key={i} style={{ borderRadius: "12px", padding: "14px 16px", background: colors.bg, borderLeft: `3px solid ${colors.border}` }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: colors.text, marginBottom: a.detail ? "4px" : 0 }}>{a.title || a.pattern}</p>
                      {a.detail && <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: a.clinicalImplication ? "4px" : 0 }}>{a.detail}</p>}
                      {a.clinicalImplication && <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>{a.clinicalImplication}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {full.treatmentPlanProgress?.length > 0 && (
            <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "16px" }}>Treatment Plan Progress</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {full.treatmentPlanProgress.map((obj, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>{obj.objective}</span>
                      <StatusBadge status={obj.status} />
                    </div>
                    <div className="progress-bar" style={{ marginBottom: "4px" }}>
                      <div className="progress-bar-fill" style={{ width: `${obj.progressPercent || 0}%`, background: getProgressColor(obj.progressPercent || 0) }} />
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{obj.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {full.suggestedFocus?.length > 0 && (
            <div style={{ borderRadius: "16px", padding: "20px", background: "rgba(99,102,241,0.08)", border: "1.5px solid rgba(99,102,241,0.2)" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-indigo)", marginBottom: "12px" }}>Suggested Focus</p>
              {full.suggestedFocus.map((s, i) => (
                <p key={i} style={{ fontSize: "13px", color: "var(--accent-indigo)", marginBottom: "6px", display: "flex", gap: "8px" }}><span>→</span><span>{s}</span></p>
              ))}
            </div>
          )}
          {full.strengthsToReinforce?.length > 0 && (
            <div style={{ borderRadius: "16px", padding: "20px", background: "rgba(16,185,129,0.08)", border: "1.5px solid rgba(16,185,129,0.2)" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-emerald)", marginBottom: "12px" }}>Strengths to Reinforce</p>
              {full.strengthsToReinforce.map((s, i) => (
                <p key={i} style={{ fontSize: "13px", color: "var(--accent-emerald)", marginBottom: "6px" }}>✓ {s}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BriefingSection({ title, content }) {
  return (
    <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "10px" }}>{title}</p>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{content}</p>
    </div>
  );
}

// ==================== TIMELINE ====================
function TimelinePanel({ sessions, expanded, setExpanded }) {
  const sorted = [...sessions].sort((a, b) => a.sessionNumber - b.sessionNumber);
  const reversed = [...sorted].reverse();

  const sentimentColors = {
    improving: "var(--accent-emerald)", "cautiously-improving": "var(--accent-amber)",
    stable: "var(--text-muted)", "stable-positive": "var(--accent-emerald)",
    declining: "var(--accent-rose)", concerning: "var(--accent-rose)",
    mixed: "var(--accent-amber)", "cautiously-stable": "var(--accent-amber)",
  };
  const sentimentBg = {
    improving: "rgba(16,185,129,0.1)", "cautiously-improving": "rgba(245,158,11,0.1)",
    stable: "rgba(148,163,184,0.1)", "stable-positive": "rgba(16,185,129,0.1)",
    declining: "rgba(244,63,94,0.1)", concerning: "rgba(244,63,94,0.1)",
    mixed: "rgba(245,158,11,0.1)", "cautiously-stable": "rgba(245,158,11,0.1)",
  };

  // Build a one-line summary from dapNote.data + assessment
  function getSessionSummary(s) {
    const data = s.dapNote?.data || "";
    const assessment = s.dapNote?.assessment || "";
    const combined = assessment || data;
    if (!combined) return null;
    // Truncate to ~120 chars
    return combined.length > 120 ? combined.slice(0, 117) + "…" : combined;
  }

  return (
    <div style={{ animation: "fadeInUp 0.35s ease forwards" }}>
      {/* Visual chart */}
      {sorted.length > 0 && (
        <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px", marginBottom: "20px", overflowX: "auto" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "20px" }}>
            Session Timeline — click a node to view
          </p>
          <TimelineChart
            sessions={sorted}
            sentimentColors={sentimentColors}
            expandedId={expanded}
            onSelect={id => setExpanded(prev => prev === id ? null : id)}
          />
        </div>
      )}

      {/* Session list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reversed.map((s, idx) => {
          const isOpen = expanded === s.id;
          const dotColor = sentimentColors[s.tags?.sessionSentiment] || "var(--text-muted)";
          const bgColor = sentimentBg[s.tags?.sessionSentiment] || "transparent";
          const risks = s.tags?.riskIndicators || [];
          const summary = getSessionSummary(s);

          return (
            <div key={s.id} id={`session-${s.id}`} style={{
              background: "var(--nm-bg)", boxShadow: isOpen ? "var(--nm-flat-lg)" : "var(--nm-flat)",
              borderRadius: "16px", overflow: "hidden",
              animation: `fadeInUp 0.35s ease ${idx * 40}ms both`,
              transition: "box-shadow 0.25s ease",
              scrollMarginTop: "80px",
            }}>
              <button
                onClick={() => setExpanded(isOpen ? null : s.id)}
                style={{
                  width: "100%", padding: "16px 20px",
                  display: "flex", alignItems: "flex-start", gap: "14px",
                  background: isOpen ? bgColor : "transparent",
                  border: "none", cursor: "pointer",
                  transition: "background 0.2s ease", textAlign: "left",
                }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "rgba(99,102,241,0.04)"; }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0, marginTop: "4px", background: dotColor, boxShadow: risks.length ? `0 0 0 3px ${dotColor}25` : "none" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: summary ? "5px" : 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>Session {s.sessionNumber}</span>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{s.date}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      {risks.length > 0 && (
                        <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "100px", fontWeight: 600, background: "rgba(244,63,94,0.1)", color: "var(--accent-rose)" }}>
                          {risks.length} risk
                        </span>
                      )}
                      <StatusBadge status={s.tags?.sessionSentiment} showIcon />
                      <span style={{ color: "var(--text-muted)", fontSize: "11px", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▼</span>
                    </div>
                  </div>
                  {/* One-line session summary */}
                  {summary && !isOpen && (
                    <p style={{
                      fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}>
                      {summary}
                    </p>
                  )}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: "0 20px 20px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px" }}>
                    {["data", "assessment", "plan"].map(key => (
                      <div key={key} style={{ borderRadius: "12px", padding: "14px", background: "var(--nm-bg)", boxShadow: "var(--nm-inset-sm)" }}>
                        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-indigo)", marginBottom: "8px" }}>{key}</p>
                        <p style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--text-secondary)" }}>{s.dapNote?.[key]}</p>
                      </div>
                    ))}
                  </div>
                  {(s.tags?.moodIndicators?.length > 0 || s.tags?.triggersIdentified?.length > 0 || s.tags?.copingStrategiesDiscussed?.length > 0) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.05)", fontSize: "13px", color: "var(--text-secondary)" }}>
                      {s.tags?.moodIndicators?.length > 0 && <div><span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Mood: </span>{s.tags.moodIndicators.join(", ")}</div>}
                      {s.tags?.triggersIdentified?.length > 0 && <div><span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Triggers: </span>{s.tags.triggersIdentified.join(", ")}</div>}
                      {s.tags?.copingStrategiesDiscussed?.length > 0 && <div><span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Coping: </span>{s.tags.copingStrategiesDiscussed.join(", ")}</div>}
                    </div>
                  )}
                  {risks.length > 0 && (
                    <div style={{ marginTop: "12px", borderRadius: "10px", padding: "12px 16px", background: "rgba(244,63,94,0.08)" }}>
                      {risks.map((r, i) => <p key={i} style={{ fontSize: "13px", color: "var(--accent-rose)", marginBottom: i < risks.length - 1 ? "4px" : 0 }}>⚠ {r}</p>)}
                    </div>
                  )}
                  {s.tags?.keyQuotes?.length > 0 && (
                    <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {s.tags.keyQuotes.map((q, i) => <blockquote key={i} className="quote">"{q}"</blockquote>)}
                    </div>
                  )}
                  {(s.followUpFlags || []).length > 0 && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                      {s.followUpFlags.map((f, i) => {
                        const urgent = f.startsWith("PRIORITY:") || f.startsWith("URGENT:");
                        return <p key={i} style={{ fontSize: "13px", color: urgent ? "var(--accent-rose)" : "var(--text-secondary)", fontWeight: urgent ? 600 : 400, marginBottom: "4px", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                          <span style={{ flexShrink: 0 }}>{urgent ? "●" : "→"}</span><span>{f}</span>
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
    </div>
  );
}

/* ── Clickable SVG Timeline Chart ──────────────────────── */
function TimelineChart({ sessions, sentimentColors, expandedId, onSelect }) {
  const NODE_R = 16;
  const GAP = 56;
  const PADDING_X = 60;
  const SVG_H = 160;
  const CY = 76;

  const totalW = Math.max(sessions.length * (NODE_R * 2 + GAP) - GAP + PADDING_X * 2, 400);

  const dots = sessions.map((s, i) => ({
    id: s.id,
    x: PADDING_X + i * (NODE_R * 2 + GAP) + NODE_R,
    color: sentimentColors[s.tags?.sessionSentiment] || "#94a3b8",
    label: `S${s.sessionNumber}`,
    date: s.date ? s.date.slice(5) : "",   // MM-DD
    sentiment: (s.tags?.sessionSentiment || "").replace(/-/g, " "),
    risks: (s.tags?.riskIndicators || []).length,
    isExpanded: expandedId === s.id,
  }));

  return (
    <svg
      width={totalW}
      height={SVG_H}
      style={{ display: "block", minWidth: "100%", overflow: "visible", cursor: "default" }}
    >
      {/* Connection lines */}
      {dots.slice(0, -1).map((d, i) => (
        <line key={i} x1={d.x + NODE_R} y1={CY} x2={dots[i + 1].x - NODE_R} y2={CY}
          stroke="var(--nm-shadow)" strokeWidth={2} strokeDasharray="4 4" />
      ))}

      {dots.map((d) => (
        <g
          key={d.id}
          style={{ cursor: "pointer" }}
          onClick={() => {
            onSelect(d.id);
            // Scroll the card into view
            setTimeout(() => {
              const el = document.getElementById(`session-${d.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 50);
          }}
        >
          {/* Risk glow ring */}
          {d.risks > 0 && (
            <circle cx={d.x} cy={CY} r={NODE_R + 6} fill="none" stroke={d.color} strokeWidth={1.5} opacity={0.3} />
          )}
          {/* Active ring (selected) */}
          {d.isExpanded && (
            <circle cx={d.x} cy={CY} r={NODE_R + 8} fill="none" stroke={d.color} strokeWidth={2.5} opacity={0.7} />
          )}
          {/* Main circle */}
          <circle cx={d.x} cy={CY} r={NODE_R} fill={d.color} opacity={d.isExpanded ? 1 : 0.82}
            style={{ filter: d.isExpanded ? `drop-shadow(0 0 6px ${d.color})` : "none" }} />
          {/* Label */}
          <text x={d.x} y={CY} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={10} fontWeight={700}>
            {d.label}
          </text>

          {/* Date below node */}
          <text x={d.x} y={CY + NODE_R + 14} textAnchor="middle" fill="var(--text-muted)" fontSize={10} fontWeight={500}>
            {d.date}
          </text>

          {/* Sentiment above node */}
          <text x={d.x} y={CY - NODE_R - 10} textAnchor="middle" fill={d.color} fontSize={10} fontWeight={500}>
            {d.sentiment.length > 12 ? d.sentiment.slice(0, 11) + "…" : d.sentiment}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ==================== OUTCOMES ====================
function OutcomesPanel({ outcomes, loading }) {
  if (loading) return (
    <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "32px" }}>
      <LoadingState message="Analyzing outcomes..." lines={6} />
    </div>
  );
  if (!outcomes) return null;

  const overall = outcomes.overallScore;
  const domains = outcomes.domainScores || [];
  const interventions = (outcomes.interventions || outcomes.interventionEffectiveness || []).slice(0, 3);
  const recs = outcomes.topRecommendations || outcomes.evidenceBasedRecommendations || [];
  const supervision = outcomes.supervisionPoints || outcomes.supervisionTalkingPoints || [];

  const trendIcon  = { improving: "↑", stable: "→", declining: "↓", mixed: "↕" };
  const trendColor = { improving: "var(--accent-emerald)", stable: "var(--text-muted)", declining: "var(--accent-rose)", mixed: "var(--accent-amber)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeInUp 0.35s ease forwards" }}>

      {/* Overall score */}
      {overall && (
        <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <ScoreRing score={overall.score} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{overall.label}</h3>
                <span style={{ fontSize: "20px", fontWeight: 700, color: trendColor[overall.trend] }}>{trendIcon[overall.trend] || ""}</span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{overall.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recovery Domains — radar + bars side by side */}
      {domains.length > 0 && (
        <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "20px" }}>
            Recovery Domains — Radar View
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "32px" }}>
            {domains.length >= 3 && <RadarChart domains={domains} />}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
              {domains.map((d, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{d.domain}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: trendColor[d.trend] || "var(--text-primary)" }}>
                      {d.score}/100 {trendIcon[d.trend] || ""}
                    </span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: "4px" }}>
                    <div className="progress-bar-fill" style={{ width: `${d.score}%`, background: getProgressColor(d.score) }} />
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>{d.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Intervention Effectiveness — 3 KPI Cards */}
      {interventions.length > 0 && (
        <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "6px" }}>
            Intervention Effectiveness
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
            How well each clinical technique is working based on documented sessions
          </p>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(interventions.length, 3)}, 1fr)`, gap: "14px" }}>
            {interventions.map((intv, i) => {
              const score = intv.effectivenessScore ?? intv.score ?? 50;
              const name = intv.name || intv.intervention || "Technique";
              const sessions = intv.sessionsUsed;
              const verdict = intv.recommendation || intv.verdict || "";
              const color = getProgressColor(score);
              const gradients = [
                "linear-gradient(135deg, #6366f1, #818cf8)",
                "linear-gradient(135deg, #10b981, #34d399)",
                "linear-gradient(135deg, #f59e0b, #fbbf24)",
              ];
              // Effectiveness label
              const effectLabel = score >= 75 ? "Highly effective" : score >= 50 ? "Moderately effective" : "Needs review";
              // Use SVG icons instead of emojis
              const effectIconPath = score >= 75
                ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"  // check circle
                : score >= 50
                ? "M13 10V3L4 14h7v7l9-11h-7z"                      // bolt
                : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"; // warning

              return (
                <div key={i} style={{
                  borderRadius: "16px", padding: "20px",
                  background: "var(--nm-bg)", boxShadow: "var(--nm-inset-sm)",
                  display: "flex", flexDirection: "column", gap: "12px",
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: gradients[i % 3],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={effectIconPath} />
                      </svg>
                    </div>
                    <div style={{
                      fontSize: "28px", fontWeight: 800, color,
                      lineHeight: 1,
                    }}>{score}%</div>
                  </div>

                  {/* Technique name */}
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{name}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{effectLabel}</p>
                  </div>

                  {/* Arc-style mini gauge */}
                  <MiniGauge score={score} color={color} />

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
                    {sessions && (
                      <div style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: "8px", background: "rgba(99,102,241,0.08)" }}>
                        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--accent-indigo)" }}>{sessions}</div>
                        <div style={{ color: "var(--text-muted)" }}>sessions</div>
                      </div>
                    )}
                    <div style={{ flex: 2, padding: "6px", borderRadius: "8px", background: "rgba(0,0,0,0.04)" }}>
                      <div style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4 }}>{verdict}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <div style={{ borderRadius: "20px", padding: "24px", background: "rgba(99,102,241,0.07)", border: "1.5px solid rgba(99,102,241,0.2)" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-indigo)", marginBottom: "16px" }}>Recommendations</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recs.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0, marginTop: "1px", background: r.priority === "high" ? "var(--accent-rose)" : "var(--accent-amber)" }}>{i + 1}</span>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--accent-indigo)", marginBottom: "2px" }}>{r.action || r.recommendation || r.observation}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{r.basis || r.clinicalBasis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supervision */}
      {supervision.length > 0 && (
        <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "14px" }}>Supervision Talking Points</p>
          {supervision.map((p, i) => (
            <p key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px", display: "flex", gap: "8px", lineHeight: 1.5 }}>
              <span style={{ color: "var(--accent-indigo)", flexShrink: 0 }}>•</span>
              {typeof p === "string" ? p : p.point || JSON.stringify(p)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Mini arc gauge for KPI cards ──────────────────────── */
function MiniGauge({ score, color }) {
  const W = 100, H = 52;
  const CX = W / 2, CY = H;
  const R = 40;
  const ARC_START = 180; // degrees
  const ARC_TOTAL = 180;
  const angle = (score / 100) * ARC_TOTAL;

  function polar(cx, cy, r, deg) {
    const rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const start = polar(CX, CY, R, ARC_START);
  const end = polar(CX, CY, R, ARC_START + angle);
  const largeArc = angle > 180 ? 1 : 0;

  const bgStart = polar(CX, CY, R, ARC_START);
  const bgEnd = polar(CX, CY, R, ARC_START + ARC_TOTAL);

  return (
    <svg width={W} height={H + 4} style={{ display: "block", margin: "0 auto" }}>
      {/* Background arc */}
      <path d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 1 1 ${bgEnd.x} ${bgEnd.y}`}
        fill="none" stroke="var(--nm-shadow)" strokeWidth={6} strokeLinecap="round" opacity={0.4} />
      {/* Value arc */}
      {score > 0 && (
        <path d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none" stroke={color} strokeWidth={6} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      )}
    </svg>
  );
}

/* ── Radar Chart — fixed labels with multi-word wrapping ───────────── */
function RadarChart({ domains }) {
  const SIZE = 260;
  const CX = SIZE / 2, CY = SIZE / 2;
  const R = 80;          // polygon radius
  const LABEL_R = R + 34; // labels further out to avoid clipping
  const count = Math.min(domains.length, 6);
  const domainSlice = domains.slice(0, count);

  function polar(angle, radius) {
    const rad = (angle - 90) * (Math.PI / 180);
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
  }

  const step = 360 / count;
  const axes = domainSlice.map((d, i) => ({
    angle: i * step,
    label: d.domain || `D${i + 1}`,
    value: Math.max(0, Math.min(100, d.score || 0)) / 100,
  }));

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];

  // Data polygon
  const dataPoints = axes.map(({ angle, value }) => polar(angle, R * value));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg width={SIZE} height={SIZE} style={{ flexShrink: 0 }}>
      {/* Grid rings */}
      {rings.map((r, ri) => {
        const pts = axes.map(({ angle }) => polar(angle, R * r));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
        return <path key={ri} d={path} fill="none" stroke="var(--nm-shadow)" strokeWidth={1} opacity={0.45} />;
      })}

      {/* Axis lines */}
      {axes.map(({ angle }, i) => {
        const end = polar(angle, R);
        return <line key={i} x1={CX} y1={CY} x2={end.x.toFixed(1)} y2={end.y.toFixed(1)} stroke="var(--nm-shadow)" strokeWidth={1} opacity={0.4} />;
      })}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.85)" strokeWidth={2} strokeLinejoin="round" />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={4} fill="var(--accent-indigo)" stroke="white" strokeWidth={1.5} />
      ))}

      {/* Labels — split into words and wrap up to 2 lines */}
      {axes.map(({ angle, label }, i) => {
        const pos = polar(angle, LABEL_R);
        const anchor = pos.x < CX - 5 ? "end" : pos.x > CX + 5 ? "start" : "middle";
        // Split into at most 2 lines
        const words = label.split(" ");
        const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        return (
          <text key={i}
            x={pos.x.toFixed(1)} y={pos.y.toFixed(1)}
            textAnchor={anchor}
            dominantBaseline="central"
            fontSize={9.5} fontWeight={600}
            fill="var(--text-secondary)"
          >
            <tspan x={pos.x.toFixed(1)} dy="-0.55em">{line1}</tspan>
            {line2 && <tspan x={pos.x.toFixed(1)} dy="1.2em">{line2}</tspan>}
          </text>
        );
      })}
    </svg>
  );
}

// ==================== SHARED HELPERS ====================
function getProgressColor(score) {
  if (score >= 70) return "var(--accent-emerald)";
  if (score >= 40) return "var(--accent-amber)";
  return "var(--accent-rose)";
}

function ScoreRing({ score }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const color = getProgressColor(score);
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0 }}>
      <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r={radius} fill="none" stroke="var(--nm-shadow)" strokeWidth="7" opacity={0.4} />
        <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color }}>{score}</div>
    </div>
  );
}
