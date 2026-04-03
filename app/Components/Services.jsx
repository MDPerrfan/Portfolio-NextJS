"use client";

import { useState, useRef, useEffect } from "react";

// ── Service data ──────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "fullstack",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="1" y="1" width="14" height="10" fill="#1a6fff" />
        <rect x="2" y="2" width="12" height="8"  fill="#0a0a14" />
        <rect x="3" y="3" width="3"  height="1"  fill="#f97316" />
        <rect x="3" y="5" width="5"  height="1"  fill="#4ade80" />
        <rect x="3" y="7" width="4"  height="1"  fill="#f97316" />
        <rect x="8" y="3" width="4"  height="1"  fill="#7DD3FC" />
        <rect x="9" y="5" width="3"  height="1"  fill="#7DD3FC" />
        <rect x="5" y="12" width="6" height="1"  fill="#1a6fff" />
        <rect x="3" y="13" width="10" height="2" fill="#1a6fff" />
      </svg>
    ),
    label: "FULL-STACK DEV",
    tag: "MERN STACK",
    tagColor: "#f97316",
    desc: "End-to-end web applications from database to UI. React, Next.js, Node.js, Express, MongoDB — the full chain.",
    perks: ["REST API Design", "Auth & JWT", "Server Components", "DB Modeling"],
  },
  {
    id: "frontend",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="0" y="4"  width="4"  height="4"  fill="#f97316" />
        <rect x="1" y="5"  width="2"  height="2"  fill="#c2410c" />
        <rect x="6" y="2"  width="4"  height="4"  fill="#7DD3FC" />
        <rect x="7" y="3"  width="2"  height="2"  fill="#0ea5e9" />
        <rect x="4" y="8"  width="4"  height="4"  fill="#4ade80" />
        <rect x="5" y="9"  width="2"  height="2"  fill="#16a34a" />
        <rect x="10" y="6" width="4"  height="4"  fill="#f5e642" />
        <rect x="11" y="7" width="2"  height="2"  fill="#ca8a04" />
        <rect x="4"  y="4" width="1"  height="1"  fill="#f97316" opacity="0.5" />
        <rect x="9"  y="1" width="1"  height="1"  fill="#7DD3FC" opacity="0.5" />
      </svg>
    ),
    label: "UI / FRONTEND",
    tag: "REACT · NEXT.JS",
    tagColor: "#7DD3FC",
    desc: "Pixel-perfect, responsive interfaces with smooth animations. Tailwind CSS, Framer Motion, and GSAP in my toolkit.",
    perks: ["Responsive Design", "Animations", "Dark Mode", "Performance"],
  },
  {
    id: "backend",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="2"  y="1"  width="12" height="3"  fill="#333"    />
        <rect x="3"  y="2"  width="2"  height="1"  fill="#4ade80" />
        <rect x="6"  y="2"  width="5"  height="1"  fill="#1e1e2e" />
        <rect x="2"  y="6"  width="12" height="3"  fill="#333"    />
        <rect x="3"  y="7"  width="2"  height="1"  fill="#f97316" />
        <rect x="6"  y="7"  width="5"  height="1"  fill="#1e1e2e" />
        <rect x="2"  y="11" width="12" height="3"  fill="#333"    />
        <rect x="3"  y="12" width="2"  height="1"  fill="#7DD3FC" />
        <rect x="6"  y="12" width="5"  height="1"  fill="#1e1e2e" />
        <rect x="13" y="2"  width="1"  height="1"  fill="#4ade80" />
        <rect x="13" y="7"  width="1"  height="1"  fill="#f97316" />
        <rect x="13" y="12" width="1"  height="1"  fill="#7DD3FC" />
      </svg>
    ),
    label: "BACKEND / API",
    tag: "NODE · EXPRESS",
    tagColor: "#4ade80",
    desc: "Scalable REST APIs, authentication systems, and server-side logic. Clean architecture, proper error handling.",
    perks: ["REST APIs", "Middleware", "File Uploads", "Rate Limiting"],
  },
  {
    id: "database",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="3" y="2"  width="10" height="3"  fill="#4ade80" />
        <rect x="2" y="3"  width="12" height="1"  fill="#16a34a" />
        <rect x="3" y="7"  width="10" height="3"  fill="#4ade80" />
        <rect x="2" y="8"  width="12" height="1"  fill="#16a34a" />
        <rect x="3" y="12" width="10" height="3"  fill="#4ade80" />
        <rect x="2" y="13" width="12" height="1"  fill="#16a34a" />
        <rect x="2" y="5"  width="1"  height="2"  fill="#4ade80" />
        <rect x="13" y="5" width="1"  height="2"  fill="#4ade80" />
        <rect x="2" y="10" width="1"  height="2"  fill="#4ade80" />
        <rect x="13" y="10" width="1" height="2"  fill="#4ade80" />
        <rect x="5" y="3"  width="2"  height="1"  fill="#fff" opacity="0.4" />
        <rect x="5" y="8"  width="2"  height="1"  fill="#fff" opacity="0.4" />
      </svg>
    ),
    label: "DATABASE",
    tag: "MONGODB",
    tagColor: "#4ade80",
    desc: "Schema design, indexing, aggregation pipelines, and cloud deployment via MongoDB Atlas. Data that scales.",
    perks: ["Schema Design", "Aggregations", "Atlas Cloud", "Mongoose ODM"],
  },
  {
    id: "deploy",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="6"  y="0"  width="4"  height="2"  fill="#f97316" />
        <rect x="5"  y="2"  width="6"  height="2"  fill="#f97316" />
        <rect x="4"  y="4"  width="8"  height="5"  fill="#DDDDE8" />
        <rect x="6"  y="5"  width="4"  height="3"  fill="#7DD3FC" />
        <rect x="6"  y="5"  width="2"  height="1"  fill="#fff" opacity="0.6" />
        <rect x="3"  y="7"  width="2"  height="2"  fill="#f97316" />
        <rect x="11" y="7"  width="2"  height="2"  fill="#f97316" />
        <rect x="4"  y="9"  width="8"  height="1"  fill="#AAAAB8" />
        <rect x="5"  y="10" width="6"  height="3"  fill="#f5e642" opacity="0.8" />
        <rect x="6"  y="10" width="4"  height="2"  fill="#FF8C00" opacity="0.9" />
      </svg>
    ),
    label: "DEPLOYMENT",
    tag: "VERCEL · CLOUD",
    tagColor: "#f5e642",
    desc: "CI/CD pipelines, environment management, domain config. Apps deployed on Vercel, Railway, and Render.",
    perks: ["Vercel Deploy", "CI/CD", "Env Secrets", "Domain Config"],
  },
  {
    id: "freelance",
    icon: (
      <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
        <rect x="2"  y="2"  width="5"  height="5"  fill="#f5e642" />
        <rect x="3"  y="3"  width="3"  height="3"  fill="#ca8a04" />
        <rect x="9"  y="2"  width="5"  height="5"  fill="#f97316" />
        <rect x="10" y="3"  width="3"  height="3"  fill="#c2410c" />
        <rect x="2"  y="9"  width="5"  height="5"  fill="#7DD3FC" />
        <rect x="3"  y="10" width="3"  height="3"  fill="#0ea5e9" />
        <rect x="9"  y="9"  width="5"  height="5"  fill="#4ade80" />
        <rect x="10" y="10" width="3"  height="3"  fill="#16a34a" />
        <rect x="7"  y="7"  width="2"  height="2"  fill="#f97316" />
      </svg>
    ),
    label: "FREELANCE",
    tag: "HIRE ME",
    tagColor: "#f5e642",
    desc: "Open for freelance projects. Portfolio sites, SaaS MVPs, admin dashboards — delivered clean and on time.",
    perks: ["Fixed Price", "Fast Delivery", "Revision Rounds", "Source Code"],
  },
];

// ── Pixel coin SVG ────────────────────────────────────────────────────────────
function PixelCoin() {
  return (
    <svg width="10" height="10" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="0" width="4" height="1" fill="#f5e642" />
      <rect x="1" y="1" width="6" height="1" fill="#f5e642" />
      <rect x="0" y="2" width="8" height="4" fill="#f5e642" />
      <rect x="1" y="6" width="6" height="1" fill="#f5e642" />
      <rect x="2" y="7" width="4" height="1" fill="#f5e642" />
    </svg>
  );
}

// ── Single service card ───────────────────────────────────────────────────────
function ServiceCard({ service, index, visible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col gap-3 p-5 rounded-sm cursor-default transition-all duration-150"
      style={{
        background: "#0a0a14",
        border: hovered ? `3px solid ${service.tagColor}` : "3px solid #1e1e2e",
        boxShadow: hovered
          ? `5px 5px 0 #111, 7px 7px 0 ${service.tagColor}55`
          : "4px 4px 0 #111",
        transform: visible
          ? hovered ? "translate(-2px,-2px)" : "translate(0,0)"
          : "translateY(32px)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, opacity 0.4s ease ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-sm"
        style={{
          background: hovered
            ? `repeating-linear-gradient(90deg, ${service.tagColor} 0px, ${service.tagColor} 6px, transparent 6px, transparent 10px)`
            : "repeating-linear-gradient(90deg, #1e1e2e 0px, #1e1e2e 6px, transparent 6px, transparent 10px)",
          transition: "background 0.2s ease",
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="flex items-center gap-3">
          {/* Icon box */}
          <div
            className="flex items-center justify-center w-12 h-12 rounded-sm flex-shrink-0"
            style={{
              background: "#0e0e1a",
              border: "2px solid #1e1e2e",
              boxShadow: "2px 2px 0 #111",
            }}
          >
            {service.icon}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white font-black text-sm tracking-widest">
              {service.label}
            </span>
            <span
              className="text-[0.58rem] font-black tracking-[0.18em] px-2 py-0.5 rounded-sm w-fit"
              style={{
                color: service.tagColor,
                background: `${service.tagColor}18`,
                border: `1px solid ${service.tagColor}44`,
              }}
            >
              {service.tag}
            </span>
          </div>
        </div>

        {/* Hover arrow */}
        <span
          className="text-orange-500 text-xs font-black mt-1 flex-shrink-0 transition-opacity duration-150"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          ▶
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-[0.75rem] font-bold leading-relaxed">
        {service.desc}
      </p>

      {/* Pixel divider */}
      <div
        style={{
          height: 2,
          background:
            "repeating-linear-gradient(90deg, #1e1e2e 0px, #1e1e2e 6px, transparent 6px, transparent 10px)",
        }}
      />

      {/* Perks */}
      <div className="flex flex-wrap gap-2">
        {service.perks.map((perk) => (
          <div key={perk} className="flex items-center gap-1.5">
            <PixelCoin />
            <span className="text-[0.62rem] font-black tracking-wide text-gray-500">
              {perk}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Services() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // IntersectionObserver — trigger once when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="w-full px-6 py-20 flex justify-center"
    >
      <div className="w-full max-w-6xl flex flex-col gap-12">

        {/* Heading */}
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest text-center">
            ▸ WHAT I{" "}
            <span className="text-orange-500">OFFER</span>
          </p>

          {/* Pixel divider */}
          <div
            className="w-32"
            style={{
              height: 3,
              background:
                "repeating-linear-gradient(90deg, #f97316 0px, #f97316 8px, transparent 8px, transparent 12px)",
            }}
          />

          <p className="text-gray-500 text-sm font-bold tracking-wide text-center max-w-md">
            Services I provide — from first commit to production deploy.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              visible={visible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.4s ease 0.5s",
          }}
        >
          <a
            href="#contact"
            className="group flex items-center gap-3 px-6 py-3 font-black text-sm tracking-[0.18em]
                       text-black no-underline rounded-sm transition-all duration-150 active:translate-y-px"
            style={{
              background:
                "repeating-linear-gradient(90deg, #f97316 0px, #f97316 10px, #c2410c 10px, #c2410c 14px)",
              boxShadow: "4px 4px 0 #111",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "6px 6px 0 #111"; e.currentTarget.style.transform = "translate(-1px,-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "4px 4px 0 #111"; e.currentTarget.style.transform = "translate(0,0)"; }}
          >
            <span className="group-hover:animate-bounce inline-block">▶</span>
            HIRE ME
          </a>
        </div>

      </div>
    </section>
  );
}