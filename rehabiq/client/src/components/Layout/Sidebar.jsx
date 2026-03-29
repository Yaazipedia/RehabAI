import { useState } from "react";
import { logout as apiLogout } from "../../services/api";

export default function Sidebar({ currentView, onNavigate, onLogout }) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (!onLogout || loggingOut) return;
    setLoggingOut(true);
    try {
      await apiLogout();
      onLogout();
    } catch {
      onLogout();
    } finally {
      setLoggingOut(false);
    }
  }
  const navItems = [
    {
      id: "dashboard",
      title: "Caseload",
      matchAlso: ["client"],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        width: "200px",
        minWidth: "200px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--bg-sidebar)",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo + Product Name */}
      <div style={{ paddingTop: "24px", paddingBottom: "8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "20px", width: "100%" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: "800",
              fontSize: "18px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              userSelect: "none",
              flexShrink: 0,
            }}
          >
            R
          </div>
          <div>
            <div style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              color: "white",
              letterSpacing: "-0.02em",
            }}>
              RehabIQ
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
              Clinical Suite
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "160px",
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          margin: "16px 0 10px",
        }}
      />

      {/* Section label */}
      <div style={{
        width: "100%",
        paddingLeft: "20px",
        paddingRight: "20px",
        marginBottom: "6px",
      }}>
        <span style={{
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.35)",
        }}>
          Navigation
        </span>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "2px",
          paddingLeft: "12px",
          paddingRight: "12px",
          width: "100%",
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
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                border: "none",
                background: active
                  ? "rgba(255,255,255,0.13)"
                  : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.55)",
                transition: "all 0.2s ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              {/* Active indicator bar */}
              <div style={{
                width: "3px",
                height: "20px",
                borderRadius: "3px",
                background: active ? "#52b788" : "transparent",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }} />
              <span style={{ flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {item.title}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        style={{
          width: "160px",
          height: "1px",
          background: "rgba(255,255,255,0.1)",
          margin: "4px 0",
        }}
      />

      {/* User avatar + name + log out (lower left) */}
      <div
        style={{
          paddingBottom: "20px",
          paddingTop: "12px",
          paddingLeft: "12px",
          paddingRight: "12px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(82,183,136,0.25)",
            border: "1.5px solid rgba(82,183,136,0.5)",
            color: "#a8d5b8",
            fontWeight: "700",
            fontSize: "12px",
            userSelect: "none",
            flexShrink: 0,
          }}
          title="Dr. Rivera"
        >
          DR
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "white",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Dr. Rivera
            </span>
            {onLogout && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Sign out"
                style={{
                  padding: "4px 8px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.06)",
                  cursor: loggingOut ? "wait" : "pointer",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.75)",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  transition: "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "rgba(82,183,136,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
              >
                {loggingOut ? "…" : "Log out"}
              </button>
            )}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.4)",
              marginTop: "4px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          >
            Counselor
          </div>
        </div>
      </div>
    </aside>
  );
}
