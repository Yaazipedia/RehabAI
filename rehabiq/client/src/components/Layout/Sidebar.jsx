export default function Sidebar({ currentView, onNavigate }) {
  const navItems = [
    {
      id: "dashboard",
      title: "Caseload",
      matchAlso: ["client", "newclient"],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "session",
      title: "Document Session",
      matchAlso: [],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: "newclient",
      title: "Add Client",
      matchAlso: [],
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" y1="8" x2="19" y2="14" />
          <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      style={{
        width: "72px",
        minWidth: "72px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--nm-bg)",
        boxShadow: "var(--nm-flat-lg)",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ paddingTop: "16px", paddingBottom: "8px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.4), var(--nm-flat-sm)",
            color: "white",
            fontWeight: "800",
            fontSize: "22px",
            fontFamily: "'General Sans', 'Satoshi', system-ui, sans-serif",
            userSelect: "none",
          }}
        >
          R
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "40px",
          height: "1px",
          background: "var(--nm-shadow)",
          opacity: 0.3,
          margin: "8px 0",
        }}
      />

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          paddingTop: "8px",
        }}
      >
        {navItems.map((item) => {
          const active =
            currentView === item.id || item.matchAlso.includes(currentView);
          return (
            <button
              key={item.id}
              title={item.title}
              onClick={() => onNavigate(item.id)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                background: "var(--nm-bg)",
                color: active ? "var(--accent-indigo)" : "var(--text-secondary)",
                boxShadow: active ? "var(--nm-inset)" : "var(--nm-button)",
                transition: "box-shadow 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(129,140,248,0.05))";
                  e.currentTarget.style.color = "var(--accent-indigo)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.background = "var(--nm-bg)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = "var(--nm-inset-sm)";
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                if (!active) {
                  e.currentTarget.style.boxShadow = "var(--nm-button)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>

      {/* User avatar */}
      <div style={{ paddingBottom: "16px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)",
            boxShadow: "var(--nm-flat-sm)",
            color: "white",
            fontWeight: "700",
            fontSize: "12px",
            userSelect: "none",
            cursor: "pointer",
          }}
          title="Dr. Rivera"
        >
          DR
        </div>
      </div>
    </aside>
  );
}
