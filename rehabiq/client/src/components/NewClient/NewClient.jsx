import { useState } from "react";
import { createNewClient } from "../../services/api";

const PROGRAM_TYPES = [
  "Intensive Outpatient (IOP)",
  "Outpatient",
  "Outpatient + MAT",
  "Residential",
  "Partial Hospitalization (PHP)",
];

const RISK_LEVELS = [
  { value: "low", label: "Low", color: "var(--clr-success)" },
  { value: "moderate", label: "Moderate", color: "var(--clr-warning)" },
  { value: "high", label: "High", color: "var(--clr-danger)" },
];

export default function NewClient({ onBack, onClientCreated }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    diagnosis: "",
    coOccurring: "",
    programType: "Outpatient",
    mat: "",
    insurance: "",
    emergencyContact: "",
    riskLevel: "moderate",
  });
  const [objectives, setObjectives] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addObjective() {
    setObjectives((prev) => [...prev, ""]);
  }

  function updateObjective(index, value) {
    setObjectives((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function removeObjective(index) {
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.age || !form.diagnosis) return;

    setSaving(true);
    setError(null);
    try {
      const client = await createNewClient({
        ...form,
        age: parseInt(form.age),
        objectives: objectives
          .filter((o) => o.trim())
          .map((o) => ({ description: o.trim(), status: "in-progress" })),
      });
      onClientCreated(client.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "40px 48px", maxWidth: "860px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <button onClick={onBack} className="text-sm font-medium transition-base" style={{ color: "var(--clr-muted)" }}
          onMouseEnter={(e) => (e.target.style.color = "var(--clr-primary)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--clr-muted)")}>
          ← Back
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--clr-slate)" }}>Add new client</h2>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--clr-muted)" }}>
            Enter client information to create a new record
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic info */}
        <div className="card mb-5" style={{ padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--clr-slate)" }}>Basic information</h3>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Full name *
              </label>
              <input type="text" className="input-base" placeholder="e.g. John Smith"
                value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>Age *</label>
                <input type="number" className="input-base" placeholder="e.g. 34" min="12" max="100"
                  value={form.age} onChange={(e) => updateField("age", e.target.value)} required />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>Gender</label>
                <select className="input-base" value={form.gender} onChange={(e) => updateField("gender", e.target.value)}>
                  <option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Primary diagnosis *
              </label>
              <input type="text" className="input-base" placeholder="e.g. Alcohol Use Disorder (Moderate)"
                value={form.diagnosis} onChange={(e) => updateField("diagnosis", e.target.value)} required />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Co-occurring conditions
              </label>
              <input type="text" className="input-base" placeholder="e.g. Generalized Anxiety Disorder"
                value={form.coOccurring} onChange={(e) => updateField("coOccurring", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Program info */}
        <div className="card mb-5" style={{ padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 className="text-sm font-bold" style={{ color: "var(--clr-slate)" }}>Program details</h3>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Program type *
              </label>
              <select className="input-base" value={form.programType} onChange={(e) => updateField("programType", e.target.value)}>
                {PROGRAM_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Initial risk level
              </label>
              <div className="flex gap-2">
                {RISK_LEVELS.map((r) => (
                  <button key={r.value} type="button"
                    onClick={() => updateField("riskLevel", r.value)}
                    className="flex-1 rounded-lg text-[13px] font-medium transition-base text-center"
                    style={{
                      padding: "10px 4px",
                      background: form.riskLevel === r.value ? r.color : "var(--clr-bg)",
                      color: form.riskLevel === r.value ? "white" : "var(--clr-muted)",
                      border: `1.5px solid ${form.riskLevel === r.value ? r.color : "var(--clr-border)"}`,
                    }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                MAT medication
              </label>
              <input type="text" className="input-base" placeholder="e.g. Suboxone 8mg/day"
                value={form.mat} onChange={(e) => updateField("mat", e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
                Insurance
              </label>
              <input type="text" className="input-base" placeholder="e.g. Medicaid"
                value={form.insurance} onChange={(e) => updateField("insurance", e.target.value)} />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2" style={{ color: "var(--clr-muted)" }}>
              Emergency contact
            </label>
            <input type="text" className="input-base" placeholder="e.g. Jane Smith (Mother) — (812) 555-0123"
              value={form.emergencyContact} onChange={(e) => updateField("emergencyContact", e.target.value)} />
          </div>
        </div>

        {/* Treatment plan objectives */}
        <div className="card mb-6" style={{ padding: "28px 28px 24px" }}>
          <div className="flex items-center justify-between mb-5">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--clr-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3 className="text-sm font-bold" style={{ color: "var(--clr-slate)" }}>Treatment plan objectives</h3>
            </div>
            <button type="button" onClick={addObjective} className="btn-outline" style={{ fontSize: "12px", padding: "5px 12px" }}>
              + Add objective
            </button>
          </div>

          <div className="space-y-2.5">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-medium w-8 text-center flex-shrink-0"
                  style={{ color: "var(--clr-muted)" }}>{i + 1}.</span>
                <input type="text" className="input-base" placeholder={`e.g. ${i === 0 ? "Maintain sobriety and manage cravings" : i === 1 ? "Develop healthy coping strategies" : "Build support network"}`}
                  value={obj} onChange={(e) => updateObjective(i, e.target.value)} />
                {objectives.length > 1 && (
                  <button type="button" onClick={() => removeObjective(i)}
                    className="text-[18px] px-2 transition-base flex-shrink-0"
                    style={{ color: "var(--clr-muted)" }}
                    onMouseEnter={(e) => (e.target.style.color = "var(--clr-danger)")}
                    onMouseLeave={(e) => (e.target.style.color = "var(--clr-muted)")}>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl" style={{ background: "var(--clr-danger-light)", border: "1px solid var(--clr-danger-border)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--clr-danger)" }}>Error: {error}</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="btn-outline flex-1 py-3">Cancel</button>
          <button type="submit" disabled={saving || !form.name || !form.age || !form.diagnosis}
            className="btn-primary flex-1 py-3" style={{ opacity: (!form.name || !form.age || !form.diagnosis) ? 0.5 : 1 }}>
            {saving ? "Creating client..." : "Create client"}
          </button>
        </div>
      </form>
    </div>
  );
}
