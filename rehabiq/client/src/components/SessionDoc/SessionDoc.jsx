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

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-sm flex items-center gap-1 transition-base"
          style={{ color: "#9ca3af" }}
          onMouseEnter={(e) => e.target.style.color = "var(--clr-primary)"}
          onMouseLeave={(e) => e.target.style.color = "#9ca3af"}>
          ← Back
        </button>
        <h2 className="text-xl font-semibold" style={{ color: "var(--clr-slate)" }}>
          Document session
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Input */}
        <div>
          {/* Client selector */}
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#9ca3af" }}>
            Client
          </label>
          <select
            value={activeClientId || ""}
            onChange={(e) => setActiveClientId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border text-sm mb-4 outline-none"
            style={{
              borderColor: "var(--clr-border)",
              background: "var(--clr-card)",
              color: "var(--clr-slate)",
            }}
          >
            <option value="">Select client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — Day {c.programDay}
              </option>
            ))}
          </select>

          {/* Client context card */}
          {selectedClient && (
            <div className="rounded-lg border p-4 mb-4 text-xs animate-fade-in"
              style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm" style={{ color: "var(--clr-slate)" }}>
                  {selectedClient.name}
                </span>
                <StatusBadge status={selectedClient.riskLevel} />
              </div>
              <div className="space-y-1" style={{ color: "#9ca3af" }}>
                <p>{selectedClient.diagnosis}</p>
                <p>{selectedClient.programType} • Day {selectedClient.programDay}</p>
                {selectedClient.coOccurring && <p>Co-occurring: {selectedClient.coOccurring}</p>}
                {selectedClient.mat && <p>MAT: {selectedClient.mat}</p>}
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--clr-border)" }}>
                <p className="font-medium mb-1" style={{ color: "var(--clr-slate)" }}>Active objectives:</p>
                {selectedClient.treatmentPlan.objectives.map((obj) => (
                  <div key={obj.id} className="flex items-center gap-2 mt-1">
                    <StatusBadge status={obj.status} />
                    <span>{obj.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes input */}
          <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: "#9ca3af" }}>
            Session notes (raw)
          </label>
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Type or paste your rough session notes here..."
            rows={12}
            className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none leading-relaxed"
            style={{
              borderColor: "var(--clr-border)",
              background: "var(--clr-card)",
              color: "var(--clr-slate)",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--clr-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--clr-border)"}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !rawNotes.trim() || !activeClientId}
            className="mt-4 w-full py-3 rounded-lg text-sm font-medium text-white transition-base"
            style={{
              background: loading ? "#9ca3af" : "var(--clr-primary)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: (!rawNotes.trim() || !activeClientId) ? 0.5 : 1,
            }}
          >
            {loading ? "Generating documentation..." : "Generate clinical documentation"}
          </button>
        </div>

        {/* Right: Output */}
        <div>
          {loading && (
            <div className="rounded-xl border p-6" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
              <LoadingState message="Claude is generating clinical documentation..." lines={6} />
            </div>
          )}

          {error && (
            <div className="rounded-xl border p-5 animate-fade-in" style={{ background: "var(--clr-danger-light)", borderColor: "var(--clr-danger)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--clr-danger)" }}>Error: {error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-fade-in">
              {/* Draft watermark */}
              <div className="rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-2"
                style={{ background: "var(--clr-amber-light)", color: "var(--clr-warning)" }}>
                <span>⚠</span> Draft — counselor review required before finalizing
              </div>

              {/* DAP Note */}
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--clr-slate)" }}>
                  DAP Note — Session {result.sessionNumber}
                </h3>

                {[
                  { key: "data", label: "Data", desc: "Observable facts and client statements" },
                  { key: "assessment", label: "Assessment", desc: "Clinical interpretation" },
                  { key: "plan", label: "Plan", desc: "Next steps and follow-up" },
                ].map((section) => (
                  <div key={section.key} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--clr-primary)" }}>
                        {section.label}
                      </span>
                      <span className="text-[10px]" style={{ color: "#9ca3af" }}>{section.desc}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
                      {result.dapNote[section.key]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Clinical Tags */}
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--clr-slate)" }}>
                  Clinical tags
                </h3>
                <div className="space-y-3 text-xs">
                  <TagRow label="Mood" items={result.tags.moodIndicators} color="var(--clr-primary)" bg="var(--clr-primary-light)" />
                  <TagRow label="Triggers" items={result.tags.triggersIdentified} color="var(--clr-warning)" bg="var(--clr-amber-light)" />
                  <TagRow label="Coping strategies" items={result.tags.copingStrategiesDiscussed} color="var(--clr-success)" bg="var(--clr-success-light)" />
                  {result.tags.substancesMentioned?.length > 0 && (
                    <TagRow label="Substances" items={result.tags.substancesMentioned} color="var(--clr-danger)" bg="var(--clr-danger-light)" />
                  )}
                  <div>
                    <span className="font-medium" style={{ color: "#9ca3af" }}>Support network: </span>
                    <span style={{ color: "#4b5563" }}>{result.tags.supportNetworkChanges}</span>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: "#9ca3af" }}>Sentiment: </span>
                    <StatusBadge status={result.tags.sessionSentiment} showIcon />
                  </div>
                  {result.tags.objectivesAddressed?.length > 0 && (
                    <div>
                      <span className="font-medium" style={{ color: "#9ca3af" }}>Objectives addressed: </span>
                      <span style={{ color: "#4b5563" }}>{result.tags.objectivesAddressed.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Indicators */}
              {result.tags.riskIndicators?.length > 0 && (
                <div className="rounded-xl border-2 p-5 animate-fade-in"
                  style={{ borderColor: "var(--clr-danger)", background: "var(--clr-danger-light)" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--clr-danger)" }}>
                    ⚠ Risk indicators identified
                  </h3>
                  <ul className="space-y-1.5">
                    {result.tags.riskIndicators.map((r, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--clr-danger)" }}>
                        <span className="mt-0.5">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Follow-up Flags */}
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--clr-slate)" }}>
                  Follow-up flags
                </h3>
                <ul className="space-y-2">
                  {result.followUpFlags.map((flag, i) => {
                    const isPriority = flag.startsWith("PRIORITY:") || flag.startsWith("URGENT:");
                    return (
                      <li key={i} className="text-xs flex items-start gap-2">
                        <span className={`mt-0.5 ${isPriority ? "pulse-soft" : ""}`}
                          style={{ color: isPriority ? "var(--clr-danger)" : "var(--clr-primary)" }}>
                          {isPriority ? "🔴" : "→"}
                        </span>
                        <span style={{ color: isPriority ? "var(--clr-danger)" : "#4b5563", fontWeight: isPriority ? 600 : 400 }}>
                          {flag}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Key Quotes */}
              {result.tags.keyQuotes?.length > 0 && (
                <div className="rounded-xl border p-5" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--clr-slate)" }}>
                    Key client statements
                  </h3>
                  {result.tags.keyQuotes.map((q, i) => (
                    <blockquote key={i} className="text-sm italic border-l-2 pl-3 py-1 mb-2 last:mb-0"
                      style={{ borderColor: "var(--clr-primary)", color: "#4b5563" }}>
                      "{q}"
                    </blockquote>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => onViewClient(activeClientId)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-base"
                  style={{ borderColor: "var(--clr-primary)", color: "var(--clr-primary)" }}>
                  View client timeline
                </button>
                <button
                  onClick={() => { setResult(null); setRawNotes(""); }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition-base"
                  style={{ background: "var(--clr-primary)" }}>
                  Document another session
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="rounded-xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center"
              style={{ borderColor: "#d1d5db" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: "var(--clr-primary-light)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--clr-slate)" }}>
                Clinical documentation will appear here
              </p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                Select a client and enter your session notes to generate structured documentation
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
      <span className="font-medium" style={{ color: "#9ca3af" }}>{label}: </span>
      <div className="inline-flex flex-wrap gap-1.5 mt-1">
        {items.map((item, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full" style={{ background: bg, color }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
