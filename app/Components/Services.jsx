"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "fullstack",
    index: "01",
    label: "Full-Stack Development",
    tag: "MERN STACK",
    accent: "#be29ec",
    shortDesc: "End-to-end web apps. Database to UI.",
    desc: "Complete web applications built from scratch — React or Next.js on the front, Node + Express on the back, MongoDB for data. I own the whole stack so nothing gets lost between layers.",
    perks: ["REST API Design", "JWT Auth", "Server Components", "DB Modeling"],
    stat: { label: "Stack Coverage", value: "100%" },
  },
  {
    id: "frontend",
    index: "02",
    label: "UI / Frontend Engineering",
    tag: "REACT · NEXT.JS",
    accent: "#ff4d01",
    shortDesc: "Pixel-perfect interfaces. Smooth motion.",
    desc: "Interfaces that feel as good as they look. Tailwind for precision layout, Framer Motion for fluid animation, and obsessive attention to performance and responsiveness across every screen.",
    perks: ["Responsive Design", "Framer Motion", "Dark Mode", "Core Web Vitals"],
    stat: { label: "Lighthouse Score", value: "98+" },
  },
  {
    id: "backend",
    index: "03",
    label: "Backend & API Architecture",
    tag: "NODE · EXPRESS",
    accent: "#700e01",
    shortDesc: "Scalable APIs. Clean architecture.",
    desc: "Production-grade REST APIs with proper structure — controllers, middleware, error handling, rate limiting. Built to scale and easy for other devs to pick up and extend.",
    perks: ["REST APIs", "Middleware Chains", "File Uploads", "Rate Limiting"],
    stat: { label: "API Reliability", value: "99.9%" },
  },
  {
    id: "database",
    index: "04",
    label: "Database Design",
    tag: "MONGODB · ATLAS",
    accent: "#319246",
    shortDesc: "Schemas that scale. Data that performs.",
    desc: "MongoDB schema design with Mongoose, indexing strategies, aggregation pipelines, and Atlas cloud deployment. Your data layer built right from day one — no painful migrations later.",
    perks: ["Schema Design", "Aggregations", "Atlas Cloud", "Mongoose ODM"],
    stat: { label: "Query Optimised", value: "Yes" },
  },
  {
    id: "deploy",
    index: "05",
    label: "Deployment & DevOps",
    tag: "VERCEL · RENDER",
    accent: "#eb7d31",
    shortDesc: "Ship fast. Stay live. Zero downtime.",
    desc: "From local to production — CI/CD pipelines, environment variable management, domain configuration and SSL. Apps deployed on Vercel, Railway, and Render with automatic preview builds.",
    perks: ["CI/CD Pipelines", "Preview Deploys", "Env Management", "Domain Config"],
    stat: { label: "Deploy Time", value: "<2 min" },
  },
  {
    id: "freelance",
    index: "06",
    label: "Freelance Projects",
    tag: "HIRE ME",
    accent: "#a78bfa",
    shortDesc: "Fixed price. Fast delivery. Clean code.",
    desc: "Open for freelance work — portfolio sites, SaaS MVPs, admin dashboards, landing pages. You get a fixed quote upfront, clear milestones, revision rounds, and full source code on delivery.",
    perks: ["Fixed Pricing", "Fast Turnaround", "Revision Rounds", "Full Source"],
    stat: { label: "Availability", value: "Open" },
  },
];

// ── Blinking cursor ───────────────────────────────────────────────────────────
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: "1em",
        background: on ? "#f97316" : "transparent",
        marginLeft: 2,
        verticalAlign: "middle",
        borderRadius: 1,
      }}
    />
  );
}

// ── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({ service }) {
  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ height: "100%" }}
    >
      {/* Top accent bar */}
      <div
        className=" h-1 mb-4"
        style={{
          background: `linear-gradient(90deg, ${service.accent}, transparent)`,
        }}
      />

      {/* Index + label */}
      <div className="mb-3" >
        <div
          className="mx-4"
          style={{
            fontSize: "0.8rem",
            letterSpacing: "0.22em",
            color: service.accent,
            marginBottom: 6,
            fontFamily: "monospace",
          }}
        >
          SERVICE_{service.index}
        </div>
        <h3
          className="mx-4"
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {service.label}
        </h3>
        <span
          className="mx-4"
          style={{
            display: "inline-block",
            marginTop: 8,
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: service.accent,
            background: `${service.accent}18`,
            border: `1px solid ${service.accent}44`,
            borderRadius: 3,
            padding: "2px 8px",
          }}
        >
          {service.tag}
        </span>
      </div>

      {/* Description */}
      <p
        className="mx-4"
        style={{
          fontSize: "0.82rem",
          lineHeight: 1.75,
          marginBottom: 28,
          borderLeft: `2px solid ${service.accent}44`,
          paddingLeft: 14,
        }}
      >
        {service.desc}
      </p>

      {/* Capabilities list */}
      <div className="mb-5 mx-4">
        <div
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            color: "#444",
            marginBottom: 12,
            fontFamily: "monospace",
          }}
        >
          CAPABILITIES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {service.perks.map((perk, i) => (
            <motion.div
              key={perk}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <span style={{ color: service.accent, fontFamily: "monospace", fontSize: "0.7rem" }}>
                ▸
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                {perk}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stat pill */}
      <div
        className="mx-4"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          background: `${service.accent}10`,
          border: `1px solid ${service.accent}30`,
          borderRadius: 6,
          padding: "10px 16px",
        }}
      >
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.14em", color: "#555", fontFamily: "monospace" }}>
          {service.stat.label}
        </span>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: service.accent }}>
          {service.stat.value}
        </span>
      </div>
    </motion.div>
  );
}

// ── Service row ───────────────────────────────────────────────────────────────
function ServiceRow({ service, isActive, onClick, visible, delay }) {
  const [hovered, setHovered] = useState(false);
  const highlighted = isActive || hovered;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 20px",
        cursor: "pointer",
        borderBottom: "1px solid #111",
        background: isActive
          ? `${service.accent}0c`
          : hovered
            ? "#0d0d1a"
            : "transparent",
        borderLeft: `3px solid ${isActive ? service.accent : "transparent"}`,
        transition: "background 0.15s ease, border-color 0.15s ease",
        position: "relative",
      }}
    >
      {/* Index */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.62rem",
          color: highlighted ? service.accent : "#2a2a3a",
          width: 22,
          flexShrink: 0,
          transition: "color 0.15s",
        }}
      >
        {service.index}
      </span>

      {/* Label + short desc */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "0.82rem",
            fontWeight: 700,
            color: highlighted ? "#fff" : "#666",
            letterSpacing: "0.04em",
            transition: "color 0.15s",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {service.label}
        </div>
        <div
          style={{
            fontSize: "0.62rem",
            color: highlighted ? "#555" : "#2a2a3a",
            marginTop: 2,
            fontFamily: "monospace",
            transition: "color 0.15s",
          }}
        >
          {service.shortDesc}
        </div>
      </div>

      {/* Tag badge */}
      <span
        style={{
          fontSize: "0.52rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: highlighted ? service.accent : "#2a2a3a",
          border: `1px solid ${highlighted ? service.accent + "55" : "#1a1a2a"}`,
          borderRadius: 3,
          padding: "2px 7px",
          flexShrink: 0,
          fontFamily: "monospace",
          transition: "color 0.15s, border-color 0.15s",
        }}
      >
        {service.tag}
      </span>

      {/* Arrow */}
      <span
        style={{
          color: service.accent,
          fontSize: "0.65rem",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.15s",
          flexShrink: 0,
        }}
      >
        ▶
      </span>
    </motion.div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Services() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
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

  // autoplay refs
  const autoPlayRef = useRef(null);
  const resumeRef = useRef(null);
  const AUTO_DELAY = 4000;

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

  // autoplay logic
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [active]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SERVICES.length);
    }, AUTO_DELAY);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleManualSelect = (index) => {
    stopAutoPlay();
    setActive(index);

    if (resumeRef.current) clearTimeout(resumeRef.current);

    resumeRef.current = setTimeout(() => {
      startAutoPlay();
    }, 6000);
  };

  useEffect(() => {
    return () => {
      stopAutoPlay();
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  const selected = SERVICES[active];
  return (
    <section

      id="services"
      ref={sectionRef}
      className="w-full px-4 md:px-8 py-20 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-14">

        {/* ── Heading ── */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest text-center">
            ▸ WHAT I <span className="text-orange-500">BUILD</span>
          </p>
          {/* Terminal prompt line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              fontFamily: "monospace",
              fontSize: "0.72rem",
              color: "#333",
            }}
          >
            <span style={{ color: "#4ade80" }}>~/portfolio</span>
            <span style={{ color: "#555" }}>$</span>
            <span style={{ color: "#888" }}>ls services/</span>
            <Cursor />
          </div>
        </motion.div>

        {/* ── Main panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col backdrop-blur-[12px] border border-[#1a1a2a] rounded-lg overflow-hidden min-h-[480px] shadow-2xl"
        >

          {/* ── TOP BAR (SHARED) ── */}
          <div className="flex items-center gap-2 px-5 py-[10px] border-b border-[#111] bg-[#05050f]">
            <div className="flex gap-1.5">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div key={c} className="w-[10px] h-[10px] rounded-full opacity-70" style={{ background: c }} />
              ))}
            </div>
            <span className="ml-2 font-mono text-[0.6rem] tracking-[0.1em] text-[#2a2a3a]">
              services.config.js
            </span>
          </div>

          {/* ── BODY (LEFT + RIGHT) ── */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">

            {/* LEFT */}
            <div className="w-full lg:max-w-[420px] flex flex-col border-r border-[#111]">

              {/* Rows */}
              <div className="flex-1 overflow-y-auto">
                {SERVICES.map((service, i) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    isActive={active === i}
                    onClick={() => setActive(i)}
                    visible={visible}
                    delay={0.1 + i * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex flex-col flex-1 min-w-0 relative">

              {/* File title */}
              <div className="mx-4 py-2 flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.1em] text-[#2a2a3a] ">
                <span className="text-[#1a1a2a]">▸</span>
                <span>{selected.id}.md</span>
                <span className="ml-auto" style={{ color: selected.accent }}>
                  {selected.index}/{SERVICES.length}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto relative">
                <AnimatePresence mode="wait">
                  <DetailPanel key={selected.id} service={selected} />
                </AnimatePresence>

                {/* Dot grid */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-35"
                  style={{
                    backgroundImage: "radial-gradient(circle, #1a1a2a 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR (SHARED) ── */}
          <div className="flex items-center gap-4 px-5 py-[7px] border-t border-[#111] bg-[#05050f] font-mono text-[0.55rem]">
            <span style={{ color: selected.accent }} className="opacity-80">●</span>
            <span>{SERVICES.length} services</span>
            <span className="ml-auto">UTF-8</span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}