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
  }, deps);
  return displayed;
}

// ── Components ────────────────────────────────────────────────────────────────
function Cursor({ color = "#f97316" }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 520);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      className="inline-block w-[8px] h-[0.95em] align-middle ml-1 rounded-sm transition-colors duration-75"
      style={{ background: on ? color : "transparent" }}
    />
  );
}

function SignalBars({ color = "#4ade80" }) {
  const heights = [5, 10, 15, 20, 28];
  return (
    <div className="flex items-end gap-1 h-[30px]">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-sm opacity-90"
          style={{ background: color }}
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

function Scanlines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1] rounded-[inherit]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
      }}
    />
  );
}

function SignalPanel({ visible }) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
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
      className="relative flex-[0_0_340px] bg-[#06060f] border-r border-[#1a1a28] flex flex-col overflow-hidden p-8 gap-0"
    >
      <Scanlines />

      {/* Brackets */}
      {[
        { top: 10, left: 10, borderTop: "2px solid #f9731644", borderLeft: "2px solid #f9731644" },
        { top: 10, right: 10, borderTop: "2px solid #f9731644", borderRight: "2px solid #f9731644" },
        { bottom: 10, left: 10, borderBottom: "2px solid #f9731644", borderLeft: "2px solid #f9731644" },
        { bottom: 10, right: 10, borderBottom: "2px solid #f9731644", borderRight: "2px solid #f9731644" },
      ].map((style, i) => (
        <div key={i} className="absolute w-4 h-4 z-[2]" style={style} />
      ))}

      <div className="z-[2] mb-9">
        <div className="text-gray-300 font-mono text-[0.65rem] tracking-[0.2em] mb-1">SYS.CLOCK</div>
        <div className="font-mono text-2xl font-bold text-orange-500 tracking-wider leading-none">
          {time || "00:00:00"}
        </div>
      </div>

      <div className="z-[2] mb-8">
        <div className="text-gray-400 font-mono text-[0.65rem] tracking-[0.2em] mb-3">CONNECTION STATUS</div>
        <div className="flex items-center gap-3 mb-2.5">
          <SignalBars color="#4ade80" />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-[0.8rem] font-bold text-green-400 font-mono">ONLINE</span>
            </div>
            <span className="text-[0.65rem] text-[#2a2a3e] font-mono">PING: 12ms</span>
          </div>
        </div>

        <div className="bg-[#0a0a18] border border-[#1a1a28] rounded p-2.5 font-mono text-[0.72rem] text-green-400 tracking-wide min-h-[40px]">
          <span className="text-[#2a2a3e]">▸ </span>
          {statusText}
          <Cursor color="#4ade80" />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#1e1e2e] to-transparent mb-8 z-[2]" />

      <div className="z-[2] flex-1">
        <div className="text-gray-400 font-mono text-[0.65rem] tracking-[0.2em] mb-4">CONTACT CHANNELS</div>
        <div className="flex flex-col gap-4">
          {CONTACT_LINKS.map(({ label, value, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
              className="flex flex-col gap-0.5"
            >
              <span className="text-gray-400 font-mono text-[0.58rem] tracking-[0.18em]">{label}</span>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="font-mono text-[0.8rem] text-orange-500 hover:text-orange-400 transition-colors tracking-tight"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-400 font-mono text-[0.8rem] tracking-tight">{value}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="z-[2] mt-8">
        <div className="text-gray-400 font-mono text-[0.65rem] tracking-[0.2em] mb-3">AVG. RESPONSE TIME</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-4 rounded-[2px]"
                style={{ background: i < 9 ? "#f97316" : "#111" }}
                initial={{ scaleY: 0 }}
                animate={visible ? { scaleY: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.04, duration: 0.25 }}
              />
            ))}
          </div>
          <span className="font-mono text-[0.72rem] font-bold text-gray-200">&lt;24H</span>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, prompt, type = "text", value, onChange, placeholder, multiline, error }) {
  const [focused, setFocused] = useState(false);
  const id = `field-${label}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-2">
        <span className={`font-mono text-[0.65rem] tracking-[0.2em] transition-colors ${focused ? 'text-orange-500' : 'text-gray-500'}`}>
          {prompt}
        </span>
        <span className={`font-mono text-[0.72rem] tracking-wider transition-colors ${focused ? 'text-orange-400' : 'text-gray-400'}`}>
          {label}
        </span>
        {error && <span className="font-mono text-[0.72rem] text-red-500 ml-auto tracking-wider">{error}</span>}
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
          className={`w-full bg-[#070710] text-[#e2e2f0] font-mono text-[0.9rem] p-3 border rounded-md outline-none transition-all resize-none tracking-tight
            ${focused ? 'bg-[#0a0a18] border-orange-500/50 ring-4 ring-orange-500/10' : 'border-[#1a1a28]'}
            ${error ? 'border-red-500/40 ring-red-500/10' : ''}`}
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
          className={`w-full bg-[#070710] text-[#e2e2f0] font-mono text-[0.9rem] p-3 border rounded-md outline-none transition-all tracking-tight
            ${focused ? 'bg-[#0a0a18] border-orange-500/50 ring-4 ring-orange-500/10' : 'border-[#1a1a28]'}
            ${error ? 'border-red-500/40 ring-red-500/10' : ''}`}
        />
      )}
    </div>
  );
}

function SuccessScreen({ onReset }) {
  const msg = useTypewriter("TRANSMISSION RECEIVED. I'LL BE IN TOUCH SOON.", 36, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-7 py-12 px-6 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full border-2 border-green-400 flex items-center justify-center relative"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
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
        <motion.div
          className="absolute w-1.5 h-1.5 rounded-full bg-green-400 -top-1 left-1/2 -ml-[3px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 43px" }}
        />
      </motion.div>

      <div className="flex flex-col gap-3">
        <div className="font-mono text-[0.8rem] text-green-400 tracking-[0.2em]">STATUS: 200 OK</div>
        <div className="font-mono text-[0.85rem] text-gray-400 tracking-wide leading-relaxed max-w-xs">
          {msg}
          <Cursor color="#4ade80" />
        </div>
      </div>

      <button
        onClick={onReset}
        className="font-mono text-[0.7rem] text-[#2a2a3e] tracking-[0.2em] bg-transparent border border-[#1a1a28] rounded py-2 px-5 hover:text-orange-500 hover:border-orange-500/30 transition-colors"
      >
        ▸ NEW TRANSMISSION
      </button>
    </motion.div>
  );
}

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
    <section id="contact" ref={sectionRef} className="w-full px-4 md:px-8 py-10 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col gap-5">
        
        <div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-black tracking-[0.25em] mb-8">
            ▸ OPEN <span className="text-orange-500">CHANNEL</span>
          </p>
  
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col lg:flex-row bg-black/30 border border-[#1a1a28] rounded-xl overflow-hidden min-h-[600px] relative"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent z-10" />

          <SignalPanel visible={visible} />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 p-9 md:p-11 flex flex-col relative min-w-0"
          >
            <div className="flex items-center gap-3 mb-8 pb-5 border-b border-[#111]">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_#f9731688]" />
              <span className="font-mono text-[0.72rem] tracking-[0.2em] uppercase text-gray-300">NEW TRANSMISSION</span>
              <span className="font-mono text-[0.72rem] ml-auto tracking-widest text-gray-600">ENCRYPTED · TLS 1.3</span>
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
                  className="flex flex-col gap-6 flex-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                  <div className="flex-1 flex flex-col">
                    <Field
                      label="MESSAGE_BODY"
                      prompt="03 ▸"
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Hey Parves, I'd like to work with you on..."
                      multiline
                      error={errors.message}
                    />
                    <div className={`flex justify-end mt-2 font-mono text-[0.62rem] tracking-wider transition-colors ${charCount > 800 ? "text-orange-500" : "text-[#1e1e2e]"}`}>
                      {charCount} CHARS
                    </div>
                  </div>

                  <AnimatePresence>
                    {globalError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2.5 p-2.5 bg-red-500/10 border border-red-500/20 rounded font-mono text-[0.7rem] tracking-wide text-red-400"
                      >
                        <span>✕</span>
                        <span>{globalError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-md font-mono font-black text-[0.85rem] tracking-[0.25em] uppercase transition-all relative overflow-hidden
                      ${loading ? 'bg-[#1a1a28] text-gray-500 cursor-not-allowed' : 'bg-gradient-to-br from-orange-500 to-orange-700 text-black hover:brightness-110'}`}
                  >
                    {!loading && (
                      <motion.div
                        className="absolute top-0 w-3/5 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[20deg]"
                        animate={{ left: ["-100%", "200%"] }}
                        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                      />
                    )}
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          className="text-lg"
                        >
                          ◌
                        </motion.span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      "▶ SEND TRANSMISSION"
                    )}
                  </motion.button>

                  <div className="text-center font-mono text-[0.62rem] tracking-widest text-[#2a2a3e] uppercase">
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