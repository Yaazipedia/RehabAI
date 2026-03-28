import { useState, useEffect } from "react";
import { fetchClients, fetchClient, documentSession } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";
import LoadingState from "../Shared/LoadingState";

const DEMO_NOTES = {
  "client-001": `Marcus came in agitated today. Said his boss gave him a written warning on Friday. Couldn't sleep all weekend. He went to the bar parking lot on Saturday night but says he didn't go in — called his sponsor after and talked for 30 minutes. Only went to 1 meeting this week. He's angry — at his boss, at himself. We talked about how anger is a trigger for him. Did a safety check — no SI, but he said 'what's the point of all this if I'm gonna lose my job anyway.' We rebuilt his crisis plan and updated his trigger list.`,
  "client-002": `Sarah is having a good week. Hit 60 days at work — she's proud. Anxiety is less frequent, maybe 2-3 times a week instead of daily. Weekly calls with Rachel are happening. She brought up wanting to go back to community college in the fall for graphic design. NA attendance steady at 2x/week. She's made a friend in the women's group named Kesha. Suboxone still 100%. No cravings.`,
};

export default function SessionDoc({ clientId, onBack, onViewClient }) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeClientId, setActiveClientId] = useState(clientId);
  const [rawNotes, setRawNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeClientId) {
      fetchClient(activeClientId).then(setSelectedClient).catch(console.error);
      setRawNotes(DEMO_NOTES[activeClientId] || "");
      setResult(null);
      setError(null);
    }
  }, [activeClientId]);

  async function handleSubmit() {
    if (!activeClientId || !rawNotes.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const session = await documentSession(activeClientId, rawNotes, selectedClient ? selectedClient.sessions.length + 1 : 1);
      setResult(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <button onClick={onBack} className="text-sm font-medium transition-base" style={{ color: "var(--clr-muted)" }}
          onMouseEnter={(e) => e.target.style.color = "var(--clr-primary)"}
          onMouseLeave={(e) => e.target.style.color = "var(--clr-muted)"}>
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--clr-slate)" }}>Document session</h2>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--clr-muted)" }}>
            Enter raw notes and RehabIQ generates structured clinical documentation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div>
          {/* Client selector */}
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
            Client
          </label>
          <select
            value={activeClientId || ""}
            onChange={(e) => setActiveClientId(e.target.value)}
            className="input-base mb-4"
          >
            <option value="">Select client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — Day {c.programDay}</option>
            ))}
          </select>

          {/* Client context card */}
          {selectedClient && (
            <div className="card p-4 mb-4 animate-fade-in">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{
                    background: selectedClient.riskLevel === "high" ? "linear-gradient(135deg, #dc2626, #ef4444)"
                      : selectedClient.riskLevel === "moderate" ? "linear-gradient(135deg, #d97706, #f59e0b)"
                      : "linear-gradient(135deg, #059669, #10b981)"
                  }}>
                  {selectedClient.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: "var(--clr-slate)" }}>{selectedClient.name}</span>
                    <StatusBadge status={selectedClient.riskLevel} />
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--clr-muted)" }}>
                    {selectedClient.diagnosis} • {selectedClient.programType} • Day {selectedClient.programDay}
                  </p>
                </div>
              </div>

              {selectedClient.coOccurring && (
                <p className="text-[11px] mb-2 px-2.5 py-1 rounded-lg inline-block"
                  style={{ background: "var(--clr-amber-light)", color: "var(--clr-warning)" }}>
                  Co-occurring: {selectedClient.coOccurring}
                </p>
              )}
              {selectedClient.mat && (
                <p className="text-[11px] mb-2 ml-1 px-2.5 py-1 rounded-lg inline-block"
                  style={{ background: "var(--clr-primary-light)", color: "var(--clr-primary)" }}>
                  MAT: {selectedClient.mat}
                </p>
              )}

              <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--clr-border)" }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--clr-muted)" }}>
                  Active objectives
                </p>
                <div className="space-y-1.5">
                  {selectedClient.treatmentPlan.objectives.map((obj) => (
                    <div key={obj.id} className="flex items-center gap-2 text-[12px]">
                      <StatusBadge status={obj.status} />
                      <span style={{ color: "var(--clr-slate-mid)" }}>{obj.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes input */}
          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
            Session notes (raw)
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Type or paste your rough session notes here... Be as informal as you like — RehabIQ will structure everything."
            rows={14}
            className="input-base resize-none leading-relaxed"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !rawNotes.trim() || !activeClientId}
            className="btn-primary w-full mt-4 py-3"
            style={{ opacity: (!rawNotes.trim() || !activeClientId) ? 0.5 : 1 }}
          >
            {loading ? "⏳ Generating documentation..." : "Generate clinical documentation"}
          </button>
        </div>

        {/* Right: Output */}
        <div>
          {loading && (
            <div className="card p-6">
              <LoadingState message="Claude is generating clinical documentation..." lines={8} />
            </div>
          )}

          {error && (
            <div className="card p-5 animate-fade-in" style={{ background: "var(--clr-danger-light)", borderColor: "var(--clr-danger-border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--clr-danger)" }}>Error: {error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-in">
              {/* Draft watermark */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ background: "var(--clr-amber-light)", color: "var(--clr-warning)", border: "1px solid var(--clr-amber-border)" }}>
                <span>⚠</span> Draft — counselor review required before finalizing
              </div>

              {/* DAP Note */}
              <div className="card p-6">
                <h3 className="text-[15px] font-bold mb-5" style={{ color: "var(--clr-slate)" }}>
                  📋 DAP Note — Session {result.sessionNumber}
                </h3>
                {[
                  { key: "data", label: "Data", desc: "Observable facts and client statements" },
                  { key: "assessment", label: "Assessment", desc: "Clinical interpretation" },
                  { key: "plan", label: "Plan", desc: "Next steps and follow-up" },
                ].map((section) => (
                  <div key={section.key} className="mb-5 last:mb-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--clr-primary)" }}>
                        {section.label}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--clr-muted)" }}>{section.desc}</span>
                    </div>
                    <p className="text-[13.5px] leading-[1.7]" style={{ color: "var(--clr-slate-mid)" }}>
                      {result.dapNote[section.key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Clinical Tags */}
              <div className="card p-6">
                <h3 className="text-[15px] font-bold mb-4" style={{ color: "var(--clr-slate)" }}>🏷️ Clinical tags</h3>
                <div className="space-y-3 text-[12.5px]">
                  <TagRow label="Mood" items={result.tags.moodIndicators} color="var(--clr-primary)" bg="var(--clr-primary-light)" />
                  <TagRow label="Triggers" items={result.tags.triggersIdentified} color="var(--clr-warning)" bg="var(--clr-amber-light)" />
                  <TagRow label="Coping" items={result.tags.copingStrategiesDiscussed} color="var(--clr-success)" bg="var(--clr-success-light)" />
                  {result.tags.substancesMentioned?.length > 0 && (
                    <TagRow label="Substances" items={result.tags.substancesMentioned} color="var(--clr-danger)" bg="var(--clr-danger-light)" />
                  )}
                  <div className="pt-2 border-t" style={{ borderColor: "var(--clr-border)" }}>
                    <span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Support: </span>
                    <span style={{ color: "var(--clr-slate-mid)" }}>{result.tags.supportNetworkChanges}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Sentiment: </span>
                      <StatusBadge status={result.tags.sessionSentiment} showIcon />
                    </div>
                    {result.tags.objectivesAddressed?.length > 0 && (
                      <div>
                        <span className="font-semibold" style={{ color: "var(--clr-muted)" }}>Objectives: </span>
                        <span style={{ color: "var(--clr-slate-mid)" }}>{result.tags.objectivesAddressed.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Risk Indicators */}
              {result.tags.riskIndicators?.length > 0 && (
                <div className="p-5 rounded-xl animate-fade-in"
                  style={{ background: "var(--clr-danger-light)", border: "1.5px solid var(--clr-danger-border)" }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: "var(--clr-danger)" }}>⚠ Risk indicators</h3>
                  <ul className="space-y-2">
                    {result.tags.riskIndicators.map((r, i) => (
                      <li key={i} className="text-[12.5px] flex items-start gap-2" style={{ color: "var(--clr-danger)" }}>
                        <span className="mt-0.5 flex-shrink-0">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Flags */}
              <div className="card p-6">
                <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--clr-slate)" }}>🚩 Follow-up flags</h3>
                <ul className="space-y-2">
                  {result.followUpFlags.map((flag, i) => {
                    const isPriority = flag.startsWith("PRIORITY:") || flag.startsWith("URGENT:");
                    return (
                      <li key={i} className="text-[12.5px] flex items-start gap-2.5 py-1">
                        <span className={`mt-0.5 flex-shrink-0 ${isPriority ? "pulse-soft" : ""}`}
                          style={{ color: isPriority ? "var(--clr-danger)" : "var(--clr-primary)" }}>
                          {isPriority ? "🔴" : "→"}
                        </span>
                        <span style={{ color: isPriority ? "var(--clr-danger)" : "var(--clr-slate-mid)", fontWeight: isPriority ? 600 : 400 }}>
                          {flag}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Key Quotes */}
              {result.tags.keyQuotes?.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-[15px] font-bold mb-3" style={{ color: "var(--clr-slate)" }}>💬 Key client statements</h3>
                  <div className="space-y-3">
                    {result.tags.keyQuotes.map((q, i) => (
                      <blockquote key={i} className="quote">"{q}"</blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button onClick={() => onViewClient(activeClientId)} className="btn-outline flex-1 py-2.5">
                  View client timeline →
                </button>
                <button onClick={() => { setResult(null); setRawNotes(""); }} className="btn-primary flex-1 py-2.5">
                  Document another session
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="rounded-2xl border-2 border-dashed p-14 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              style={{ borderColor: "#cbd5e1" }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "var(--clr-primary-light)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--clr-slate)" }}>
                Clinical documentation will appear here
              </p>
              <p className="text-[13px] max-w-[280px]" style={{ color: "var(--clr-muted)" }}>
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
      <span className="font-semibold" style={{ color: "var(--clr-muted)" }}>{label}: </span>
      <div className="inline-flex flex-wrap gap-1.5 mt-1">
        {items.map((item, i) => (
          <span key={i} className="tag" style={{ background: bg, color }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
