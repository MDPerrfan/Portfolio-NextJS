"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContact } from "@/lib/api";

// ── Constants ─────────────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  { label: "EMAIL", value: "mdperrfan@gmail.com", href: "mailto:mdperrfan@gmail.com" },
  { label: "GITHUB", value: "github.com/MDPerrfan", href: "https://github.com/MDPerrfan" },
  { label: "LINKEDIN", value: "in/mdperrfan", href: "https://linkedin.com/in/mdperrfan" },
  { label: "LOCATION", value: "Chittagong, Bangladesh", href: null },
];

// Rotating status messages shown in the signal panel
const STATUS_LINES = [
  "ACCEPTING NEW PROJECTS",
  "OPEN TO COLLABORATION",
  "AVAILABLE FOR HIRE",
  "READY TO SHIP",
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 38, deps = []) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, deps); // eslint-disable-line
  return displayed;
}

// ── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor({ color = "#f97316" }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 520);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: "0.85em",
        background: on ? color : "transparent",
        verticalAlign: "middle",
        marginLeft: 1,
        borderRadius: 1,
        transition: "background 0.08s",
      }}
    />
  );
}

// ── Animated signal bars ──────────────────────────────────────────────────────
function SignalBars({ color = "#4ade80" }) {
  const heights = [4, 8, 13, 18, 24];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 26 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          style={{ width: 5, background: color, borderRadius: 1, opacity: 0.9 }}
          animate={{ height: [h * 0.5, h, h * 0.7, h] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ── Scanline overlay ──────────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
        borderRadius: "inherit",
      }}
    />
  );
}

// ── Left panel — Signal / info side ──────────────────────────────────────────
function SignalPanel({ visible }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_LINES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const statusText = useTypewriter(STATUS_LINES[statusIdx], 42, [statusIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -32 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: "relative",
        flex: "0 0 340px",
        background: "#06060f",
        borderRight: "1px solid #1a1a28",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "32px 28px",
        gap: 0,
      }}
    >
      <Scanlines />

      {/* Corner brackets */}
      {[
        { top: 10, left: 10, borderTop: "2px solid #f9731644", borderLeft: "2px solid #f9731644" },
        { top: 10, right: 10, borderTop: "2px solid #f9731644", borderRight: "2px solid #f9731644" },
        { bottom: 10, left: 10, borderBottom: "2px solid #f9731644", borderLeft: "2px solid #f9731644" },
        { bottom: 10, right: 10, borderBottom: "2px solid #f9731644", borderRight: "2px solid #f9731644" },
      ].map((style, i) => (
        <div key={i} style={{ position: "absolute", width: 16, height: 16, zIndex: 2, ...style }} />
      ))}

      {/* System clock */}
      <div style={{ zIndex: 2, marginBottom: 32 }}>
        <div
                className="text-gray-300"

          style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            marginBottom: 4,
          }}
        >
          SYS.CLOCK
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f97316",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          {time || "00:00:00"}
        </div>
      </div>

      {/* Connection status */}
      <div style={{ zIndex: 2, marginBottom: 28 }}>
        <div
          className="text-gray-400"
          style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            marginBottom: 10,
          }}
        >
          CONNECTION STATUS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <SignalBars color="#4ade80" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <motion.div
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4ade80", fontFamily: "monospace" }}>
                ONLINE
              </span>
            </div>
            <span style={{ fontSize: "0.6rem", color: "#2a2a3e", fontFamily: "monospace" }}>
              PING: 12ms
            </span>
          </div>
        </div>

        {/* Animated status line */}
        <div
          style={{
            background: "#0a0a18",
            border: "1px solid #1a1a28",
            borderRadius: 4,
            padding: "9px 12px",
            fontFamily: "monospace",
            fontSize: "0.65rem",
            color: "#4ade80",
            letterSpacing: "0.1em",
            minHeight: 36,
          }}
        >
          <span style={{ color: "#2a2a3e" }}>▸ </span>
          {statusText}
          <Cursor color="#4ade80" />
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, #1e1e2e, transparent)",
          marginBottom: 28,
          zIndex: 2,
        }}
      />

      {/* Contact links */}
      <div style={{ zIndex: 2, flex: 1 }}>
        <div
          className="text-gray-400"
          style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            marginBottom: 16,
          }}
        >
          CONTACT CHANNELS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CONTACT_LINKS.map(({ label, value, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <span
                className="text-gray-400"

                style={{
                  fontFamily: "monospace",
                  fontSize: "0.52rem",
                  letterSpacing: "0.16em",
                }}
              >
                {label}
              </span>
              {href ? (
                <a

                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    color: "#f97316",
                    textDecoration: "none",
                    letterSpacing: "0.03em",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fb923c")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#f97316")}
                >
                  {value}
                </a>
              ) : (
                <span
                  className="text-gray-400"

                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {value}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Response time meter */}
      <div style={{ zIndex: 2, marginTop: 28 }}>
        <div
          className="text-gray-400"

          style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            marginBottom: 10,
          }}
        >
          AVG. RESPONSE TIME
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: 6,
                  height: 14,
                  borderRadius: 2,
                  background: i < 9 ? "#f97316" : "#111",
                }}
                initial={{ scaleY: 0 }}
                animate={visible ? { scaleY: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.25 }}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              fontWeight: 700,
            }}
          >
            &lt;24H
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Form field ────────────────────────────────────────────────────────────────
function Field({ label, prompt, type = "text", value, onChange, placeholder, multiline, error }) {
  const [focused, setFocused] = useState(false);
  const id = `field-${label}`;

  const sharedStyle = {
    width: "100%",
    background: focused ? "#0a0a18" : "#070710",
    color: "#e2e2f0",
    fontSize: "0.82rem",
    fontFamily: "monospace",
    padding: "11px 14px",
    border: `1px solid ${error ? "#ef444466" : focused ? "#f9731688" : "#1a1a28"}`,
    borderRadius: 5,
    outline: "none",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
    boxShadow: focused
      ? `0 0 0 3px ${error ? "#ef444420" : "#f9731620"}`
      : "none",
    letterSpacing: "0.02em",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.58rem",
            color: focused ? "#f97316" : "",
            letterSpacing: "0.18em",
            transition: "color 0.15s",
          }}
        >
          {prompt}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.65rem",
            color: focused ? "#f97316aa" : " ",
            letterSpacing: "0.1em",
            transition: "color 0.15s",
          }}
        >
          {label}
        </span>
        {error && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              color: "#ef4444",
              marginLeft: "auto",
              letterSpacing: "0.08em",
            }}
          >
            {error}
          </span>
        )}
      </div>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...sharedStyle, resize: "none" }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ onReset }) {
  const msg = useTypewriter("TRANSMISSION RECEIVED. I'LL BE IN TOUCH SOON.", 36, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      {/* Animated check ring */}
      <motion.div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          border: "2px solid #4ade80",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M5 13l4 4L19 7"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>
        </motion.div>
        {/* Orbiting dot */}
        <motion.div
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          initial={{ top: -3, left: "50%", marginLeft: -3 }}
        />
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.7rem",
            color: "#4ade80",
            letterSpacing: "0.2em",
          }}
        >
          STATUS: 200 OK
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#888",
            letterSpacing: "0.06em",
            lineHeight: 1.7,
            maxWidth: 320,
          }}
        >
          {msg}
          <Cursor color="#4ade80" />
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          color: "#2a2a3e",
          letterSpacing: "0.18em",
          background: "none",
          border: "1px solid #1a1a28",
          borderRadius: 4,
          padding: "7px 16px",
          cursor: "pointer",
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f97316";
          e.currentTarget.style.borderColor = "#f9731655";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#2a2a3e";
          e.currentTarget.style.borderColor = "#1a1a28";
        }}
      >
        ▸ NEW TRANSMISSION
      </button>
    </motion.div>
  );
}

// ── Main Contact ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [visible, setVisible] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
    if (key === "message") setCharCount(val.length);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "REQUIRED";
    if (!form.email.trim()) e.email = "REQUIRED";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "INVALID";
    if (!form.message.trim()) e.message = "REQUIRED";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    setGlobalError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await submitContact(form);
      if (res.success) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
        setCharCount(0);
      } else {
        setGlobalError(res.message || "TRANSMISSION FAILED");
      }
    } catch {
      setGlobalError("CONNECTION ERROR — RETRY");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full px-4 md:px-8 py-20 flex flex-col items-center"
    >
      <div className="w-full max-w-6xl flex flex-col gap-14">

        {/* ── Heading ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-3">
            ▸ OPEN <span className="text-orange-500">CHANNEL</span>
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              color: "#2a2a3e",
              letterSpacing: "0.18em",
            }}
          >
            ESTABLISH CONNECTION · SEND TRANSMISSION · AWAIT RESPONSE
          </p>
        </motion.div>

        {/* ── Main terminal panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "row",
            border: "1px solid #1a1a28",
            borderRadius: 10,
            overflow: "hidden",
            minHeight: 560,
            position: "relative",
          }}
          className="flex-col lg:flex-row bg-black/30"
        >
          {/* Subtle top gradient line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(90deg, transparent, #f9731644, #f9731622, transparent)",
              zIndex: 10,
            }}
          />

          {/* Left — signal panel */}
          <SignalPanel visible={visible} />

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              flex: 1,
              padding: "32px 36px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              minWidth: 0,
            }}
          >
            {/* Form titlebar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 28,
                paddingBottom: 16,
                borderBottom: "1px solid #111",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f97316",
                  boxShadow: "0 0 8px #f9731688",
                }}
              />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                }}
              >
                NEW TRANSMISSION
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  marginLeft: "auto",
                  letterSpacing: "0.1em",
                }}
              >
                ENCRYPTED · TLS 1.3
              </span>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <SuccessScreen key="success" onReset={() => setSuccess(false)} />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}
                >
                  {/* Name + Email row */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                    }}
                    className="grid-cols-1 md:grid-cols-2"
                  >
                    <Field
                      label="SENDER_NAME"
                      prompt="01 ▸"
                      value={form.name}
                      onChange={set("name")}
                      placeholder="John Doe"
                      error={errors.name}
                    />
                    <Field
                      label="SENDER_EMAIL"
                      prompt="02 ▸"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="john@example.com"
                      error={errors.email}
                    />
                  </div>

                  {/* Message */}
                  <div style={{ flex: 1 }}>
                    <Field
                      label="MESSAGE_BODY"
                      prompt="03 ▸"
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Hey Parves, I'd like to work with you on..."
                      multiline
                      error={errors.message}
                    />
                    {/* Char counter */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 5,
                        fontFamily: "monospace",
                        fontSize: "0.55rem",
                        color: charCount > 800 ? "#f97316" : "#1e1e2e",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {charCount} CHARS
                    </div>
                  </div>

                  {/* Global error */}
                  <AnimatePresence>
                    {globalError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          background: "#ef444412",
                          border: "1px solid #ef444433",
                          borderRadius: 4,
                          fontFamily: "monospace",
                          fontSize: "0.62rem",
                          letterSpacing: "0.08em",
                        }}
                      >
                        <span>✕</span>
                        <span>{globalError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "13px 0",
                      background: loading
                        ? "#1a1a28"
                        : "linear-gradient(135deg, #f97316, #ea580c)",
                      color: loading ? "#333" : "#000",
                      fontFamily: "monospace",
                      fontWeight: 800,
                      fontSize: "0.78rem",
                      letterSpacing: "0.22em",
                      border: loading ? "1px solid #2a2a3e" : "none",
                      borderRadius: 5,
                      cursor: loading ? "not-allowed" : "pointer",
                      position: "relative",
                      overflow: "hidden",
                      transition: "background 0.2s",
                    }}
                  >
                    {/* Shimmer on hover */}
                    {!loading && (
                      <motion.div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "60%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                          skewX: "-20deg",
                        }}
                        animate={{ left: ["−100%", "200%"] }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                      />
                    )}
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          style={{ display: "inline-block", fontSize: "0.85rem" }}
                        >
                          ◌
                        </motion.span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      "▶ SEND TRANSMISSION"
                    )}
                  </motion.button>

                  {/* Footer note */}
                  <div
                    style={{
                      textAlign: "center",
                      fontFamily: "monospace",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    YOUR MESSAGE IS END-TO-END ENCRYPTED · NO SPAM EVER
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}