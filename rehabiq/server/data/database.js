// =============================================================
// RehabIQ Database Layer (SQLite via sql.js — pure JS, no native build)
// =============================================================

const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "rehabiq.db");

let db;
let dbReady; // Promise that resolves when DB is initialised

// sql.js requires async init; we wrap it in a promise so
// every query can `await getDb()` transparently.
async function getDb() {
  if (db) return db;
  if (!dbReady) {
    dbReady = _initDb();
  }
  return dbReady;
}

async function _initDb() {
  const SQL = await initSqlJs();

  // If a database file already exists on disk, load it
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Pragmas
  db.run("PRAGMA journal_mode = WAL;");
  db.run("PRAGMA foreign_keys = ON;");

  initTables();
  return db;
}

// Persist the in-memory database to disk
function persist() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initTables() {
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      co_occurring TEXT,
      program_type TEXT NOT NULL,
      admission_date TEXT NOT NULL,
      program_day INTEGER NOT NULL,
      mat TEXT,
      insurance TEXT,
      emergency_contact TEXT,
      risk_level TEXT NOT NULL DEFAULT 'moderate',
      treatment_plan TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      session_number INTEGER NOT NULL,
      date TEXT NOT NULL,
      raw_notes TEXT NOT NULL,
      dap_note TEXT NOT NULL DEFAULT '{}',
      tags TEXT NOT NULL DEFAULT '{}',
      follow_up_flags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `);

  db.run("CREATE INDEX IF NOT EXISTS idx_sessions_client ON sessions(client_id);");
  db.run("CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);");
}

// ---- helpers to convert sql.js results → row objects ----

function stmtAll(sql, params) {
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function stmtGet(sql, params) {
  const rows = stmtAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

function stmtRun(sql, params) {
  db.run(sql, params);
  persist();
}

// ======================== CLIENT QUERIES ========================

async function getAllClients() {
  await getDb();
  const rows = stmtAll(`
    SELECT c.*,
      (SELECT COUNT(*) FROM sessions s WHERE s.client_id = c.id) as total_sessions,
      (SELECT s.date FROM sessions s WHERE s.client_id = c.id ORDER BY s.session_number DESC LIMIT 1) as last_session_date,
      (SELECT s.tags FROM sessions s WHERE s.client_id = c.id ORDER BY s.session_number DESC LIMIT 1) as last_session_tags
    FROM clients c
    ORDER BY
      CASE c.risk_level WHEN 'high' THEN 0 WHEN 'moderate' THEN 1 WHEN 'low' THEN 2 END,
      c.name
  `);

  return rows.map(formatClientRow);
}

async function getClientById(id) {
  await getDb();
  const row = stmtGet("SELECT * FROM clients WHERE id = ?", [id]);
  if (!row) return null;

  const sessions = stmtAll(
    "SELECT * FROM sessions WHERE client_id = ? ORDER BY session_number ASC",
    [id]
  ).map(formatSessionRow);

  const client = formatClientRow(row);
  client.sessions = sessions;
  return client;
}

async function createClient(data) {
  await getDb();
  const id = `client-${Date.now()}`;
  const now = new Date().toISOString();

  stmtRun(
    `INSERT INTO clients (id, name, age, gender, diagnosis, co_occurring, program_type,
      admission_date, program_day, mat, insurance, emergency_contact, risk_level,
      treatment_plan, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, data.name, data.age, data.gender, data.diagnosis,
      data.coOccurring || null, data.programType, data.admissionDate || now.split("T")[0],
      data.programDay || 1, data.mat || null, data.insurance || null,
      data.emergencyContact || null, data.riskLevel || "moderate",
      JSON.stringify(data.treatmentPlan?.objectives || []),
      now, now,
    ]
  );

  return getClientById(id);
}

async function updateClientRisk(clientId, riskLevel) {
  await getDb();
  stmtRun(
    "UPDATE clients SET risk_level = ?, updated_at = datetime('now') WHERE id = ?",
    [riskLevel, clientId]
  );
}

async function updateClientProgramDay(clientId, day) {
  await getDb();
  stmtRun(
    "UPDATE clients SET program_day = ?, updated_at = datetime('now') WHERE id = ?",
    [day, clientId]
  );
}

// ======================== SESSION QUERIES ========================

async function getSessionsByClient(clientId) {
  await getDb();
  return stmtAll(
    "SELECT * FROM sessions WHERE client_id = ? ORDER BY session_number ASC",
    [clientId]
  ).map(formatSessionRow);
}

async function addSession(clientId, sessionData) {
  await getDb();
  const id = sessionData.id || `sess-${Date.now()}`;
  const today = new Date().toISOString().split("T")[0];

  stmtRun(
    `INSERT INTO sessions (id, client_id, session_number, date, raw_notes, dap_note, tags, follow_up_flags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, clientId, sessionData.sessionNumber, sessionData.date || today,
      sessionData.rawNotes || "",
      JSON.stringify(sessionData.dapNote || {}),
      JSON.stringify(sessionData.tags || {}),
      JSON.stringify(sessionData.followUpFlags || []),
    ]
  );

  // Update client's updated_at
  stmtRun("UPDATE clients SET updated_at = datetime('now') WHERE id = ?", [clientId]);

  return formatSessionRow(
    stmtGet("SELECT * FROM sessions WHERE id = ?", [id])
  );
}

async function getSessionCount(clientId) {
  await getDb();
  const row = stmtGet("SELECT COUNT(*) as count FROM sessions WHERE client_id = ?", [clientId]);
  return row.count;
}

// ======================== FORMATTERS ========================

function formatClientRow(row) {
  const treatmentPlan = safeJsonParse(row.treatment_plan, []);
  const lastTags = row.last_session_tags ? safeJsonParse(row.last_session_tags, {}) : null;

  // Find at-risk or plateau objectives
  const objectives = treatmentPlan.map ? treatmentPlan : (treatmentPlan.objectives || []);
  const nextAtRisk = objectives.find(
    (o) => o.status === "at-risk" || o.status === "plateau"
  );

  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    diagnosis: row.diagnosis,
    coOccurring: row.co_occurring,
    programType: row.program_type,
    admissionDate: row.admission_date,
    programDay: row.program_day,
    mat: row.mat,
    insurance: row.insurance,
    emergencyContact: row.emergency_contact,
    riskLevel: row.risk_level,
    treatmentPlan: { objectives },
    totalSessions: row.total_sessions || 0,
    lastSessionDate: row.last_session_date || null,
    lastSessionSentiment: lastTags?.sessionSentiment || "unknown",
    nextObjectiveAtRisk: nextAtRisk || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatSessionRow(row) {
  return {
    id: row.id,
    sessionNumber: row.session_number,
    date: row.date,
    rawNotes: row.raw_notes,
    dapNote: safeJsonParse(row.dap_note, {}),
    tags: safeJsonParse(row.tags, {}),
    followUpFlags: safeJsonParse(row.follow_up_flags, []),
  };
}

function safeJsonParse(str, fallback) {
  try {
    return typeof str === "string" ? JSON.parse(str) : str || fallback;
  } catch {
    return fallback;
  }
}

// ======================== SEED CHECK ========================

async function isSeeded() {
  await getDb();
  const row = stmtGet("SELECT COUNT(*) as count FROM clients");
  return row.count > 0;
}

module.exports = {
  getDb,
  getAllClients,
  getClientById,
  createClient,
  updateClientRisk,
  updateClientProgramDay,
  getSessionsByClient,
  addSession,
  getSessionCount,
  isSeeded,
};
