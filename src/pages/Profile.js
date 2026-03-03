import React, { useState } from "react";
import {
  Edit2,
  Save,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Camera,
  Briefcase,
  Star,
  Repeat
} from "lucide-react";

export default function Profile() {
  const [editing, setEditing] = useState(false);

  // Expanded mock data for a "SkillSwap" context
  const [user, setUser] = useState({
    name: "Bhumika",
    tagline: "B.Tech CSE | Full Stack Developer",
    bio: "Passionate about building scalable web applications. I love teaching React and looking to trade knowledge for advanced Python backend skills.",
    skillsOffered: ["React", "JavaScript", "UI/UX Design", "CSS"],
    skillsWanted: ["Python", "Machine Learning", "AWS"],
    stats: {
      swaps: 12,
      rating: 4.8,
      reviews: 24
    }
  });

  const toggleEdit = () => setEditing(!editing);

  return (
    <div style={styles.container}>
      
      {/* --- Cover Photo --- */}
      <div style={styles.coverPhoto}>
        <button style={styles.coverEditBtn}>
          <Camera size={16} color="#fff" />
          <span style={{ marginLeft: 5 }}>Change Cover</span>
        </button>
      </div>

      <div style={styles.contentWrapper}>
        
        {/* --- Profile Header Card --- */}
        <div style={styles.card}>
          <div style={styles.headerTop}>
            {/* Avatar - Negative margin to pull it up */}
            <div style={styles.avatarWrapper}>
              <div style={styles.avatar}>
                {user.name[0]}
              </div>
              {editing && <div style={styles.editOverlay}><Camera size={20} /></div>}
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button style={styles.btnPrimary} onClick={toggleEdit}>
                {editing ? (
                  <><Save size={16} /> Save Profile</>
                ) : (
                  <><Edit2 size={16} /> Edit Profile</>
                )}
              </button>
            </div>
          </div>

          {/* User Details */}
          <div style={styles.infoSection}>
            {editing ? (
              <input
                style={styles.inputName}
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            ) : (
              <h1 style={styles.name}>{user.name}</h1>
            )}

            {editing ? (
              <input
                style={styles.inputTagline}
                value={user.tagline}
                onChange={(e) => setUser({ ...user, tagline: e.target.value })}
              />
            ) : (
              <p style={styles.tagline}>{user.tagline}</p>
            )}

            <div style={styles.metaRow}>
              <div style={styles.metaItem}>
                <MapPin size={14} color="#888" />
                <span>{user.location}</span>
              </div>
              <div style={styles.metaItem}>
                <Briefcase size={14} color="#888" />
                <span>Student / Freelancer</span>
              </div>
            </div>

            {/* Social Links */}
            <div style={styles.socialRow}>
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>

            {/* Stats Bar */}
            <div style={styles.statsBar}>
              <div style={styles.statItem}>
                <span style={styles.statNum}>{user.stats.swaps}</span>
                <span style={styles.statLabel}>Swaps</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.statItem}>
                <span style={styles.statNum}>{user.stats.rating} <Star size={12} fill="#FFD700" color="#FFD700"/></span>
                <span style={styles.statLabel}>Rating</span>
              </div>
              <div style={styles.divider} />
              <div style={styles.statItem}>
                <span style={styles.statNum}>{user.stats.reviews}</span>
                <span style={styles.statLabel}>Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- About Section --- */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>About Me</h3>
          {editing ? (
            <textarea
              style={styles.textArea}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />
          ) : (
            <p style={styles.bioText}>{user.bio}</p>
          )}
        </div>

        {/* --- Skill Swap Section --- */}
        <div style={styles.row}>
          
          {/* Skills Offered */}
          <div style={{...styles.card, flex: 1}}>
            <h3 style={{...styles.sectionTitle, color: "#00c6ff"}}>
               Skills I Teach 
            </h3>
            <div style={styles.skillGrid}>
              {user.skillsOffered.map((skill, i) => (
                <span key={i} style={styles.skillChipOffered}>{skill}</span>
              ))}
              {editing && <button style={styles.addSkillBtn}>+ Add</button>}
            </div>
          </div>

          {/* Skills Wanted */}
          <div style={{...styles.card, flex: 1}}>
            <h3 style={{...styles.sectionTitle, color: "#ff007a"}}>
               Skills I Want 
            </h3>
            <div style={styles.skillGrid}>
              {user.skillsWanted.map((skill, i) => (
                <span key={i} style={styles.skillChipWanted}>{skill}</span>
              ))}
              {editing && <button style={styles.addSkillBtn}>+ Add</button>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Helper Component for Social Icons
const SocialIcon = ({ icon }) => (
  <div style={styles.socialIcon}>
    {icon}
  </div>
);

/* --- Styles --- */
const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f0f13",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "50px",
  },
  coverPhoto: {
    height: "200px",
    width: "100%",
    background: "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: "20px",
  },
  coverEditBtn: {
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    backdropFilter: "blur(5px)",
  },
  contentWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "-60px", // Pulls content up over cover
  },
  card: {
    background: "#1e1e22",
    borderRadius: "16px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.05)",
    position: "relative",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  avatarWrapper: {
    position: "relative",
    marginTop: "-75px", // Pulls avatar up
  },
  avatar: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "#222",
    border: "4px solid #1e1e22",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3rem",
    fontWeight: "bold",
    color: "#fff",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
  editOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border: "4px solid #1e1e22",
  },
  actionButtons: {
    marginTop: "10px",
  },
  btnPrimary: {
    background: "#00c6ff",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "0.2s",
  },
  infoSection: {
    textAlign: "left",
  },
  name: {
    fontSize: "2rem",
    margin: "0 0 5px 0",
    fontWeight: "700",
  },
  inputName: {
    fontSize: "2rem",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #00c6ff",
    color: "#fff",
    outline: "none",
    width: "100%",
    marginBottom: "5px",
    fontWeight: "700",
  },
  tagline: {
    color: "#aaa",
    fontSize: "1.1rem",
    margin: "0 0 15px 0",
  },
  inputTagline: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #555",
    color: "#aaa",
    outline: "none",
    width: "100%",
    fontSize: "1.1rem",
    marginBottom: "15px",
  },
  metaRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    color: "#888",
    fontSize: "0.9rem",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  socialRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
  },
  socialIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#fff",
    transition: "background 0.2s",
  },
  statsBar: {
    display: "flex",
    background: "rgba(255,255,255,0.03)",
    padding: "15px",
    borderRadius: "12px",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  statLabel: {
    fontSize: "0.8rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "2px",
  },
  divider: {
    width: "1px",
    height: "30px",
    background: "rgba(255,255,255,0.1)",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    marginBottom: "15px",
    fontWeight: "600",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "10px",
  },
  bioText: {
    lineHeight: "1.6",
    color: "#ccc",
  },
  textArea: {
    width: "100%",
    height: "100px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px",
    outline: "none",
    resize: "vertical",
  },
  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  skillGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillChipOffered: {
    background: "rgba(0,198,255,0.15)",
    color: "#00c6ff",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    border: "1px solid rgba(0,198,255,0.2)",
  },
  skillChipWanted: {
    background: "rgba(255, 0, 122, 0.15)",
    color: "#ff007a",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    border: "1px solid rgba(255, 0, 122, 0.2)",
  },
  addSkillBtn: {
    background: "transparent",
    border: "1px dashed #555",
    color: "#888",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};