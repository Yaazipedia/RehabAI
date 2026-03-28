const API_BASE = "/api";

export async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients`);
  if (!res.ok) throw new Error("Failed to fetch clients");
  const data = await res.json();
  return data.clients;
}

export async function fetchClient(clientId) {
  const res = await fetch(`${API_BASE}/clients/${clientId}`);
  if (!res.ok) throw new Error("Failed to fetch client");
  const data = await res.json();
  return data.client;
}

export async function documentSession(clientId, rawNotes, sessionNumber) {
  const res = await fetch(`${API_BASE}/sessions/document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, rawNotes, sessionNumber }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to document session");
  }
  const data = await res.json();
  return data.session;
}

export async function fetchBriefing(clientId) {
  const res = await fetch(`${API_BASE}/briefings/${clientId}`);
  if (!res.ok) throw new Error("Failed to generate briefing");
  return res.json();
}

export async function fetchOutcomes(clientId) {
  const res = await fetch(`${API_BASE}/outcomes/${clientId}`);
  if (!res.ok) throw new Error("Failed to analyze outcomes");
  return res.json();
}
