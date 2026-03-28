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

  if (loading) {
    return (
      <div className="p-8">
        <div className="shimmer h-10 w-64 mb-3" />
        <div className="shimmer h-5 w-48 mb-8" />
        <div className="grid grid-cols-4 gap-4 mb-8">{[1,2,3,4].map((i) => <div key={i} className="shimmer h-28 rounded-2xl" />)}</div>
        <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="shimmer h-36 rounded-2xl" />)}</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total clients", val: stats.total, color: "var(--clr-primary)", icon: "👥" },
    { label: "High risk", val: stats.high, color: "var(--clr-danger)", icon: "⚠️" },
    { label: "Moderate", val: stats.moderate, color: "var(--clr-warning)", icon: "📋" },
    { label: "Low risk", val: stats.low, color: "var(--clr-success)", icon: "✅" },
  ];

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight" style={{ color: "var(--clr-slate)" }}>Good morning, Dr. Rivera</h2>
          <p className="text-[15px] mt-1" style={{ color: "var(--clr-muted)" }}>Here's your caseload overview for today</p>
        </div>
        <button onClick={onAddClient} className="btn-primary flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="card p-5 animate-fade-in" style={{ animationDelay: `${i*80}ms`, animationFillMode: "both" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--clr-muted)" }}>{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="text-[32px] font-bold leading-none" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <p className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--clr-muted)" }}>
        Active caseload — sorted by risk
      </p>

      {/* Client cards */}
      <div className="space-y-3">
        {sorted.map((client, idx) => (
          <div key={client.id} className="card card-interactive p-5 animate-fade-in"
            style={{ animationDelay: `${(idx+4)*60}ms`, animationFillMode: "both" }}
            onClick={() => onSelectClient(client.id)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: client.riskLevel === "high" ? "linear-gradient(135deg, #dc2626, #ef4444)" : client.riskLevel === "moderate" ? "linear-gradient(135deg, #d97706, #f59e0b)" : "linear-gradient(135deg, #059669, #10b981)" }}>
                    {client.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold" style={{ color: "var(--clr-slate)" }}>{client.name}</h3>
                      <StatusBadge status={client.riskLevel} />
                      <StatusBadge status={client.lastSessionSentiment} showIcon />
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] mt-0.5 flex-wrap" style={{ color: "var(--clr-muted)" }}>
                      <span>{client.age} yo</span><span style={{ opacity: 0.4 }}>•</span>
                      <span>{client.diagnosis}</span><span style={{ opacity: 0.4 }}>•</span>
                      <span>{client.programType}</span><span style={{ opacity: 0.4 }}>•</span>
                      <span>Day {client.programDay}</span><span style={{ opacity: 0.4 }}>•</span>
                      <span>{client.totalSessions} sessions</span>
                    </div>
                  </div>
                </div>
                {client.nextObjectiveAtRisk && (
                  <div className="mt-3 flex items-center gap-2 text-[12px] px-3 py-2 rounded-lg ml-12"
                    style={{ background: client.nextObjectiveAtRisk.status === "at-risk" ? "var(--clr-danger-light)" : "var(--clr-amber-light)", color: client.nextObjectiveAtRisk.status === "at-risk" ? "var(--clr-danger)" : "var(--clr-warning)", border: `1px solid ${client.nextObjectiveAtRisk.status === "at-risk" ? "var(--clr-danger-border)" : "var(--clr-amber-border)"}` }}>
                    <span>{client.nextObjectiveAtRisk.status === "at-risk" ? "⚠" : "📊"}</span>
                    <span className="font-semibold">{client.nextObjectiveAtRisk.status === "at-risk" ? "At risk" : "Plateau"}:</span>
                    <span>{client.nextObjectiveAtRisk.description}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onDocumentSession(client.id); }} className="btn-outline">Document session</button>
                <button onClick={(e) => { e.stopPropagation(); onSelectClient(client.id); }} className="btn-primary" style={{ fontSize: "13px", padding: "8px 16px" }}>View details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
