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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function navigateTo(newView, clientId = null) {
    setView(newView);
    if (clientId) setSelectedClientId(clientId);
    // Clear search when navigating away from dashboard
    if (newView !== "dashboard") setSearchQuery("");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentView={view} onNavigate={navigateTo} />
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
