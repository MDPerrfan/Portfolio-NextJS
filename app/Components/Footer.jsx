"use client";

import { motion } from "framer-motion";
import { DiGithubBadge } from "react-icons/di";
import { SiLinkedin, SiHackerrank, SiFacebook } from "react-icons/si";
import { HiMail, HiPhone } from "react-icons/hi";



// ─── Pixel coin decoration ────────────────────────────────────────────────────
function PixelCoin() {
  return (
    <svg width="14" height="14" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="0" width="4" height="1" fill="#f5e642" />
      <rect x="1" y="1" width="6" height="1" fill="#f5e642" />
      <rect x="0" y="2" width="8" height="4" fill="#f5e642" />
      <rect x="1" y="6" width="6" height="1" fill="#f5e642" />
      <rect x="2" y="7" width="4" height="1" fill="#f5e642" />
    </svg>
  );
}

// ─── Pixel heart ─────────────────────────────────────────────────────────────
function PixelHeart() {
  return (
    <svg width="14" height="14" viewBox="0 0 7 7" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="0" width="2" height="1" fill="#e52222" />
      <rect x="4" y="0" width="2" height="1" fill="#e52222" />
      <rect x="0" y="1" width="3" height="2" fill="#e52222" />
      <rect x="4" y="1" width="3" height="2" fill="#e52222" />
      <rect x="0" y="3" width="7" height="2" fill="#e52222" />
      <rect x="1" y="5" width="5" height="1" fill="#e52222" />
      <rect x="2" y="6" width="3" height="1" fill="#e52222" />
    </svg>
  );
}

// ─── Social Button ────────────────────────────────────────────────────────────
function SocialBtn({ link }) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-1.5 px-4 py-3 rounded-sm
                 bg-[#0e0e1a] border-[2px] border-[#333] no-underline
                 transition-all duration-150 cursor-pointer"
      style={{ boxShadow: "3px 3px 0 #111" }}
      whileHover={{ y: -3, boxShadow: `4px 4px 0 ${link.color}66` }}
      whileTap={{ y: 1, boxShadow: "1px 1px 0 #111" }}
    >
      <span
        className="transition-colors duration-150"
        style={{ color: "#666" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = link.color)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
      >
        {link.icon}
      </span>
      <span className="text-[0.55rem] font-black tracking-widest text-gray-600
                       group-hover:text-gray-400 transition-colors">
        {link.label}
      </span>
    </motion.a>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────
export default function Footer({ about }) {
  const year = new Date().getFullYear();
const SOCIAL_LINKS = [
   {
      label: "GitHub",
      href: about?.github || "https://github.com/MDPerrfan",
      icon: <DiGithubBadge size={22} />,
      color: "#ffffff",
    },
    {
      label: "LinkedIn",
      href: about?.linkedin || "https://linkedin.com/in/mdperrfan",
      icon: <SiLinkedin size={18} />,
      color: "#0a66c2",
    },
  {
    label: "HackerRank",
    href: "https://hackerrank.com/mdperrfan",
    icon: <SiHackerrank size={18} />,
    color: "#00ea64",
    hoverBg: "#00ea64",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/mdperrfan",
    icon: <SiFacebook size={18} />,
    color: "#1877f2",
    hoverBg: "#1877f2",
  },
];
  // Pull from API data if available, fallback to hardcoded
    const email = about?.email ?? " ";
    const phone = about?.phone ?? "";
    const name  = about?.name ?? "Mohammed Parves";

  return (
    <footer id="contact" className="w-full mt-10">

      {/* Pixel top border strip */}
      <div style={{
        height: 4,
        background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 8px, transparent 8px, transparent 14px)"
      }} />

      <div className="bg-[#0a0a14] border-t-[3px] border-[#1e1e2e] px-6 py-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-10">

          {/* ── Top Row ── */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">

            {/* Brand */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                <span className="text-orange-500 font-black text-xl tracking-[0.2em]">
                  PARVES
                </span>
                <span className="text-gray-600 font-black text-xl tracking-[0.2em]">
                  .NET
                </span>
              </div>
              <p className="text-gray-500 text-[0.72rem] font-bold tracking-wider max-w-xs leading-relaxed">
                FULL-STACK MERN DEVELOPER<br />
                CRAFTING PIXEL-PERFECT EXPERIENCES
              </p>
              {/* Status badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0e1a0e] border border-[#1a3a1a] rounded-sm w-fit">
                <span className="available-dot w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-400 text-[0.6rem] font-black tracking-widest">
                  OPEN TO OPPORTUNITIES
                </span>
              </div>
            </motion.div>

            {/* Contact info — dynamic from API */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <span className="text-[0.6rem] font-black tracking-[0.2em] text-gray-600 mb-1">
                ── CONTACT ──
              </span>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-gray-400 hover:text-orange-400
                           transition-colors no-underline group"
              >
                <HiMail className="text-orange-500 flex-shrink-0" size={16} />
                <span className="text-[0.72rem] font-bold tracking-wide">{email}</span>
              </a>
              <a
                href={`tel:+88${phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-orange-400
                           transition-colors no-underline"
              >
                <HiPhone className="text-orange-500 flex-shrink-0" size={16} />
                <span className="text-[0.72rem] font-bold tracking-wide">+88 {phone}</span>
              </a>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <span className="text-[0.65rem]">📍</span>
                <span className="text-[0.72rem] font-bold tracking-wide">
                  Chittagong, Bangladesh
                </span>
              </div>
            </motion.div>

            {/* Quick nav */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="text-[0.6rem] font-black tracking-[0.2em] text-gray-600 mb-1">
                ── NAVIGATE ──
              </span>
              {["Hero", "About", "Skills", "Projects"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="flex items-center gap-2 text-gray-500 hover:text-orange-400
                             transition-colors no-underline text-[0.72rem] font-bold tracking-wide group"
                >
                  <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity text-[0.6rem]">▶</span>
                  {item.toUpperCase()}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Pixel divider */}
          <div style={{
            height: 3,
            background: "repeating-linear-gradient(90deg, #1e1e2e 0px, #1e1e2e 10px, transparent 10px, transparent 14px)"
          }} />

          {/* ── Social Links ── */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="text-[0.6rem] font-black tracking-[0.25em] text-gray-600">
              ── FIND ME ON ──
            </span>
            <div className="flex flex-wrap justify-center gap-3">
              {SOCIAL_LINKS.map((link) => (
                <SocialBtn key={link.label} link={link} />
              ))}
            </div>
          </motion.div>

          {/* Pixel divider */}
          <div style={{
            height: 3,
            background: "repeating-linear-gradient(90deg, #1e1e2e 0px, #1e1e2e 10px, transparent 10px, transparent 14px)"
          }} />

          {/* ── Bottom bar ── */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PixelCoin />
              <span className="text-gray-600 text-[0.62rem] font-bold tracking-widest">
                © {year} {name.toUpperCase()}  ·  ALL RIGHTS RESERVED
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-600 text-[0.62rem] font-bold tracking-widest">
                MADE WITH
              </span>
              <PixelHeart />
              <span className="text-gray-600 text-[0.62rem] font-bold tracking-widest">
                USING NEXT.JS & TAILWIND
              </span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .available-dot {
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </footer>
  );
}