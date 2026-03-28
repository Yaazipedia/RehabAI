const CONFIG = {
  low: { bg: "var(--clr-success-light)", color: "var(--clr-success)", label: "Low risk" },
  moderate: { bg: "var(--clr-warning-light)", color: "var(--clr-warning)", label: "Moderate" },
  high: { bg: "var(--clr-danger-light)", color: "var(--clr-danger)", label: "High risk" },
  improving: { bg: "var(--clr-success-light)", color: "var(--clr-success)", icon: "↑" },
  stable: { bg: "#f3f4f6", color: "#6b7280", icon: "→" },
  "stable-positive": { bg: "var(--clr-success-light)", color: "var(--clr-success)", icon: "→" },
  declining: { bg: "var(--clr-danger-light)", color: "var(--clr-danger)", icon: "↓" },
  concerning: { bg: "var(--clr-danger-light)", color: "var(--clr-danger)", icon: "↓" },
  "cautiously-improving": { bg: "var(--clr-amber-light)", color: "var(--clr-warning)", icon: "↗" },
  mixed: { bg: "var(--clr-amber-light)", color: "var(--clr-warning)", icon: "~" },
  "cautiously-stable": { bg: "var(--clr-amber-light)", color: "var(--clr-warning)", icon: "→" },
  "on-track": { bg: "var(--clr-success-light)", color: "var(--clr-success)" },
  "in-progress": { bg: "var(--clr-primary-light)", color: "var(--clr-primary)" },
  "at-risk": { bg: "var(--clr-danger-light)", color: "var(--clr-danger)" },
  plateau: { bg: "var(--clr-amber-light)", color: "var(--clr-warning)" },
  "not-started": { bg: "#f3f4f6", color: "#9ca3af" },
  stalled: { bg: "var(--clr-amber-light)", color: "var(--clr-warning)" },
  achieved: { bg: "var(--clr-success-light)", color: "var(--clr-success)" },
  effective: { bg: "var(--clr-success-light)", color: "var(--clr-success)" },
  "partially-effective": { bg: "var(--clr-amber-light)", color: "var(--clr-warning)" },
  "limited-response": { bg: "var(--clr-danger-light)", color: "var(--clr-danger)" },
  "too-early-to-assess": { bg: "#f3f4f6", color: "#9ca3af" },
};

export default function StatusBadge({ status, showIcon = false, className = "" }) {
  const cfg = CONFIG[status] || CONFIG["stable"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {showIcon && cfg.icon && <span>{cfg.icon}</span>}
      {cfg.label || status?.replace(/-/g, " ")}
    </span>
  );
}
