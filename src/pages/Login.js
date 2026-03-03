import React, { useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/discover"); // direct redirect
  };

  const handleSignup = () => {
    navigate("/discover"); // direct redirect for prototype
  };

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDE ART */}
      <div style={styles.leftPanel}>
        <div style={styles.brand}>
          <Zap size={28} fill="#fff" /> SkillSwap
        </div>
        <div>
          <h1 style={styles.headline}>Knowledge is the New Currency.</h1>
          <p style={styles.subhead}>Join NCU’s Skill Exchange Revolution.</p>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={styles.formSubtitle}>
            Enter your details to continue
          </p>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              placeholder="you@ncuindia.edu"
            />
          </div>

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button
            style={styles.btnPrimary}
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {isLogin ? "Sign In" : "Register"} <ArrowRight size={18} />
          </button>

          <p style={styles.switchText}>
            {isLogin ? "New here? " : "Already registered? "}
            <span
              style={styles.link}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create Account" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#0f0f13",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#151517",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  headline: { fontSize: "3.2rem", fontWeight: "800" },
  subhead: { fontSize: "1.1rem", opacity: 0.9, marginTop: "10px" },
  formBox: { width: "100%", maxWidth: "400px", padding: "40px" },
  formTitle: { fontSize: "2rem", marginBottom: "10px" },
  formSubtitle: { color: "#888", marginBottom: "35px" },
  inputGroup: { marginBottom: "18px" },
  label: { fontSize: "0.9rem", color: "#aaa", marginBottom: "5px" },
  input: {
    width: "100%",
    padding: "12px",
    background: "#202024",
    borderRadius: "10px",
    border: "1px solid #333",
    color: "#fff",
  },
  btnPrimary: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    background: "#fff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  switchText: { marginTop: "20px", textAlign: "center", color: "#888" },
  link: { color: "#00c6ff", cursor: "pointer", fontWeight: "bold" },
};
