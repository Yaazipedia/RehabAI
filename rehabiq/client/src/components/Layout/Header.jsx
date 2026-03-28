import { useState } from "react";

const PAGE_META = {
  dashboard: { title: "Caseload", subtitle: "Active client management" },
  session:   { title: "Document Session", subtitle: "AI-assisted session notes" },
  client:    { title: "Client Profile", subtitle: "Detailed client overview" },
  newclient: { title: "Add Client", subtitle: "Register a new client" },
};

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Header({ currentView, darkMode, onToggleDark }) {
  const [spinToggle, setSpinToggle] = useState(false);
  const meta = PAGE_META[currentView] || PAGE_META.dashboard;

  function handleToggleDark() {
    setSpinToggle(true);
    onToggleDark();
    setTimeout(() => setSpinToggle(false), 500);
  }

  return (
    <div
      style={{
        margin: "12px 24px",
        position: "sticky",
        top: "12px",
        zIndex: 40,
      }}
    >
      <div
        style={{
          height: "66px",
          borderRadius: "28px",
          background: "var(--nm-bg)",
          boxShadow: "var(--nm-flat-lg)",
          display: "flex",
          alignItems: "center",
          paddingLeft: "24px",
          paddingRight: "24px",
          gap: "16px",
        }}
      >
        {/* Left: page title */}
        <div style={{ minWidth: "180px", flexShrink: 0 }}>
          <h2
            style={{
              fontFamily: "'General Sans', 'Satoshi', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "17px",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            {meta.title}
          </h2>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginTop: "1px",
            }}
          >
            {meta.subtitle}
          </p>
        </div>

        {/* Center: search */}
        <div style={{ flex: 1, maxWidth: "420px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "100px",
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-inset)",
              padding: "8px 16px",
            }}
          >
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search clients..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                fontFamily: "inherit",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme toggle */}
          <button
            onClick={handleToggleDark}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "none",
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-button)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "box-shadow 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
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
                display: "inline-block",
                animation: spinToggle ? "spin360 0.5s ease forwards" : "none",
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </span>
          </button>

          {/* Notification bell */}
          <button
            title="Notifications"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: "none",
              background: "var(--nm-bg)",
              boxShadow: "var(--nm-button)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              position: "relative",
              transition: "box-shadow 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
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
            <BellIcon />
            {/* Rose notification dot */}
            <span
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-rose)",
                animation: "pulseDot 1.5s ease-in-out infinite",
              }}
            />
          </button>

          {/* Avatar */}
          <div
            title="Dr. Rivera"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)",
              boxShadow: "var(--nm-flat-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "700",
              fontSize: "12px",
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            DR
          </div>
        </div>
      </div>
    </div>
  );
}
