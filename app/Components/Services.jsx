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
      className="inline-block w-2 align-middle ml-[2px] rounded-[1px]"
      style={{
        height: "1em",
        background: on ? "#f97316" : "transparent",
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
      className="h-full"
    >
      {/* Top accent bar — dynamic color kept via style */}
      <div
        className="h-1 mb-4"
        style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }}
      />

      {/* Index */}
      <p
        className="mx-4 mb-1.5 font-mono tracking-[0.22em]"
        style={{ fontSize: "0.88rem", color: service.accent }}
      >
        SERVICE_{service.index}
      </p>

      {/* Label */}
      <h3 className="mx-4 text-[1.49rem] font-extrabold tracking-tight leading-tight">
        {service.label}
      </h3>

      {/* Tag badge — dynamic bg/border kept via style */}
      <span
        className="mx-4 mt-2 inline-block font-mono font-bold tracking-[0.18em] rounded-[3px] px-2 py-[2px]"
        style={{
          fontSize: "0.75rem",
          color: service.accent,
          background: `${service.accent}18`,
          border: `1px solid ${service.accent}44`,
        }}
      >
        {service.tag}
      </span>

      {/* Description — dynamic border-left kept via style */}
      <p
        className="mx-4 mt-4 mb-7 text-[0.9rem] leading-[1.75] pl-3.5"
        style={{ borderLeft: `2px solid ${service.accent}44` }}
      >
        {service.desc}
      </p>

      {/* Capabilities */}
      <div className="mb-5 mx-4">
        <p className="font-mono tracking-[0.18em] text-[#444] mb-3" style={{ fontSize: "0.64rem" }}>
          CAPABILITIES
        </p>
        <div className="flex flex-col gap-2">
          {service.perks.map((perk, i) => (
            <motion.div
              key={perk}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              <span
                className="font-mono text-[0.77rem]"
                style={{ color: service.accent }}
              >
                ▸
              </span>
              <span className="text-[0.83rem] font-semibold tracking-[0.04em]">
                {perk}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stat pill — dynamic colors kept via style */}
      <div
        className="mx-4 inline-flex items-center gap-3 rounded-md px-4 py-2.5"
        style={{
          background: `${service.accent}30`,
          border: `1px solid ${service.accent}30`,
        }}
      >
        <span
          className="font-mono tracking-[0.14em] text-[#555]"
          style={{ fontSize: "0.66rem" }}
        >
          {service.stat.label}
        </span>
        <span
          className="text-[1.1rem] font-extrabold"
          style={{ color: service.accent }}
        >
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
      className="flex items-center gap-4 px-5 py-3.5 cursor-pointer border-b border-[#111] relative transition-[background,border-color] duration-150"
      style={{
        background: isActive ? `${service.accent}0c` : hovered ? "#0d0d1a" : "black/10",
        borderLeft: `3px solid ${isActive ? service.accent : "transparent"}`,
      }}
    >
      {/* Index */}
      <span
        className="font-mono w-[22px] shrink-0 transition-colors duration-150"
        style={{
          fontSize: "0.68rem",
          color: highlighted ? service.accent : "#2a2a3a",
        }}
      >
        {service.index}
      </span>

      {/* Label + short desc */}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold tracking-[0.04em] truncate transition-colors duration-150"
          style={{
            fontSize: "0.9rem",
            color: highlighted ? "#fff" : "#666",
          }}
        >
          {service.label}
        </p>
        <p
          className="font-mono mt-0.5 transition-colors duration-150"
          style={{
            fontSize: "0.68rem",
            color: highlighted ? "#555" : "#2a2a3a",
          }}
        >
          {service.shortDesc}
        </p>
      </div>

      {/* Tag badge */}
      <span
        className="font-mono font-bold shrink-0 rounded-[3px] px-[7px] py-[2px] transition-[color,border-color] duration-150"
        style={{
          fontSize: "0.57rem",
          letterSpacing: "0.14em",
          color: highlighted ? service.accent : "#2a2a3a",
          border: `1px solid ${highlighted ? service.accent + "55" : "#1a1a2a"}`,
        }}
      >
        {service.tag}
      </span>

      {/* Active arrow */}
      <span
        className="shrink-0 text-[0.72rem] transition-opacity duration-150"
        style={{
          color: service.accent,
          opacity: isActive ? 1 : 0,
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
  const autoPlayRef = useRef(null);
  const resumeRef = useRef(null);
  const AUTO_DELAY = 4000;

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay
  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SERVICES.length);
    }, AUTO_DELAY);
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [active]); // eslint-disable-line

  const handleManualSelect = (index) => {
    stopAutoPlay();
    setActive(index);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => startAutoPlay(), 6000);
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
      className="w-full px-4 md:px-8 py-20 flex justify-center"
    >
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

          {/* Terminal prompt */}
          <div className="flex items-center justify-center gap-2 font-mono text-[0.79rem] text-[#333]">
            <span className="text-[#4ade80]">~/portfolio</span>
            <span className="text-[#555]">$</span>
            <span className="text-[#888]">ls services/</span>
            <Cursor />
          </div>
        </motion.div>

        {/* ── Main panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col backdrop-blur-sm border border-[#1a1a2a] rounded-lg overflow-hidden min-h-[480px] shadow-2xl "
        >
          {/* Top bar */}
          <div className="flex items-center gap-2 px-5 py-[10px] border-b border-[#111] bg-[#05050f]">
            <div className="flex gap-1.5">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  className="w-[10px] h-[10px] rounded-full opacity-70"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span className="ml-2 font-mono text-[0.66rem] tracking-[0.1em] text-[#2a2a3a]">
              services.config.js
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">

            {/* Left — service list */}
            <div className="w-full lg:max-w-[420px] flex flex-col border-r border-[#111]">
              <div className="flex-1 overflow-y-auto">
                {SERVICES.map((service, i) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    isActive={active === i}
                    onClick={() => handleManualSelect(i)}
                    visible={visible}
                    delay={0.1 + i * 0.06}
                  />
                ))}
              </div>
            </div>

            {/* Right — detail view */}
            <div className="hidden md:flex flex-col flex-1 min-w-0 relative">

              {/* File path bar */}
              <div
                className="mx-4 py-2 flex items-center gap-2 font-mono tracking-[0.1em] text-[#2a2a3a]"
                style={{ fontSize: "0.75rem" }}
              >
                <span className="text-[#1a1a2a]">▸</span>
                <span>{selected.id}.md</span>
                <span className="ml-auto" style={{ color: selected.accent }}>
                  {selected.index}/{SERVICES.length}
                </span>
              </div>

              {/* Detail content */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <DetailPanel key={selected.id} service={selected} />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center gap-4 px-5 py-[7px] border-t border-[#111] bg-[#05050f] font-mono text-[0.61rem]">
            <span className="opacity-80" style={{ color: selected.accent }}>●</span>
            <span>{SERVICES.length} services</span>
            <span className="ml-auto">UTF-8</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}