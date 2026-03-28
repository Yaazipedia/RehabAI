import { useState, useEffect } from "react";
import { fetchClients } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";

export default function Dashboard({ onSelectClient, onDocumentSession, onAddClient }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error).finally(() => setLoading(false));
  }, []);

  const riskOrder = { high: 0, moderate: 1, low: 2 };
  const sorted = [...clients].sort((a, b) => (riskOrder[a.riskLevel] ?? 3) - (riskOrder[b.riskLevel] ?? 3));
  const stats = {
    total: clients.length,
    high: clients.filter((c) => c.riskLevel === "high").length,
    moderate: clients.filter((c) => c.riskLevel === "moderate").length,
    low: clients.filter((c) => c.riskLevel === "low").length,
  };

  if (loading) return (
    <div className="p-8 max-w-[1000px]">
      <div className="shimmer h-10 w-64 mb-8" />
      <div className="grid grid-cols-4 gap-4 mb-8">{[1,2,3,4].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}</div>
      <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--clr-slate)" }}>Caseload overview</h2>
          <p className="text-sm mt-1" style={{ color: "var(--clr-muted)" }}>{stats.total} active clients</p>
        </div>
        <button onClick={onAddClient} className="btn-primary flex items-center gap-2">
          <span className="text-lg">+</span> Add client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total", val: stats.total, color: "var(--clr-primary)", bg: "var(--clr-primary-light)" },
          { label: "High risk", val: stats.high, color: "var(--clr-danger)", bg: "var(--clr-danger-light)" },
          { label: "Moderate", val: stats.moderate, color: "var(--clr-warning)", bg: "var(--clr-warning-light)" },
          { label: "Low risk", val: stats.low, color: "var(--clr-success)", bg: "var(--clr-success-light)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: s.bg }}>
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
            <p className="text-[28px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div className="space-y-2.5">
        {sorted.map((client, idx) => (
          <div key={client.id}
            className="card card-interactive p-4 flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms`, animationFillMode: "both" }}
            onClick={() => onSelectClient(client.id)}>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{
                background: client.riskLevel === "high" ? "linear-gradient(135deg, #dc2626, #ef4444)"
                  : client.riskLevel === "moderate" ? "linear-gradient(135deg, #d97706, #f59e0b)"
                  : "linear-gradient(135deg, #059669, #10b981)"
              }}>
              {client.name.split(" ").map(n => n[0]).join("")}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-[15px] font-semibold" style={{ color: "var(--clr-slate)" }}>{client.name}</h3>
                <StatusBadge status={client.riskLevel} />
                <StatusBadge status={client.lastSessionSentiment} showIcon />
              </div>
              <p className="text-[12px] truncate" style={{ color: "var(--clr-muted)" }}>
                {client.diagnosis} · Day {client.programDay} · {client.totalSessions} sessions
              </p>
            </div>

            {/* Alert (if any) */}
            {client.nextObjectiveAtRisk && (
              <div className="text-[11px] px-2.5 py-1.5 rounded-lg flex-shrink-0 max-w-[250px] truncate"
                style={{
                  background: client.nextObjectiveAtRisk.status === "at-risk" ? "var(--clr-danger-light)" : "var(--clr-warning-light)",
                  color: client.nextObjectiveAtRisk.status === "at-risk" ? "var(--clr-danger)" : "var(--clr-warning)",
                }}>
                ⚠ {client.nextObjectiveAtRisk.description}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={(e) => { e.stopPropagation(); onDocumentSession(client.id); }} className="btn-outline" style={{ fontSize: 12, padding: "6px 12px" }}>
                Document
              </button>
              <button onClick={(e) => { e.stopPropagation(); onSelectClient(client.id); }} className="btn-primary" style={{ fontSize: 12, padding: "6px 12px" }}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
