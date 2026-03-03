import React from "react";
import { Link } from "react-router-dom";
import { Users, Zap, Shield, ArrowRight, Search, Calendar, Award } from "lucide-react";

export default function Home() {
  
  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div style={styles.container}>
      
      {/* --- HERO SECTION --- */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          
          {/* REMOVED: The Badge <div> was here */}

          <h1 style={styles.heroTitle}>
            Trade Skills. <br />
            <span style={styles.gradientText}>Save Money.</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Don't pay for courses. Find a student who knows what you want to learn, 
            and teach them what you know in return.
          </p>

          <div style={styles.btnGroup}>
            {/* Added textDecoration: 'none' to remove underline */}
            <Link to="/discover" style={{ textDecoration: 'none' }}>
              <button style={styles.btnPrimary}>
                Find a Swap <ArrowRight size={18} />
              </button>
            </Link>
            
            <button style={styles.btnSecondary} onClick={scrollToHowItWorks}>
              How it Works
            </button>
          </div>
          </div>
      </header>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Simple 3-Step Process</h2>
          <p style={styles.sectionSub}>Everything you need to know to get started.</p>
        </div>

        <div style={styles.stepGrid}>
          <StepCard 
            step="01"
            icon={<Search size={28} color="#00c6ff" />} 
            title="Discover" 
            desc="Search for the skill you want to learn. Browse profiles of students who offer it." 
          />
          <StepCard 
            step="02"
            icon={<Calendar size={28} color="#FFD700" />} 
            title="Request Swap" 
            desc="Send a swap request. Propose a skill you can teach in return." 
          />
          <StepCard 
            step="03"
            icon={<Award size={28} color="#ff4d4d" />} 
            title="Learn & Earn" 
            desc="Connect via video/chat. Complete the session and earn 'Skill Credits' for your profile." 
          />
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to upgrade your skills?</h2>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button style={styles.btnCta}>Join Community Now</button>
        </Link>
      </section>

    </div>
  );
}

// --- HELPER COMPONENTS ---

const StatItem = ({ number, label }) => (
  <div style={styles.statItem}>
    <h3 style={{fontSize: "1.5rem", fontWeight: "bold", margin: 0}}>{number}</h3>
    <p style={{fontSize: "0.85rem", color: "#888", margin: 0}}>{label}</p>
  </div>
);

const StepCard = ({ step, icon, title, desc }) => (
  <div style={styles.stepCard}>
    <div style={styles.stepNumber}>{step}</div>
    <div style={styles.iconBox}>{icon}</div>
    <h3 style={styles.stepTitle}>{title}</h3>
    <p style={styles.stepDesc}>{desc}</p>
  </div>
);

// --- STYLES ---

const styles = {
  container: {
    background: "#0f0f13",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
    paddingBottom: "80px",
  },
  hero: {
    padding: "80px 20px 100px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "radial-gradient(circle at 50% 20%, #1a1a2e 0%, #0f0f13 70%)",
  },
  heroTitle: {
    fontSize: "3.8rem",
    fontWeight: "800",
    lineHeight: "1.1",
    marginBottom: "25px",
    letterSpacing: "-1px",
  },
  gradientText: {
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    color: "#aaa",
    maxWidth: "600px",
    margin: "0 auto 40px",
    lineHeight: "1.6",
  },
  btnGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginBottom: "60px",
  },
  btnPrimary: {
    padding: "15px 32px",
    background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    border: "none",
    borderRadius: "30px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 30px rgba(0, 198, 255, 0.25)",
    transition: "transform 0.2s",
  },
  btnSecondary: {
    padding: "15px 32px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "30px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: "40px",
    padding: "20px 50px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
  },
  statDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(255,255,255,0.1)",
  },
  
  /* How It Works Section */
  section: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: "60px",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  sectionSub: {
    color: "#888",
    fontSize: "1.1rem",
  },
  stepGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  stepCard: {
    background: "#16161a",
    padding: "40px 30px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    transition: "transform 0.3s",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  stepNumber: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "3rem",
    fontWeight: "900",
    color: "rgba(255,255,255,0.03)",
    zIndex: 0,
  },
  iconBox: {
    width: "70px",
    height: "70px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "25px",
    zIndex: 1,
  },
  stepTitle: {
    fontSize: "1.4rem",
    marginBottom: "15px",
    fontWeight: "700",
    zIndex: 1,
  },
  stepDesc: {
    color: "#aaa",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    zIndex: 1,
  },

  /* CTA Section */
  ctaSection: {
    textAlign: "center",
    padding: "80px 20px",
    background: "linear-gradient(180deg, rgba(0, 198, 255, 0.05) 0%, transparent 100%)",
    marginTop: "40px",
  },
  ctaTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "30px",
  },
  btnCta: {
    padding: "18px 40px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "40px",
    fontSize: "1.1rem",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(255,255,255,0.15)",
    transition: "transform 0.2s",
  }
};