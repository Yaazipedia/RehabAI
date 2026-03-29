import { useState, useEffect } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import SessionDoc from "./components/SessionDoc/SessionDoc";
import ClientView from "./components/ClientView/ClientView";
import NewClient from "./components/NewClient/NewClient";
import Login from "./components/Login/Login";
import { fetchAuthMe } from "./services/api";

export default function App() {
  const [authStatus, setAuthStatus] = useState("loading"); // loading | guest | authed
  const [view, setView] = useState("dashboard");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAuthMe();
        if (cancelled) return;
        setAuthStatus(data.authenticated ? "authed" : "guest");
      } catch {
        if (!cancelled) setAuthStatus("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function navigateTo(newView, clientId = null) {
    setView(newView);
    if (clientId) setSelectedClientId(clientId);
    if (newView !== "dashboard") setSearchQuery("");
  }

  if (authStatus === "loading") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--bg-page)" }}
      >
        <div
          className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--clr-primary)", borderTopColor: "transparent" }}
        />
        <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "14px", color: "var(--text-muted)" }}>
          Loading…
        </p>
      </div>
    );
  }

  if (authStatus === "guest") {
    return (
      <Login
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onLoggedIn={() => setAuthStatus("authed")}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        currentView={view}
        onNavigate={navigateTo}
        onLogout={() => setAuthStatus("guest")}
      />
      <main className="flex-1 overflow-y-auto" style={{ background: "var(--bg-page)" }}>
        <Header
          currentView={view}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          onSearch={setSearchQuery}
        />
        {view === "dashboard" && (
          <Dashboard
            searchQuery={searchQuery}
            onSelectClient={(id) => navigateTo("client", id)}
            onDocumentSession={(id) => navigateTo("session", id)}
            onAddClient={() => navigateTo("newclient")}
          />
        )}
        {view === "session" && (
          <SessionDoc
            clientId={selectedClientId}
            onBack={() => navigateTo("dashboard")}
            onViewClient={(id) => navigateTo("client", id)}
          />
        )}
        {view === "client" && (
          <ClientView
            clientId={selectedClientId}
            onBack={() => navigateTo("dashboard")}
            onDocumentSession={(id) => navigateTo("session", id)}
          />
        )}
        {view === "newclient" && (
          <NewClient
            onBack={() => navigateTo("dashboard")}
            onClientCreated={(id) => navigateTo("client", id)}
          />
        )}
      </main>
    </div>
  );
}
