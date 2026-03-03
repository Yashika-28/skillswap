import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Messages() {
  const users = [
    { name: "Yashika", lastMsg: "Sure, I can help!", replies: ["Hi, this is Yashika!"], time: "44m" },
    { name: "Priya Verma", lastMsg: "Thanks for your time!", replies: ["Hey, what's up?"], time: "1h" },
    { name: "Rohan Gupta", lastMsg: "See you tomorrow!", replies: ["Let's do this!"], time: "3h" },
    { name: "Meera Desai", lastMsg: "Let's practice together", replies: ["Nice to meet you!"], time: "1d" },
    { name: "Rahul Mehta", lastMsg: "Working on a project", replies: ["Ping me anytime!"], time: "2d" },
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clickedName = queryParams.get("user");

  const defaultChatUser =
    users.find((u) => u.name.includes(clickedName)) || users[0];

  const [selectedUser, setSelectedUser] = useState(defaultChatUser);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([
    { sender: defaultChatUser.name, msg: defaultChatUser.replies[0] },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setChat([...chat, { sender: "You", msg: input }]);
    setInput("");
  };

  return (
    <div style={styles.main}>
      {/* LEFT USERS LIST */}
      <div style={styles.sidebar}>
        <h3 style={styles.title}>Conversations</h3>
        {users.map((u, index) => (
          <div
            key={index}
            style={styles.userRow}
            onClick={() => {
              setSelectedUser(u);
              setChat([{ sender: u.name, msg: u.replies[0] }]);
            }}
          >
            <div style={styles.avatar}>{u.name.charAt(0)}</div>
            <div>
              <b>{u.name}</b>
              <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>{u.lastMsg}</p>
            </div>
            <span style={styles.time}>{u.time}</span>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={styles.chatArea}>
        <h3>{selectedUser.name}</h3>

        <div style={styles.messagesBox}>
          {chat.map((c, i) => (
            <div key={i} style={styles.msg}>
              {c.msg}
            </div>
          ))}
        </div>

        <div style={styles.inputBox}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  main: {
    display: "flex",
    height: "92vh",
    background: "#0f0f13",
    color: "#fff",
  },
  sidebar: {
    width: "25%",
    borderRight: "1px solid #222",
    padding: "15px",
  },
  title: { marginBottom: "15px" },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "8px",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    background: "#0072ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    marginLeft: "auto",
    fontSize: "0.7rem",
    opacity: 0.6,
  },
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  messagesBox: {
    flex: 1,
    padding: "10px",
    marginTop: "10px",
    background: "#151517",
    borderRadius: "10px",
    overflowY: "auto",
  },
  msg: {
    background: "#222",
    padding: "10px",
    borderRadius: "6px",
    width: "fit-content",
    margin: "6px 0",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    background: "#222",
    border: "none",
    color: "#fff",
    outline: "none",
  },
  sendBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#0072ff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
