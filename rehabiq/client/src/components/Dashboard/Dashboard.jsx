import { useState, useEffect, useRef } from "react";
import { fetchClients, fetchClient } from "../../services/api";
import StatusBadge from "../Shared/StatusBadge";

/* ── CountUp ──────────────────────────────────────────────── */
function CountUp({ target, gradient }) {
  const [display, setDisplay] = useState(0);
  const elRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const duration = 1800;
    const start = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const val = Math.round(easeOutExpo(progress) * target);
      setDisplay(val);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(target);
        if (elRef.current) {
          elRef.current.classList.add("count-pulse");
          setTimeout(() => elRef.current?.classList.remove("count-pulse"), 400);
        }
      }
    }
    requestAnimationFrame(tick);
  }, [target]);

  return (
    <span
      ref={elRef}
      className="gradient-text"
      style={{
        background: gradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}
    >
      {display}
    </span>
  );
}

/* ── SVG Icons ────────────────────────────────────────────── */
function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function FileAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}
function UserAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Quick Action Button ──────────────────────────────────── */
function QuickAction({ label, icon, gradient, onClick }) {
  const [spinning, setSpinning] = useState(false);
  const btnRef = useRef(null);

  function addRipple(e) {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("div");
    ripple.className = "ripple-wave";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  function handleClick(e) {
    addRipple(e);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    if (onClick) onClick();
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="ripple-container"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        borderRadius: "14px",
        border: "none",
        background: "var(--nm-bg)",
        boxShadow: "var(--nm-button)",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "14px",
        fontFamily: "inherit",
        color: "var(--text-primary)",
        transition: "box-shadow 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "6px 6px 14px var(--nm-shadow), -6px -6px 14px var(--nm-highlight)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--nm-button)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: gradient,
          color: "white",
          flexShrink: 0,
          animation: spinning ? "spin360 0.5s ease forwards" : "none",
        }}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}

/* ── ProgressBar ──────────────────────────────────────────── */
function ProgressBar({ label, value, gradient }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>{value}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${value}%`,
            background: gradient,
          }}
        />
      </div>
    </div>
  );
}

/* ── Terminal Log Line ────────────────────────────────────── */
function LogLine({ text, color, delay }) {
  return (
    <div
      style={{
        animation: `slideInLeft 0.4s ease ${delay}ms both`,
        color: color,
        lineHeight: 1.7,
      }}
    >
      {text}
    </div>
  );
}

/* ── PII pseudo-anonymization helpers ────────────────────── */
// Simple deterministic hash for consistent pseudonymization (not cryptographic)
function pseudoHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return `PT-${Math.abs(h).toString(16).toUpperCase().padStart(6, "0")}`;
}

function maskPII(client) {
  return {
    clientRef: pseudoHash(client.id + client.name),
    ageGroup: client.age < 25 ? "18-24" : client.age < 35 ? "25-34" : client.age < 45 ? "35-44" : "45+",
    gender: client.gender,
    diagnosis: client.diagnosis,
    coOccurring: client.coOccurring || null,
    programType: client.programType,
    programDay: client.programDay,
    riskLevel: client.riskLevel,
    mat: client.mat ? "[ON MAT]" : null,
    insurance: client.insurance ? "[REDACTED]" : null,
    emergencyContact: client.emergencyContact ? "[REDACTED]" : null,
    admissionDate: client.admissionDate,
    totalSessions: client.totalSessions,
    lastSessionSentiment: client.lastSessionSentiment,
    treatmentPlan: client.treatmentPlan,
    sessions: (client.sessions || []).map(s => ({
      sessionNumber: s.sessionNumber,
      date: s.date,
      dapNote: s.dapNote,
      tags: {
        ...s.tags,
        // Remove any free-text that might contain names
        keyQuotes: s.tags?.keyQuotes?.map(q => q.replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, "[NAME]")) || [],
      },
      followUpFlags: s.followUpFlags,
    })),
    exportMeta: {
      exportedAt: new Date().toISOString(),
      exportedBy: "Dr. Rivera",
      note: "PII has been pseudonymized. Client name replaced with reference ID. Age generalized. Insurance and emergency contact redacted.",
    },
  };
}

/* ── Export Modal ─────────────────────────────────────────── */
function ExportModal({ clients, onClose }) {
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleExport() {
    if (!selectedId) return;
    setLoading(true);
    try {
      const full = await fetchClient(selectedId);
      const masked = maskPII(full);
      const json = JSON.stringify(masked, null, 2);
      const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rehabiq-${masked.clientRef}-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)",
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        width: "480px", maxWidth: "94vw",
        background: "var(--nm-bg)",
        borderRadius: "24px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22), var(--nm-flat-lg)",
        padding: "32px",
        animation: "fadeInUp 0.25s ease",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Export Patient Data</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>Full session history including DAP notes</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "var(--text-muted)", lineHeight: 1 }}>✕</button>
        </div>

        {/* PII notice */}
        <div style={{
          borderRadius: "12px", padding: "14px 16px", marginBottom: "20px",
          background: "rgba(99,102,241,0.08)",
          border: "1.5px solid rgba(99,102,241,0.2)",
          fontSize: "12px", color: "var(--accent-indigo)", lineHeight: 1.6,
        }}>
          <strong>🔒 Privacy Protected:</strong> The exported file will automatically pseudonymize PII.
          Patient name → anonymized reference ID, age → age group, insurance & emergency contact → redacted.
          Free-text quotes are scanned for names.
        </div>

        {/* Client selector */}
        <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
          Select Patient
        </label>
        <select
          value={selectedId}
          onChange={e => { setSelectedId(e.target.value); setDone(false); }}
          className="input-base"
          style={{ marginBottom: "20px" }}
        >
          <option value="">Choose a patient...</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.diagnosis} ({c.totalSessions} sessions)
            </option>
          ))}
        </select>

        {/* What's included */}
        {selectedId && (
          <div style={{
            borderRadius: "12px", padding: "14px 16px", marginBottom: "20px",
            background: "var(--nm-bg)", boxShadow: "var(--nm-inset-sm)",
            fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.8,
          }}>
            <strong style={{ color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>JSON file will include:</strong>
            ✓ All session records with full DAP notes<br />
            ✓ Clinical tags (mood, triggers, coping, sentiment)<br />
            ✓ Follow-up flags and risk indicators<br />
            ✓ Treatment plan objectives & progress<br />
            ✓ Anonymized reference ID (name removed)<br />
            ✗ Name, exact age, insurance, emergency contact (redacted)
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "12px", borderRadius: "12px",
            border: "none", background: "var(--nm-bg)", boxShadow: "var(--nm-button)",
            fontFamily: "inherit", fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500, cursor: "pointer",
          }}>Cancel</button>
          <button
            onClick={handleExport}
            disabled={!selectedId || loading}
            style={{
              flex: 2, padding: "12px", borderRadius: "12px",
              border: "none",
              background: done ? "var(--gradient-emerald)" : "var(--gradient-indigo)",
              color: "white", fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
              cursor: selectedId && !loading ? "pointer" : "not-allowed",
              opacity: !selectedId ? 0.5 : 1,
              boxShadow: done ? "0 4px 14px rgba(16,185,129,0.3)" : "0 4px 14px rgba(99,102,241,0.3)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Preparing export..." : done ? "✓ Downloaded!" : "Export & Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ───────────────────────────────────────── */
export default function Dashboard({ onSelectClient, onDocumentSession, onAddClient, searchQuery = "" }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    fetchClients().then(setClients).catch(console.error).finally(() => setLoading(false));
  }, []);

  const riskOrder = { high: 0, moderate: 1, low: 2 };
  const allSorted = [...clients].sort((a, b) => (riskOrder[a.riskLevel] ?? 3) - (riskOrder[b.riskLevel] ?? 3));

  // Filter by search query
  const q = searchQuery.trim().toLowerCase();
  const sorted = q
    ? allSorted.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.diagnosis || "").toLowerCase().includes(q) ||
        (c.programType || "").toLowerCase().includes(q)
      )
    : allSorted;

  const high = clients.filter((c) => c.riskLevel === "high").length;
  const moderate = clients.filter((c) => c.riskLevel === "moderate").length;
  const low = clients.filter((c) => c.riskLevel === "low").length;
  const inTreatment = moderate + low;

  const avgSessions = clients.length > 0
    ? Math.round(clients.reduce((acc, c) => acc + (c.totalSessions || 0), 0) / clients.length)
    : 0;

  const stableOrImproving = clients.filter((c) =>
    ["improving", "stable", "stable-positive", "cautiously-improving"].includes(c.lastSessionSentiment)
  ).length;

  const onTrack = clients.filter((c) =>
    !c.nextObjectiveAtRisk || c.nextObjectiveAtRisk?.status === "on-track"
  ).length;

  const highPct    = clients.length > 0 ? Math.round((high / clients.length) * 100) : 0;
  const engagePct  = clients.length > 0 ? Math.round((stableOrImproving / clients.length) * 100) : 0;
  const onTrackPct = clients.length > 0 ? Math.round((onTrack / clients.length) * 100) : 0;

  /* ── Loading shimmer ── */
  if (loading) {
    return (
      <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <div className="shimmer" style={{ height: "10px", width: "240px", marginBottom: "32px", borderRadius: "8px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer" style={{ height: "120px", borderRadius: "20px" }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer" style={{ height: "48px", flex: 1, borderRadius: "14px" }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer" style={{ height: "80px", borderRadius: "16px" }} />
            ))}
          </div>
          <div className="shimmer" style={{ height: "260px", borderRadius: "16px" }} />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Clients",
      value: clients.length,
      gradient: "var(--gradient-indigo)",
      icon: <PeopleIcon />,
      trend: null,
    },
    {
      label: "High Risk",
      value: high,
      gradient: "var(--gradient-rose)",
      icon: <AlertIcon />,
      trend: high > 0 ? { label: `${high} need attention`, dir: "down" } : { label: "All clear", dir: "up" },
    },
    {
      label: "In Treatment",
      value: inTreatment,
      gradient: "var(--gradient-emerald)",
      icon: <ActivityIcon />,
      trend: { label: "Engaged", dir: "up" },
    },
    {
      label: "Avg Sessions",
      value: avgSessions,
      gradient: "var(--gradient-amber)",
      icon: <CalendarIcon />,
      trend: { label: "Per client", dir: "stable" },
    },
  ];

  return (
    <div style={{ padding: "8px 24px 32px", maxWidth: "1100px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-flat)",
              borderRadius: "20px",
              padding: "20px",
              transition: "box-shadow 0.25s cubic-bezier(0.34,1.56,0.64,1), transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              cursor: "default",
              animationDelay: `${i * 80}ms`,
              animation: "fadeInUp 0.4s ease both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.015)";
              e.currentTarget.style.boxShadow = "var(--nm-flat-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "var(--nm-flat)";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "var(--nm-bg)",
                boxShadow: "var(--nm-inset)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <span
                className="float-icon"
                style={{
                  background: card.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {card.icon}
              </span>
            </div>

            {/* Value */}
            <div style={{ fontSize: "32px", fontWeight: 800, lineHeight: 1, marginBottom: "6px" }}>
              <CountUp target={card.value} gradient={card.gradient} />
            </div>

            {/* Label */}
            <div className="section-label" style={{ marginBottom: "6px" }}>{card.label}</div>

            {/* Trend */}
            {card.trend && (
              <div
                className={
                  card.trend.dir === "up"
                    ? "trend-up"
                    : card.trend.dir === "down"
                    ? "trend-down"
                    : "trend-stable"
                }
                style={{ fontSize: "11px", fontWeight: 500 }}
              >
                {card.trend.dir === "up" ? "↑ " : card.trend.dir === "down" ? "↓ " : "→ "}
                {card.trend.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
          animation: "fadeInUp 0.4s ease 0.2s both",
        }}
      >
        <QuickAction
          label="Document Session"
          icon={<FileAddIcon />}
          gradient="var(--gradient-indigo)"
          onClick={onDocumentSession}
        />
        <QuickAction
          label="Add Client"
          icon={<UserAddIcon />}
          gradient="var(--gradient-emerald)"
          onClick={onAddClient}
        />
        <QuickAction
          label="Export Data"
          icon={<DownloadIcon />}
          gradient="var(--gradient-amber)"
          onClick={() => setShowExportModal(true)}
        />
      </div>

      {/* ── Two-column detail area ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          animation: "fadeInUp 0.4s ease 0.3s both",
        }}
      >
        {/* Left: Active Caseload */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div className="section-label">
              Active Caseload
            </div>
            {q && (
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {sorted.length} result{sorted.length !== 1 ? "s" : ""} for "{searchQuery}"
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sorted.length === 0 && q && (
              <div style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-muted)",
                fontSize: "14px",
                background: "var(--nm-bg)",
                boxShadow: "var(--nm-flat)",
                borderRadius: "16px",
              }}>
                No clients match "<strong>{searchQuery}</strong>"
              </div>
            )}
            {sorted.map((client, idx) => (
              <div
                key={client.id}
                style={{
                  background: "var(--nm-bg)",
                  boxShadow: "var(--nm-flat)",
                  borderRadius: "16px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
                  animation: `fadeInUp 0.35s ease ${idx * 60}ms both`,
                }}
                onClick={() => onSelectClient(client.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "var(--nm-flat-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--nm-flat)";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "white",
                    background:
                      client.riskLevel === "high"
                        ? "var(--gradient-rose)"
                        : client.riskLevel === "moderate"
                        ? "var(--gradient-amber)"
                        : "var(--gradient-emerald)",
                    boxShadow: "var(--nm-flat-sm)",
                  }}
                >
                  {client.name.split(" ").map((n) => n[0]).join("")}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {client.name}
                    </span>
                    <StatusBadge status={client.riskLevel} />
                    <StatusBadge status={client.lastSessionSentiment} showIcon />
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {client.diagnosis} · Day {client.programDay} · {client.totalSessions} sessions
                  </p>
                </div>

                {/* At-risk alert */}
                {client.nextObjectiveAtRisk && (
                  <div
                    style={{
                      fontSize: "11px",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      flexShrink: 0,
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      background:
                        client.nextObjectiveAtRisk.status === "at-risk"
                          ? "var(--clr-danger-light)"
                          : "var(--clr-warning-light)",
                      color:
                        client.nextObjectiveAtRisk.status === "at-risk"
                          ? "var(--accent-rose)"
                          : "var(--accent-amber)",
                    }}
                  >
                    ⚠ {client.nextObjectiveAtRisk.description}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDocumentSession(client.id); }}
                    className="btn-outline"
                    style={{ fontSize: "11px", padding: "5px 10px" }}
                  >
                    Document
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectClient(client.id); }}
                    className="btn-primary"
                    style={{ fontSize: "11px", padding: "5px 10px" }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Caseload Health + System Log */}
        <div>
          {/* Caseload Health */}
          <div
            style={{
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-flat)",
              borderRadius: "20px",
              padding: "20px",
              marginBottom: "16px",
            }}
          >
            <div className="section-label" style={{ marginBottom: "16px" }}>Caseload Health</div>
            <ProgressBar label="High Risk" value={highPct} gradient="var(--gradient-rose)" />
            <ProgressBar label="Active Engagement" value={engagePct} gradient="var(--gradient-emerald)" />
            <ProgressBar label="On Track" value={onTrackPct} gradient="var(--gradient-indigo)" />
          </div>

          {/* System Log */}
          <div
            style={{
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-flat)",
              borderRadius: "20px",
              padding: "20px",
            }}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>System Log</div>
            <div
              style={{
                background: "var(--nm-bg)",
                boxShadow: "var(--nm-inset)",
                borderRadius: "12px",
                padding: "14px 16px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                lineHeight: 1.7,
              }}
            >
              <LogLine text="> RehabIQ v2.0 initialized" color="var(--accent-emerald)" delay={0} />
              <LogLine
                text={`> Database: ${clients.length} records loaded`}
                color="var(--accent-emerald)"
                delay={150}
              />
              <LogLine text="> AI briefing engine: ready" color="var(--accent-indigo-light)" delay={300} />
              <LogLine text="> Outcome analytics: ready" color="var(--accent-indigo-light)" delay={450} />
              <LogLine
                text={`> ${high} client(s) flagged for attention`}
                color={high > 0 ? "var(--accent-rose)" : "var(--accent-emerald)"}
                delay={600}
              />
              <div
                style={{
                  color: "var(--text-muted)",
                  animation: "slideInLeft 0.4s ease 750ms both",
                  lineHeight: 1.7,
                }}
              >
                {"> Last sync: just now "}
                <span className="blink">▋</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showExportModal && (
        <ExportModal clients={clients} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}
