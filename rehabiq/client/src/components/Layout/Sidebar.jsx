export default function Sidebar({ currentView, onNavigate }) {
  const navItems = [
    { id: "dashboard", label: "Caseload", icon: "📊", matchAlso: ["client"] },
    { id: "session", label: "Document", icon: "📝", matchAlso: [] },
    { id: "newclient", label: "Add client", icon: "➕", matchAlso: [] },
  ];

  return (
    <aside className="w-[230px] h-screen flex flex-col border-r" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
      {/* Branding */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base"
            style={{ background: "linear-gradient(135deg, #0d7377, #0a9396)", boxShadow: "var(--shadow-primary)" }}>
            R
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight" style={{ color: "var(--clr-slate)" }}>RehabIQ</h1>
            <p className="text-[11px] font-medium" style={{ color: "var(--clr-muted)" }}>Clinical Intelligence</p>
          </div>
        </div>
      </div>

      <div className="mx-5 mb-5" style={{ height: "1px", background: "var(--clr-border)" }} />

      {/* Nav */}
      <nav className="flex-1 px-4">
        {navItems.map((item) => {
          const active = currentView === item.id || item.matchAlso.includes(currentView);
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[14px] font-medium transition-base"
              style={{
                background: active ? "var(--clr-primary-light)" : "transparent",
                color: active ? "var(--clr-primary)" : "var(--clr-slate-mid)",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f1f5f9"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              <span className="text-[16px]">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "var(--clr-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0d7377, #0a9396)" }}>DR</div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--clr-slate)" }}>Dr. Rivera</p>
            <p className="text-[11px]" style={{ color: "var(--clr-muted)" }}>Rehab Counselor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
