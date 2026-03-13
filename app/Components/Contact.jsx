"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContact } from "@/lib/api";

// ── Pixel Input ───────────────────────────────────────────────────────────────
function PixelInput({ label, type = "text", value, onChange, placeholder, multiline }) {
  const [focused, setFocused] = useState(false);
  const baseClass = `
    w-full bg-[#0a0a14] text-gray-300 text-sm font-bold
    px-4 py-3 rounded-sm outline-none
    border-[2px] transition-all duration-150
    placeholder:text-gray-700 placeholder:font-normal
    ${focused ? "border-orange-500" : "border-[#1e1e2e]"}
  `;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.75rem] font-black tracking-[0.2em] text-gray-500">
        ── {label} ──
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClass} resize-none`}
          style={{
            boxShadow: focused ? "3px 3px 0 #f97316" : "3px 3px 0 #111",
          }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={baseClass}
          style={{
            boxShadow: focused ? "3px 3px 0 #f97316" : "3px 3px 0 #111",
          }}
        />
      )}
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ onReset }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-6 py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pixel checkmark */}
      <div
        className="w-20 h-20 bg-[#0a0a14] border-[3px] border-green-500 rounded-sm
                   flex items-center justify-center"
        style={{ boxShadow: "4px 4px 0 #111, 6px 6px 0 #4ade8044" }}
      >
        <svg width="40" height="40" viewBox="0 0 10 10" style={{ imageRendering: "pixelated" }}>
          <rect x="1" y="5" width="2" height="2" fill="#4ade80" />
          <rect x="3" y="7" width="2" height="2" fill="#4ade80" />
          <rect x="5" y="5" width="2" height="2" fill="#4ade80" />
          <rect x="7" y="3" width="2" height="2" fill="#4ade80" />
          <rect x="9" y="1" width="2" height="2" fill="#4ade80" />
        </svg>
      </div>

      <div className="text-center flex flex-col gap-2">
        <p className="text-green-400 font-black text-lg tracking-widest">
          MESSAGE SENT!
        </p>
        <p className="text-gray-500 text-[0.75rem] font-bold tracking-wide">
          I'll get back to you as soon as possible.
        </p>
      </div>

      {/* Pixel divider */}
      <div style={{
        height: 3, width: "100%",
        background: "repeating-linear-gradient(90deg, #1e1e2e 0px, #1e1e2e 10px, transparent 10px, transparent 14px)"
      }} />

      <button
        onClick={onReset}
        className="text-[0.65rem] font-black tracking-[0.2em] text-gray-600
                   hover:text-orange-400 transition-colors"
      >
        ▶ SEND ANOTHER MESSAGE
      </button>
    </motion.div>
  );
}

// ── Main Contact ──────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");
  const [pressed, setPressed]   = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("ALL FIELDS REQUIRED");
      return;
    }
    if (!form.email.includes("@")) {
      setError("INVALID EMAIL ADDRESS");
      return;
    }

    setLoading(true);
    try {
      const res = await submitContact(form);
      if (res.success) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(res.message || "SOMETHING WENT WRONG");
      }
    } catch (err) {
      setError("FAILED TO SEND — TRY AGAIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="w-full px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-12">

        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
            ▸ SEND A <span className="text-orange-500">MESSAGE</span>
          </p>
          <p className="text-gray-500 text-sm tracking-wide">
            OPEN FOR WORK  ·  COLLABORATIONS  ·  JUST SAYING HI
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="w-full flex flex-col gap-8">

          {/* Left — info panel */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Status */}
            <div
              className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm px-4 py-4"
              style={{ boxShadow: "4px 4px 0 #111, 6px 6px 0 #f9731633" }}
            >
              <p className="text-[0.75rem] font-black tracking-[0.2em] text-gray-500 mb-3">
                ── CURRENT STATUS ──
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-black tracking-widest">
                  AVAILABLE FOR HIRE
                </span>
              </div>
              <p className="text-[0.875rem] font-bold text-gray-500 leading-relaxed">
                Currently open to full-time roles, freelance projects,
                and interesting collaborations.
              </p>
            </div>

            {/* Quick info */}
            {/* <div
              className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm px-4 py-4"
              style={{ boxShadow: "3px 3px 0 #111" }}
            >
              <p className="text-[0.65rem] font-black tracking-[0.2em] text-gray-600 mb-3">
                ── CONTACT INFO ──
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "EMAIL",    value: "mdperrfan@gmail.com", href: "mailto:mdperrfan@gmail.com" },
                  { label: "GITHUB",   value: "github.com/MDPerrfan",   href: "https://github.com/MDPerrfan" },
                  { label: "LINKEDIN", value: "in/mdperrfan",           href: "https://linkedin.com/in/mdperrfan" },
                  { label: "LOCATION", value: "Chittagong, Bangladesh",  href: null },
                ].map(({ label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-[0.6rem] font-black tracking-widest text-gray-600 w-20 flex-shrink-0 pt-0.5">
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.75rem] font-bold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-[0.75rem] font-bold text-gray-400">{value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div> */}

            {/* Response time */}
            <div
              className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm px-4 py-3"
              style={{ boxShadow: "3px 3px 0 #111" }}
            >
              <p className="text-[0.75rem] font-black tracking-[0.2em] text-gray-500 mb-2">
                ── RESPONSE TIME ──
              </p>
              <div className="flex items-center gap-3">
                {/* XP bar style response meter */}
                <div className="flex gap-[2px]">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-[8px] rounded-sm"
                      style={{ background: i < 8 ? "#f97316" : "#2a2a3a" }}
                    />
                  ))}
                </div>
                <span className="text-[0.7rem] font-black text-orange-500">
                  FAST
                </span>
              </div>
              <p className="text-[0.70rem] text-gray-500 font-bold mt-1">
                Usually within 24 hours
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm p-6"
            style={{ boxShadow: "4px 4px 0 #111, 6px 6px 0 #f9731633" }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Card header */}
            <div
              className="flex items-center gap-2 pb-4 mb-4 border-b-[2px]"
              style={{
                borderColor: "#f97316",
                background: "transparent",
              }}
            >
              <span className="text-sm font-black tracking-[0.2em] text-orange-500">
                NEW MESSAGE
              </span>
              <div className="ml-auto flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-sm"
                    style={{ background: "#f97316", opacity: 0.4 + i * 0.2 }}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <SuccessScreen onReset={() => setSuccess(false)} />
              ) : (
                <motion.div
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PixelInput
                    label="YOUR NAME"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="John Doe"
                  />
                  <PixelInput
                    label="YOUR EMAIL"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="john@example.com"
                  />
                  <PixelInput
                    label="MESSAGE"
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Hey Parves, I'd love to work with you on..."
                    multiline
                  />

                  {/* Error */}
                  {error && (
                    <motion.p
                      className="text-[0.65rem] font-black tracking-widest text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ✕ {error}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    onMouseDown={() => setPressed(true)}
                    onMouseUp={() => setPressed(false)}
                    onMouseLeave={() => setPressed(false)}
                    className="w-full py-3 font-black text-sm tracking-[0.2em]
                               text-white rounded-sm transition-all duration-150
                               disabled:opacity-50"
                    style={{
                      background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 10px, #c2410c 10px, #c2410c 14px)",
                      boxShadow: pressed ? "1px 1px 0 #111" : "4px 4px 0 #111",
                      transform: pressed ? "translate(3px, 3px)" : "translate(0,0)",
                    }}
                  >
                    {loading ? "SENDING..." : "▶ SEND MESSAGE"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}