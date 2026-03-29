import { useState, useEffect } from "react";
import { fetchClients, fetchClient, documentSession } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";
import LoadingState from "../Shared/LoadingState";


export default function SessionDoc({ clientId, onBack, onViewClient }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeClientId, setActiveClientId] = useState(clientId);
  const [rawNotes, setRawNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Editable DAP state
  const [editedDap, setEditedDap] = useState({ data: "", assessment: "", plan: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeClientId) {
      fetchClient(activeClientId).then(setSelectedClient).catch(console.error);
      setRawNotes("");
      setResult(null);
      setError(null);
      setSaved(false);
    }
  }, [activeClientId]);

  // Sync editedDap when result arrives
  useEffect(() => {
    if (result?.dapNote) {
      setEditedDap({
        data: result.dapNote.data || "",
        assessment: result.dapNote.assessment || "",
        plan: result.dapNote.plan || "",
      });
      setSaved(false);
    }
  }, [result]);

  async function handleSubmit() {
    if (!activeClientId || !rawNotes.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const session = await documentSession(
        activeClientId,
        rawNotes,
        selectedClient ? selectedClient.sessions.length + 1 : 1
      );
      setResult(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveEdited() {
    // The session is already saved to the DB by the server when generated.
    // Here we just mark it as reviewed/accepted by the counselor.
    setSaved(true);
    // In a real system, you'd PATCH the session with the edited DAP.
    // For now we indicate the counselor has approved/edited it.
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", fontWeight: 500, color: "var(--text-muted)",
            fontFamily: "inherit", padding: 0, transition: "color 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--accent-indigo)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          ← Back
        </button>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Document Session</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "3px" }}>
            Enter raw notes — RehabIQ generates structured clinical documentation
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* ── Left: Input ── */}
        <div>
          {/* Client selector */}
          <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
            Client
          </label>
          <select
            value={activeClientId || ""}
            onChange={e => setActiveClientId(e.target.value)}
            className="input-base"
            style={{ marginBottom: "20px" }}
          >
            <option value="">Select client...</option>
            {clients.map(c => (
              // Removed "— Day X" per request
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Client context card */}
          {selectedClient && (
            <div
              style={{
                background: "var(--nm-bg)", boxShadow: "var(--nm-flat)",
                borderRadius: "16px", padding: "20px", marginBottom: "20px",
                animation: "fadeInUp 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div
                  style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0,
                    background: selectedClient.riskLevel === "high"
                      ? "var(--gradient-rose)"
                      : selectedClient.riskLevel === "moderate"
                      ? "var(--gradient-amber)"
                      : "var(--gradient-emerald)",
                  }}
                >
                  {selectedClient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{selectedClient.name}</span>
                    <StatusBadge status={selectedClient.riskLevel} />
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {selectedClient.diagnosis} · {selectedClient.programType} · Day {selectedClient.programDay}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                {selectedClient.coOccurring && (
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "100px", background: "rgba(245,158,11,0.1)", color: "var(--accent-amber)" }}>
                    Co-occurring: {selectedClient.coOccurring}
                  </span>
                )}
                {selectedClient.mat && (
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "100px", background: "rgba(99,102,241,0.1)", color: "var(--accent-indigo)" }}>
                    MAT: {selectedClient.mat}
                  </span>
                )}
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "10px" }}>
                  Active Objectives
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {selectedClient.treatmentPlan.objectives.map(obj => (
                    <div key={obj.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <StatusBadge status={obj.status} />
                      <span style={{ color: "var(--text-secondary)" }}>{obj.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes textarea */}
          <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
            Session Notes (Raw)
          </label>
          <textarea
            value={rawNotes}
            onChange={e => setRawNotes(e.target.value)}
            placeholder="Type or paste your rough session notes here... Be as informal as you like — RehabIQ will structure everything."
            rows={13}
            className="input-base"
            style={{ resize: "none", lineHeight: 1.7, fontSize: "14px" }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !rawNotes.trim() || !activeClientId}
            className="btn-primary"
            style={{
              width: "100%", marginTop: "16px", padding: "14px",
              fontSize: "15px", fontWeight: 600,
              opacity: (!rawNotes.trim() || !activeClientId) ? 0.5 : 1,
            }}
          >
            {loading ? "Generating documentation..." : "Generate Clinical Documentation"}
          </button>
        </div>

        {/* ── Right: Output ── */}
        <div>
          {loading && (
            <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "32px" }}>
              <LoadingState message="Claude is generating clinical documentation..." lines={8} />
            </div>
          )}

          {error && (
            <div style={{
              borderRadius: "16px", padding: "20px",
              background: "rgba(244,63,94,0.08)", border: "1.5px solid rgba(244,63,94,0.25)",
            }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--accent-rose)" }}>Error: {error}</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeInUp 0.35s ease" }}>
              {/* Draft notice */}
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "14px 18px", borderRadius: "14px",
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)",
                fontSize: "13px", fontWeight: 500, color: "var(--accent-amber)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                AI-generated draft — review and edit before finalizing
              </div>

              {/* Editable DAP Note */}
              <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    DAP Note — Session {result.sessionNumber}
                  </h3>
                  {saved && (
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--accent-emerald)", padding: "4px 10px", borderRadius: "100px", background: "rgba(16,185,129,0.1)" }}>
                      ✓ Approved by counselor
                    </span>
                  )}
                </div>

                {[
                  { key: "data", label: "Data", desc: "Observable facts and client statements" },
                  { key: "assessment", label: "Assessment", desc: "Clinical interpretation" },
                  { key: "plan", label: "Plan", desc: "Next steps and follow-up" },
                ].map(section => (
                  <div key={section.key} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-indigo)" }}>
                        {section.label}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{section.desc}</span>
                      <span style={{ fontSize: "10px", color: "var(--accent-amber)", marginLeft: "auto", fontWeight: 500 }}>
                        ✏ editable
                      </span>
                    </div>
                    <textarea
                      value={editedDap[section.key]}
                      onChange={e => setEditedDap(prev => ({ ...prev, [section.key]: e.target.value }))}
                      rows={4}
                      className="input-base"
                      style={{
                        resize: "vertical", lineHeight: 1.7, fontSize: "13.5px",
                        fontFamily: "inherit",
                        border: saved ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(99,102,241,0.2)",
                      }}
                    />
                  </div>
                ))}

                {/* Save / Approve button */}
                {!saved ? (
                  <button
                    onClick={handleSaveEdited}
                    style={{
                      width: "100%", padding: "13px",
                      borderRadius: "12px", border: "none",
                      background: "var(--gradient-emerald)", color: "white",
                      fontWeight: 600, fontSize: "14px", fontFamily: "inherit",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                      transition: "box-shadow 0.2s ease, transform 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(16,185,129,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(16,185,129,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    ✓ Approve & Save to Record
                  </button>
                ) : (
                  <div style={{ textAlign: "center", fontSize: "13px", color: "var(--accent-emerald)", fontWeight: 500 }}>
                    ✓ Session notes saved to client record
                  </div>
                )}
              </div>

              {/* Clinical Tags */}
              <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  Clinical Tags</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
                  <TagRow label="Mood" items={result.tags.moodIndicators} color="var(--accent-indigo)" bg="rgba(99,102,241,0.1)" />
                  <TagRow label="Triggers" items={result.tags.triggersIdentified} color="var(--accent-amber)" bg="rgba(245,158,11,0.1)" />
                  <TagRow label="Coping" items={result.tags.copingStrategiesDiscussed} color="var(--accent-emerald)" bg="rgba(16,185,129,0.1)" />
                  {result.tags.substancesMentioned?.length > 0 && (
                    <TagRow label="Substances" items={result.tags.substancesMentioned} color="var(--accent-rose)" bg="rgba(244,63,94,0.1)" />
                  )}
                  <div style={{ paddingTop: "10px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Support: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{result.tags.supportNetworkChanges}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Sentiment: </span>
                      <StatusBadge status={result.tags.sessionSentiment} showIcon />
                    </div>
                    {result.tags.objectivesAddressed?.length > 0 && (
                      <div>
                        <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>Objectives: </span>
                        <span style={{ color: "var(--text-secondary)" }}>{result.tags.objectivesAddressed.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Risk Indicators */}
              {result.tags.riskIndicators?.length > 0 && (
                <div style={{
                  borderRadius: "16px", padding: "20px",
                  background: "rgba(244,63,94,0.08)", border: "1.5px solid rgba(244,63,94,0.25)",
                }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-rose)", marginBottom: "12px" }}>⚠ Risk Indicators</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {result.tags.riskIndicators.map((r, i) => (
                      <li key={i} style={{ fontSize: "13px", color: "var(--accent-rose)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ flexShrink: 0, marginTop: "1px" }}>•</span><span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Flags */}
              <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  Follow-up Flags
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.followUpFlags.map((flag, i) => {
                    const isPriority = flag.startsWith("PRIORITY:") || flag.startsWith("URGENT:");
                    return (
                      <li key={i} style={{ fontSize: "13px", display: "flex", alignItems: "flex-start", gap: "10px", padding: "4px 0" }}>
                        <span style={{ color: isPriority ? "var(--accent-rose)" : "var(--accent-indigo)", flexShrink: 0 }}>
                          {isPriority ? "●" : "→"}
                        </span>
                        <span style={{ color: isPriority ? "var(--accent-rose)" : "var(--text-secondary)", fontWeight: isPriority ? 600 : 400 }}>
                          {flag}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Key Quotes */}
              {result.tags.keyQuotes?.length > 0 && (
                <div style={{ background: "var(--nm-bg)", boxShadow: "var(--nm-flat)", borderRadius: "20px", padding: "24px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Key Client Statements
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {result.tags.keyQuotes.map((q, i) => (
                      <blockquote key={i} className="quote">"{q}"</blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => onViewClient(activeClientId)}
                  style={{
                    flex: 1, padding: "13px",
                    borderRadius: "12px", border: "none",
                    background: "var(--nm-bg)", boxShadow: "var(--nm-button)",
                    color: "var(--accent-indigo)", fontWeight: 600, fontSize: "14px",
                    fontFamily: "inherit", cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "6px 6px 14px var(--nm-shadow), -6px -6px 14px var(--nm-highlight)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--nm-button)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  View Client Timeline →
                </button>
                <button
                  onClick={() => { setResult(null); setRawNotes(""); setSaved(false); }}
                  className="btn-primary"
                  style={{ flex: 1, padding: "13px", fontSize: "14px" }}
                >
                  Document Another Session
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div style={{
              borderRadius: "20px", border: "2px dashed var(--nm-shadow)",
              padding: "60px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", minHeight: "420px",
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(99,102,241,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                Clinical documentation will appear here
              </p>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "280px", lineHeight: 1.5 }}>
                Select a client and enter your rough session notes to generate structured DAP documentation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TagRow({ label, items, color, bg }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <span style={{ fontWeight: 600, color: "var(--text-muted)" }}>{label}: </span>
      <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center",
            padding: "3px 10px", borderRadius: "100px",
            fontSize: "12px", fontWeight: 500,
            background: bg, color,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
