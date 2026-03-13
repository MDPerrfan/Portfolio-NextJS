"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CgCPlusPlus } from "react-icons/cg";
import { DiBootstrap } from "react-icons/di";
import { SiTailwindcss, SiFirebase, SiExpress, SiNextdotjs, SiMongodb, SiPostman, SiJsonwebtokens } from "react-icons/si";
import { DiJavascript1, DiReact, DiNodejs, DiCss3Full, DiHtml5, DiGit } from "react-icons/di";
import { VscVscode } from "react-icons/vsc";
import {GitHubCalendar} from "react-github-calendar";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    label: "FRONTEND",
    color: "#f97316",
    icon: "🖥️",
    skills: [
      { icon: <DiHtml5 />,       name: "HTML5",        xp: 95 },
      { icon: <DiCss3Full />,    name: "CSS3",         xp: 90 },
      { icon: <DiBootstrap />,   name: "Bootstrap",    xp: 80 },
      { icon: <SiTailwindcss />, name: "Tailwind CSS", xp: 88 },
      { icon: <DiJavascript1 />, name: "JavaScript",   xp: 90 },
      { icon: <DiReact />,       name: "React.js",     xp: 88 },
      { icon: <SiNextdotjs />,   name: "Next.js",      xp: 80 },
    ],
  },
  {
    label: "BACKEND",
    color: "#22d3ee",
    icon: "⚙️",
    skills: [
      { icon: <DiNodejs />,        name: "Node.js",    xp: 82 },
      { icon: <SiExpress />,       name: "Express.js", xp: 80 },
      { icon: <SiMongodb />,       name: "MongoDB",    xp: 78 },
      { icon: <SiJsonwebtokens />, name: "JWT Auth",   xp: 75 },
      { icon: <SiFirebase />,      name: "Firebase",   xp: 70 },
    ],
  },
  {
    label: "TOOLS",
    color: "#a78bfa",
    icon: "🛠️",
    skills: [
      { icon: <DiGit />,      name: "Git & GitHub", xp: 85 },
      { icon: <SiPostman />,  name: "Postman",      xp: 80 },
      { icon: <VscVscode />,  name: "VS Code",      xp: 92 },
      { icon: <CgCPlusPlus />,name: "C++",          xp: 65 },
    ],
  },
];

// ─── XP Bar ───────────────────────────────────────────────────────────────────

function XPBar({ xp, color, animate }) {
  const blocks = Math.round(xp / 5); // 20 total blocks
  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-2 w-[6px] rounded-sm"
          style={{ background: i < blocks ? color : "#2a2a3a" }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={animate ? { opacity: 1, scaleY: 1 } : {}}
          transition={{ delay: i * 0.025, duration: 0.15 }}
        />
      ))}
      <span className="ml-2 text-[0.65rem] font-bold" style={{ color }}>
        LV.{Math.round(xp / 10)}
      </span>
    </div>
  );
}

// ─── Skill Row ────────────────────────────────────────────────────────────────

function SkillRow({ skill, color, delay, animate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-sm border border-transparent
                 hover:border-[#333] transition-all duration-150 cursor-default group"
      style={{ background: hovered ? "#0e0e1a" : "transparent" }}
      initial={{ opacity: 0, x: -16 }}
      animate={animate ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div
        className="text-2xl w-8 flex-shrink-0 transition-transform duration-150 group-hover:scale-125"
        style={{ color: hovered ? color : "#666" }}
      >
        {skill.icon}
      </div>
      {/* Name + XP bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.75rem] font-bold tracking-wide text-gray-300 group-hover:text-white transition-colors">
            {skill.name}
          </span>
        </div>
        <XPBar xp={skill.xp} color={color} animate={animate} />
      </div>
    </motion.div>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ category, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm overflow-hidden
                 hover:border-[#333] transition-all duration-200"
      style={{ boxShadow: `4px 4px 0 #111, 6px 6px 0 ${category.color}33` }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b-[3px]"
        style={{
          borderColor: category.color,
          background: `${category.color}18`,
        }}
      >
        <span className="text-lg">{category.icon}</span>
        <span
          className="text-sm font-black tracking-[0.2em]"
          style={{ color: category.color }}
        >
          {category.label}
        </span>
        {/* Pixel corner dots */}
        <div className="ml-auto flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-sm" style={{ background: category.color, opacity: 0.4 + i * 0.2 }} />
          ))}
        </div>
      </div>

      {/* Skill rows */}
      <div className="p-3 flex flex-col gap-1">
        {category.skills.map((skill, i) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            color={category.color}
            delay={i * 0.05}
            animate={visible}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Skills() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <section id="skills" className="w-full px-6 py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-20">

        {/* ── Tech Stack ── */}
        <div className="w-full">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
              ▸ TECH <span className="text-orange-500">STACK</span>
            </p>
            <p className="text-gray-500 text-sm tracking-wide">
              SELECT YOUR CHARACTER  ·  SKILL TREE UNLOCKED
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.label} category={cat} index={i} />
            ))}
          </div>

          {/* <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: "SKILLS UNLOCKED", value: "16+", color: "#f97316" },
              { label: "PROJECTS SHIPPED", value: "10+", color: "#22d3ee" },
              { label: "CGPA",             value: "3.90", color: "#a78bfa" },
              { label: "CERTS EARNED",     value: "7",   color: "#4ade80" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm
                           flex flex-col items-center justify-center py-4 px-3 text-center
                           hover:border-[#333] transition-colors"
                style={{ boxShadow: `3px 3px 0 #111` }}
              >
                <span className="text-2xl font-black" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <span className="text-[0.6rem] text-gray-500 font-bold tracking-[0.15em] mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div> */}
        </div>

        {/* ── GitHub Calendar ── */}
        <div className="w-full flex flex-col items-center gap-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
              ▸ GITHUB <span className="text-orange-500">ACTIVITY</span>
            </p>
            <p className="text-gray-500 text-sm tracking-wide">
              DAILY COMMITS  ·  STREAK COUNTER  ·  CONTRIBUTION MAP
            </p>
          </motion.div>

          <motion.div
            className="w-full bg-[#0a0a14] border-[3px] border-[#1e1e2e] rounded-sm p-6
                       overflow-x-auto flex justify-center"
            style={{ boxShadow: "4px 4px 0 #111, 6px 6px 0 #f9731633" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Header strip */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-2 self-start">
                <div className="w-2 h-2 rounded-sm bg-orange-500" />
                <span className="text-[0.65rem] font-bold tracking-[0.2em] text-gray-500">
                  PLAYER: MDPERRFAN  ·  PLATFORM: GITHUB
                </span>
              </div>

              {isMounted ? (
                <GitHubCalendar
                  username="MDPerrfan"
                  blockSize={13}
                  blockMargin={4}
                  fontSize={12}
                  theme={{
                    dark: ["#0e0e1a", "#7c2d12", "#c2410c", "#f97316", "#fb923c"],
                    light: ["#f3f4f6", "#fed7aa", "#fb923c", "#f97316", "#c2410c"],
                  }}
                />
              ) : (
                <div className="h-36 w-full max-w-2xl bg-[#0e0e1a] rounded-sm animate-pulse" />
              )}
            </div>
          </motion.div>
        </div>

      </div>

      <style>{`
        /* scanline texture on category cards */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}