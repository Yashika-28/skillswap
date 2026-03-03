import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, GraduationCap, Sparkles } from "lucide-react";

export default function Discover() {
  const navigate = useNavigate();

  const users = [
    { name: "Yashika", course: "BTech", skills: "Coding" },
    { name: "Bhumika", course: "MBA", skills: "Cooking" },
    { name: "Nikhil", course: "BTech", skills: "Photography" },
    { name: "Riya", course: "BBA", skills: "Design" },
    { name: "Aarav", course: "BTech", skills: "Music" },
    { name: "Simran", course: "MBA", skills: "Public Speaking" },
    { name: "Harsh", course: "BTech", skills: "Marketing" },
    { name: "Ananya", course: "BCA", skills: "Dancing" },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Swap skills with NCU students</h1>

      <div style={styles.grid}>
        {users.map((u, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
            <h3 style={styles.name}>{u.name}</h3>

            <p style={styles.info}>
              <MapPin size={14} /> NCU Gurgaon
            </p>

            <p style={styles.info}>
              <GraduationCap size={14} /> Course: {u.course}
            </p>

            <p style={styles.info}>
              <Sparkles size={14} /> Skills: {u.skills}
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate(`/messages?user=${encodeURIComponent(u.name)}`)
              }
            >
              Connect →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "40px", color: "#fff", background: "#0f0f13" },
  heading: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#151517",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    margin: "0 auto 10px",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#000",
  },
  name: { fontSize: "1.1rem", marginTop: "5px" },
  info: {
    fontSize: "0.85rem",
    marginTop: "6px",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
