import { useState, useEffect } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Dashboard from "./components/Dashboard/Dashboard";
import SessionDoc from "./components/SessionDoc/SessionDoc";
import ClientView from "./components/ClientView/ClientView";
import NewClient from "./components/NewClient/NewClient";

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function navigateTo(newView, clientId = null) {
    setView(newView);
    if (clientId) setSelectedClientId(clientId);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={view} onNavigate={navigateTo} />
      <main className="flex-1 overflow-y-auto" style={{ background: "var(--nm-bg)" }}>
        <Header
          currentView={view}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
        />
        {view === "dashboard" && (
          <Dashboard
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
