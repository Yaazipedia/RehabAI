import { useState } from "react";
import { login } from "../../services/api";

export default function Login({ onLoggedIn, darkMode, onToggleDark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [spinToggle, setSpinToggle] = useState(false);

  function handleToggleDark() {
    setSpinToggle(true);
    onToggleDark();
    setTimeout(() => setSpinToggle(false), 500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onLoggedIn();
    } catch (err) {
      setError(err.message || "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "10px",
    border: "1.5px solid var(--clr-border)",
    background: "var(--bg-page)",
    padding: "11px 14px",
    fontSize: "14px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "var(--bg-page)",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(82, 183, 136, 0.12), transparent)",
      }}
    >
      {/* Theme toggle — same interaction as Header */}
      <div style={{ position: "absolute", top: "20px", right: "24px", zIndex: 10 }}>
        <button
          type="button"
          onClick={handleToggleDark}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "1.5px solid #d6e8db",
            background: "var(--bg-card)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            boxShadow: "var(--card-shadow)",
            transition: "border-color 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--green-accent)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#d6e8db";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span
            style={{
              display: "inline-block",
              animation: spinToggle ? "spin360 0.5s ease forwards" : "none",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div
            style={{
              borderRadius: "16px",
              background: "var(--bg-card)",
              boxShadow: "var(--card-shadow-md)",
              border: "1px solid rgba(27,61,47,0.06)",
              padding: "28px 28px 32px",
            }}
          >
            {/* Brand — aligned with Sidebar lockup, adapted for light card */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--green-dark)",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "18px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                R
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "17px",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  RehabIQ
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400, marginTop: "2px" }}>
                  Counselor sign in
                </div>
              </div>
            </div>

            <h1
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "22px", lineHeight: 1.45 }}>
              Sign in with your demo counselor account to open the clinical suite.
            </p>

            <form onSubmit={handleSubmit}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Email
              </label>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--green-accent)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(82, 183, 136, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--clr-border)";
                  e.target.style.boxShadow = "none";
                }}
              />

              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginTop: "16px",
                  marginBottom: "6px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--green-accent)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(82, 183, 136, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--clr-border)";
                  e.target.style.boxShadow = "none";
                }}
              />

              {error && (
                <p
                  role="alert"
                  style={{
                    marginTop: "14px",
                    fontSize: "13px",
                    color: "var(--clr-danger)",
                    background: "var(--clr-danger-light)",
                    border: "1px solid var(--clr-danger-border)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  marginTop: "22px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: submitting ? "wait" : "pointer",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#fff",
                  background: "linear-gradient(135deg, var(--clr-primary), var(--green-accent))",
                  boxShadow: "var(--shadow-primary)",
                  opacity: submitting ? 0.85 : 1,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!submitting) e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
