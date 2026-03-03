// src/pages/Messages.js — Real-time Slack-style messenger with connection restrictions
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Send, Calendar, Search, Plus, X, Phone, Video, Lock, UserPlus } from "lucide-react";

const API = "http://localhost:3002";

export default function Messages() {
  const { theme, user: authUser, isInNetwork, addToNetwork } = useAuth();
  const { isOnline, sendMessage: socketSend, sendTyping, addMessageListener, sendSwapRequest, sendMessageRequest } = useSocket() || {};
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const openUserId = params.get("user");

  const [allUsers, setAllUsers] = useState([]);
  const [convs, setConvs] = useState([]); // [{ userId, messages, lastMsg, time }]
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [typing, setTyping] = useState(false);
  const [requestSent, setRequestSent] = useState({});
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const isDark = theme === "dark";

  /* ── Fetch all users ── */
  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((r) => r.json())
      .then(setAllUsers)
      .catch(() => { });
  }, []);

  /* ── Load conversation when user selected ── */
  const loadConv = useCallback(async (targetUser) => {
    if (!authUser) return;
    const existing = convs.find((c) => c.userId === targetUser.id);
    if (existing) { setSelected(existing); return; }

    const msgs = await fetch(`${API}/api/messages/${authUser.id}/${targetUser.id}`)
      .then((r) => r.json()).catch(() => []);

    const newConv = {
      userId: targetUser.id,
      user: targetUser,
      messages: msgs,
      lastMsg: msgs.at(-1)?.text || "No messages yet",
      time: msgs.at(-1)?.time || "",
    };
    setConvs((cs) => [newConv, ...cs.filter((c) => c.userId !== targetUser.id)]);
    setSelected(newConv);
  }, [authUser, convs]);

  /* ── Auto-open conversation if ?user= param ── */
  useEffect(() => {
    if (openUserId && allUsers.length) {
      const target = allUsers.find((u) => u.id === openUserId);
      if (target) loadConv(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openUserId, allUsers]);

  /* ── Socket message listener ── */
  useEffect(() => {
    if (!addMessageListener) return;
    const remove = addMessageListener(({ convId, message }) => {
      const [aId, bId] = convId.split("_");
      const partnerId = aId === authUser?.id ? bId : aId;
      setConvs((cs) =>
        cs.map((c) =>
          c.userId === partnerId
            ? { ...c, messages: [...c.messages, message], lastMsg: message.text, time: message.time }
            : c
        )
      );
      setSelected((s) =>
        s?.userId === partnerId
          ? { ...s, messages: [...s.messages, message], lastMsg: message.text, time: message.time }
          : s
      );
    });
    return remove;
  }, [addMessageListener, authUser]);

  /* ── Scroll to bottom ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const handleSend = () => {
    if (!input.trim() || !selected || !authUser) return;
    if (!isInNetwork(selected.userId)) return; // guard

    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const msg = { id: `local_${Date.now()}`, from: authUser.id, to: selected.userId, text: input.trim(), time: now, createdAt: Date.now() };

    // Optimistic update
    setConvs((cs) => cs.map((c) => c.userId === selected.userId ? { ...c, messages: [...c.messages, msg], lastMsg: msg.text, time: now } : c));
    setSelected((s) => ({ ...s, messages: [...(s?.messages || []), msg], lastMsg: msg.text, time: now }));

    // Send via socket
    socketSend?.(authUser.id, selected.userId, input.trim());
    setInput("");
  };

  const handleTyping = () => {
    if (!selected || !authUser) return;
    sendTyping?.(authUser.id, selected.userId);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => setTyping(false), 2000);
  };

  const suggestMeeting = async () => {
    if (!selected || !authUser) return;
    const msg = `📅 Meeting Request: I'd like to schedule a 30-min session. Open to this weekend?`;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const meetingObj = { from: authUser.id, to: selected.userId, note: msg, date: null, time: null };
    try { await fetch(`${API}/api/meetings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(meetingObj) }); } catch { }
    socketSend?.(authUser.id, selected.userId, msg);
  };

  const handleRequestToMessage = () => {
    if (!selected || !authUser) return;
    sendMessageRequest?.(authUser.id, selected.userId);
    setRequestSent((r) => ({ ...r, [selected.userId]: "message" }));
  };

  const handleRequestToSwap = (targetUser) => {
    if (!authUser) return;
    sendSwapRequest?.(authUser.id, targetUser.id, authUser.skillsOffered?.[0] || "React", targetUser.skillsWanted?.[0] || "Help");
    setRequestSent((r) => ({ ...r, [targetUser.id]: "swap" }));
  };

  // UI helpers
  const bg = isDark ? "#0c0c10" : "#F0F2FF";
  const sideBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.92)";
  const border = isDark ? "rgba(255,255,255,0.07)" : "rgba(108,99,255,0.15)";
  const txt = isDark ? "#F0F0FF" : "#1A1A30";
  const muted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  const canMessage = selected ? isInNetwork(selected.userId) : false;
  const contactsWithoutConv = allUsers.filter(
    (u) => u.id !== authUser?.id && !convs.some((c) => c.userId === u.id) &&
      u.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div style={{ height: "100vh", display: "flex", background: bg, fontFamily: "'Inter',sans-serif", color: txt, position: "relative" }}>

      {/* New Chat Modal */}
      {showNewChat && (
        <div style={S.modalOverlay} onClick={() => setShowNewChat(false)}>
          <div style={{ ...S.modal, background: isDark ? "#1a1a28" : "#fff", border: `1px solid ${border}`, color: txt }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700 }}>Start New Chat</h3>
              <button style={S.iconBtn} onClick={() => setShowNewChat(false)}><X size={16} /></button>
            </div>
            <div style={{ ...S.searchRow, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${border}`, marginBottom: 12 }}>
              <Search size={14} style={{ color: muted }} />
              <input style={{ border: "none", outline: "none", background: "transparent", color: txt, flex: 1, fontSize: "0.88rem", fontFamily: "'Inter',sans-serif" }}
                placeholder="Search..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} autoFocus />
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {contactsWithoutConv.map((u) => {
                const online = isOnline?.(u.id);
                const connected = isInNetwork(u.id);
                return (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderRadius: 10, cursor: "pointer" }}
                    onClick={() => { loadConv(u); setShowNewChat(false); }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: u.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.85rem" }}>{u.avatar}</div>
                      <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: online ? "#2ecc71" : "#555", border: "2px solid #1a1a28" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: 1 }}>{u.name}</p>
                      <p style={{ fontSize: "0.72rem", color: muted }}>{u.role}</p>
                    </div>
                    {!connected && <Lock size={13} color="#f5c518" title="Not connected" />}
                  </div>
                );
              })}
              {contactsWithoutConv.length === 0 && <p style={{ textAlign: "center", color: muted, padding: "16px 0", fontSize: "0.85rem" }}>All contacts have conversations</p>}
            </div>
          </div>
        </div>
      )}

      {/* LEFT — conversations list */}
      <div style={{ width: 280, minWidth: 280, borderRight: `1px solid ${border}`, background: sideBg, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 14px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700 }}>Messages</h2>
            <button style={{ ...S.newBtn, background: isDark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.1)", color: "#6C63FF" }} onClick={() => { setShowNewChat(true); setSearchQ(""); }}>
              <Plus size={15} /> New
            </button>
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {convs.length === 0 && (
            <p style={{ textAlign: "center", color: muted, padding: "24px 16px", fontSize: "0.82rem" }}>No conversations yet.<br />Click + New to start one.</p>
          )}
          {convs.map((c) => {
            const online = isOnline?.(c.userId);
            const connected = isInNetwork(c.userId);
            return (
              <div key={c.userId} style={{ padding: "11px 14px", cursor: "pointer", background: selected?.userId === c.userId ? (isDark ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.07)") : "transparent", borderLeft: selected?.userId === c.userId ? "3px solid #6C63FF" : "3px solid transparent", display: "flex", gap: 10, alignItems: "center" }}
                onClick={() => setSelected(c)}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: c.user?.avatarColor || "#6C63FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{c.user?.avatar || "?"}</div>
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: online ? "#2ecc71" : "#555", border: "2px solid " + bg }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: "0.87rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.user?.name}</span>
                    <span style={{ fontSize: "0.68rem", color: muted, flexShrink: 0, marginLeft: 4 }}>{c.time}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {!connected && <Lock size={10} color="#f5c518" />}
                    <span style={{ fontSize: "0.74rem", color: muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT — Chat window */}
      {selected ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Header */}
          <div style={{ padding: "14px 24px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12, background: sideBg }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: selected.user?.avatarColor || "#555", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff" }}>{selected.user?.avatar}</div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 11, height: 11, borderRadius: "50%", background: isOnline?.(selected.userId) ? "#2ecc71" : "#555", border: `2px solid ${bg}` }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{selected.user?.name}</p>
              <p style={{ fontSize: "0.75rem", color: isOnline?.(selected.userId) ? "#2ecc71" : muted }}>
                {isOnline?.(selected.userId) ? "● Online" : "○ Away"} · {selected.user?.role}
              </p>
            </div>
            <button style={S.iconBtn} title="Voice call"><Phone size={15} /></button>
            <button style={S.iconBtn} title="Video call"><Video size={15} /></button>
            <button style={{ ...S.iconBtn, color: "#6C63FF", borderColor: "rgba(108,99,255,0.3)" }} onClick={suggestMeeting}>
              <Calendar size={15} /> <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>Meet</span>
            </button>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {selected.messages.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: muted }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>👋</div>
                <p style={{ fontSize: "0.9rem" }}>Say hello to {selected.user?.name}!</p>
              </div>
            )}
            {selected.messages.map((m, i) => {
              const isMe = m.from === authUser?.id || m.sender === "You";
              return (
                <div key={m.id || i} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                  {!isMe && <div style={{ width: 28, height: 28, borderRadius: "50%", background: selected.user?.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.72rem", flexShrink: 0 }}>{selected.user?.avatar}</div>}
                  <div>
                    <div style={{ padding: "10px 15px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: isMe ? "linear-gradient(135deg,#6C63FF,#00c6ff)" : (isDark ? "rgba(255,255,255,0.07)" : "rgba(108,99,255,0.08)"), color: isMe ? "#fff" : txt, maxWidth: 380, fontSize: "0.88rem", lineHeight: 1.55, boxShadow: isMe ? "0 4px 12px rgba(108,99,255,0.25)" : "none" }}>
                      {m.text}
                    </div>
                    <p style={{ fontSize: "0.65rem", color: muted, marginTop: 3, textAlign: isMe ? "right" : "left" }}>{m.time}</p>
                  </div>
                </div>
              );
            })}
            {typing && <p style={{ fontSize: "0.75rem", color: muted, fontStyle: "italic" }}>{selected.user?.name} is typing…</p>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input / Restriction Area */}
          <div style={{ padding: "14px 24px", borderTop: `1px solid ${border}`, background: sideBg }}>
            {canMessage ? (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${border}`, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)", color: txt, outline: "none", fontSize: "0.88rem", fontFamily: "'Inter',sans-serif" }}
                  placeholder={`Message ${selected.user?.name}...`}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button style={S.sendBtn} onClick={handleSend}><Send size={17} /></button>
              </div>
            ) : (
              <div style={S.restrictionBox}>
                <Lock size={20} color="#f5c518" />
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>You're not connected yet</p>
                  <p style={{ fontSize: "0.8rem", color: muted }}>Send a request to start a conversation or propose a skill swap.</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
                  <button
                    style={{ ...S.reqBtn, background: requestSent[selected.userId] === "message" ? "rgba(46,204,113,0.15)" : "rgba(255,255,255,0.05)", borderColor: requestSent[selected.userId] === "message" ? "#2ecc71" : "rgba(255,255,255,0.1)", color: requestSent[selected.userId] === "message" ? "#2ecc71" : txt }}
                    onClick={handleRequestToMessage}
                    disabled={!!requestSent[selected.userId]}
                  >
                    <UserPlus size={14} />{requestSent[selected.userId] === "message" ? "Requested!" : "Request to Message"}
                  </button>
                  <button
                    style={{ ...S.reqBtn, background: requestSent[selected.userId] === "swap" ? "rgba(46,204,113,0.15)" : "linear-gradient(135deg,#6C63FF,#00c6ff)", borderColor: "transparent", color: "#fff" }}
                    onClick={() => handleRequestToSwap(selected.user)}
                    disabled={!!requestSent[selected.userId]}
                  >
                    ⇄ {requestSent[selected.userId] === "swap" ? "Swap Requested!" : "Request Swap"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: muted }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>💬</div>
            <p>Select a conversation or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" },
  modal: { width: 370, borderRadius: 18, padding: "24px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" },
  searchRow: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10 },
  iconBtn: { display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem" },
  newBtn: { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Inter',sans-serif" },
  sendBtn: { width: 44, height: 44, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6C63FF,#00c6ff)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  restrictionBox: { display: "flex", alignItems: "flex-start", gap: 14, padding: "16px", borderRadius: 14, background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.2)" },
  reqBtn: { display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 9, border: "1px solid", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap" },
};
