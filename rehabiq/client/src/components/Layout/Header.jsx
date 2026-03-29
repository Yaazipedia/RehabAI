import { useState } from "react";

const PAGE_META = {
  dashboard: { title: "Caseload", subtitle: "Active client management" },
  session:   { title: "Document Session", subtitle: "AI-assisted session notes" },
  client:    { title: "Client Profile", subtitle: "Detailed client overview" },
  newclient: { title: "Add Client", subtitle: "Register a new client" },
};

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header({ currentView, darkMode, onToggleDark, onSearch }) {
  const [spinToggle, setSpinToggle] = useState(false);
  const [query, setQuery] = useState("");
  const meta = PAGE_META[currentView] || PAGE_META.dashboard;

  function handleToggleDark() {
    setSpinToggle(true);
    onToggleDark();
    setTimeout(() => setSpinToggle(false), 500);
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  }

  function clearSearch() {
    setQuery("");
    if (onSearch) onSearch("");
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
        <div style={{ minWidth: "160px", flexShrink: 0 }}>
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

        {/* Center: search — only on dashboard */}
        <div style={{ flex: 1, maxWidth: "440px" }}>
          {currentView === "dashboard" && (
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
              <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search clients by name or diagnosis..."
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
              {query && (
                <button
                  onClick={clearSearch}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    borderRadius: "50%",
                  }}
                >
                  <XIcon />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right: theme toggle + avatar only */}
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
