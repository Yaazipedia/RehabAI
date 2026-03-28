export default function Sidebar({ currentView, onNavigate }) {
  const navItems = [
    {
      id: "dashboard", label: "Caseload",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>,
    },
    {
      id: "session", label: "Document",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      id: "newclient", label: "Add client",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    },
  ];

  return (
    <aside className="w-[240px] h-screen flex flex-col border-r" style={{ borderColor: "var(--clr-border)", background: "var(--clr-card)" }}>
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #0d7377, #0a9396)", boxShadow: "var(--shadow-primary)" }}>R</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ color: "var(--clr-slate)" }}>RehabIQ</h1>
            <p className="text-[11px] font-medium leading-tight" style={{ color: "var(--clr-muted)" }}>Clinical Intelligence</p>
          </div>
        </div>
      </div>
      <div className="mx-5 mb-4" style={{ height: "1px", background: "var(--clr-border)" }} />
      <nav className="flex-1 px-4">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--clr-muted)" }}>Navigation</p>
        {navItems.map((item) => {
          const active = currentView === item.id || (item.id === "dashboard" && currentView === "client");
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-[13.5px] font-medium transition-base"
              style={{
                background: active ? "var(--clr-primary-light)" : "transparent",
                color: active ? "var(--clr-primary)" : "var(--clr-slate-mid)",
                boxShadow: active ? "inset 0 0 0 1px rgba(13, 115, 119, 0.15)" : "none",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--clr-bg)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-5 border-t" style={{ borderColor: "var(--clr-border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #0d7377, #0a9396)" }}>DR</div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--clr-slate)" }}>Dr. Rivera</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--clr-muted)" }}>Rehab Counselor</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
