const API_BASE = import.meta.env.VITE_API_URL || "/api";

const fetchDefaults = { credentials: "include" };

export async function fetchAuthMe() {
  const res = await fetch(`${API_BASE}/auth/me`, fetchDefaults);
  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    return { authenticated: false, ...data };
  }
  if (!res.ok) throw new Error("Auth check failed");
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    ...fetchDefaults,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    ...fetchDefaults,
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}

export async function fetchClients() {
  const res = await fetch(`${API_BASE}/clients`, fetchDefaults);
  if (!res.ok) throw new Error("Failed to fetch clients");
  const data = await res.json();
  return data.clients;
}

export async function fetchClient(clientId) {
  const res = await fetch(`${API_BASE}/clients/${clientId}`, fetchDefaults);
  if (!res.ok) throw new Error("Failed to fetch client");
  const data = await res.json();
  return data.client;
}

export async function createNewClient(clientData) {
  const res = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clientData),
    ...fetchDefaults,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create client");
  }
  const data = await res.json();
  return data.client;
}

export async function documentSession(clientId, rawNotes, sessionNumber) {
  const res = await fetch(`${API_BASE}/sessions/document`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, rawNotes, sessionNumber }),
    ...fetchDefaults,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to document session");
  }
  const data = await res.json();
  return data.session;
}

export async function fetchBriefing(clientId) {
  const res = await fetch(`${API_BASE}/briefings/${clientId}`, fetchDefaults);
  if (!res.ok) throw new Error("Failed to generate briefing");
  return res.json();
}

export async function fetchOutcomes(clientId) {
  const res = await fetch(`${API_BASE}/outcomes/${clientId}`, fetchDefaults);
  if (!res.ok) throw new Error("Failed to analyze outcomes");
  return res.json();
}
