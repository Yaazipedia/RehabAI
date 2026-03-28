// =============================================================
// Seed the database with mock client/session data
// Run automatically on server start if DB is empty
// =============================================================

const { clients } = require("./mockData");
const { getDb, isSeeded } = require("./database");

async function seedDatabase() {
  if (await isSeeded()) {
    console.log("   Database already seeded — skipping");
    return;
  }

  console.log("   Seeding database with mock data...");
  const db = await getDb();

  // sql.js doesn't have .prepare().run() like better-sqlite3;
  // we use db.run(sql, params) instead.

  db.run("BEGIN TRANSACTION;");

  for (const client of clients) {
    db.run(
      `INSERT INTO clients (id, name, age, gender, diagnosis, co_occurring, program_type,
        admission_date, program_day, mat, insurance, emergency_contact, risk_level,
        treatment_plan, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        client.id,
        client.name,
        client.age,
        client.gender,
        client.diagnosis,
        client.coOccurring || null,
        client.programType,
        client.admissionDate,
        client.programDay,
        client.mat || null,
        client.insurance || null,
        client.emergencyContact || null,
        client.riskLevel,
        JSON.stringify(client.treatmentPlan.objectives),
      ]
    );

    for (const session of client.sessions) {
      db.run(
        `INSERT INTO sessions (id, client_id, session_number, date, raw_notes, dap_note, tags, follow_up_flags, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          session.id,
          client.id,
          session.sessionNumber,
          session.date,
          session.rawNotes,
          JSON.stringify(session.dapNote),
          JSON.stringify(session.tags),
          JSON.stringify(session.followUpFlags),
        ]
      );
    }
  }

  db.run("COMMIT;");

  // Persist to disk
  const fs = require("fs");
  const path = require("path");
  const data = db.export();
  fs.writeFileSync(path.join(__dirname, "rehabiq.db"), Buffer.from(data));

  const clientCount = db.prepare("SELECT COUNT(*) as c FROM clients");
  clientCount.step();
  const cCount = clientCount.getAsObject().c;
  clientCount.free();

  const sessionCount = db.prepare("SELECT COUNT(*) as c FROM sessions");
  sessionCount.step();
  const sCount = sessionCount.getAsObject().c;
  sessionCount.free();

  console.log(`   ✅ Seeded ${cCount} clients with ${sCount} sessions`);
}

module.exports = { seedDatabase };
