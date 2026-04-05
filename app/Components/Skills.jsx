"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiBootstrap } from "react-icons/di";
import {
  SiTailwindcss, SiFirebase, SiExpress, SiNextdotjs,
  SiMongodb, SiPostman, SiJsonwebtokens, SiVercel,
  SiNetlify, SiRender, SiGithubcopilot, SiCloudinary,
} from "react-icons/si";
import {
  DiJavascript1, DiReact, DiNodejs, DiCss3Full,
  DiHtml5, DiGit,
} from "react-icons/di";
import { VscVscode } from "react-icons/vsc";
import { GitHubCalendar } from "react-github-calendar";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    color: "#f97316",
    glow: "rgba(249,115,22,0.4)",
    dimGlow: "rgba(249,115,22,0.08)",
    orbitR: [90, 140, 185],
    skills: [
      { icon: <DiHtml5 />,       name: "HTML5",        xp: 95, ring: 0 },
      { icon: <DiCss3Full />,    name: "CSS3",         xp: 90, ring: 0 },
      { icon: <DiBootstrap />,   name: "Bootstrap",    xp: 80, ring: 1 },
      { icon: <SiTailwindcss />, name: "Tailwind CSS", xp: 88, ring: 1 },
      { icon: <DiJavascript1 />, name: "JavaScript",   xp: 90, ring: 1 },
      { icon: <DiReact />,       name: "React.js",     xp: 88, ring: 2 },
      { icon: <SiNextdotjs />,   name: "Next.js",      xp: 80, ring: 2 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.4)",
    dimGlow: "rgba(34,211,238,0.08)",
    orbitR: [90, 140, 185],
    skills: [
      { icon: <DiNodejs />,        name: "Node.js",    xp: 92, ring: 0 },
      { icon: <SiExpress />,       name: "Express.js", xp: 90, ring: 0 },
      { icon: <SiMongodb />,       name: "MongoDB",    xp: 78, ring: 1 },
      { icon: <SiJsonwebtokens />, name: "JWT Auth",   xp: 75, ring: 1 },
      { icon: <SiCloudinary />,    name: "Cloudinary", xp: 80, ring: 2 },
      { icon: <SiFirebase />,      name: "Firebase",   xp: 60, ring: 2 },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    dimGlow: "rgba(167,139,250,0.08)",
    orbitR: [90, 140, 185],
    skills: [
      { icon: <DiGit />,           name: "Git & GitHub",   xp: 85, ring: 0 },
      { icon: <SiPostman />,       name: "Postman",        xp: 80, ring: 0 },
      { icon: <VscVscode />,       name: "VS Code",        xp: 92, ring: 1 },
      { icon: <SiVercel />,        name: "Vercel",         xp: 90, ring: 1 },
      { icon: <SiNetlify />,       name: "Netlify",        xp: 85, ring: 2 },
      { icon: <SiRender />,        name: "Render",         xp: 80, ring: 2 },
      { icon: <SiGithubcopilot />, name: "GitHub Copilot", xp: 75, ring: 2 },
    ],
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

// Y_SQUASH: how "tilted" the ellipse looks. 0 = flat line, 1 = circle, 0.32 ≈ 45° tilt
const Y_SQUASH = 0.32;
const SVG_W = 400;
const SVG_H = 400;
const CX = SVG_W / 2; // 220
const CY = SVG_H / 2; // 220
const NODE_R = 20;

// Per-ring base revolution speeds (seconds). Each node gets a slight offset on top.
const RING_SPEED = [24, 36, 50];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map an angle + ellipse x-radius to SVG coordinates. */
function ellipseXY(angleDeg, rx) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * rx,
    y: CY + Math.sin(rad) * rx * Y_SQUASH,
  };
}

/** Nodes with sin(angle) < 0 are "behind" the center — render them first. */
function zOf(angleDeg) {
  return Math.sin((angleDeg * Math.PI) / 180);
}

/** Build the node list with start angles evenly distributed per ring. */
function buildNodes(category) {
  return [0, 1, 2].flatMap((ri) => {
    const group = category.skills.filter((s) => s.ring === ri);
    const step = 360 / (group.length || 1);
    const offset = ri * 47; // stagger rings so nodes don't stack at t=0
    return group.map((skill, i) => ({
      ...skill,
      rx: category.orbitR[ri],
      ringIndex: ri,
      startAngle: offset + i * step,
    }));
  });
}

// ─── Orbital Canvas ───────────────────────────────────────────────────────────

function OrbitalCanvas({ category }) {
  const { color, glow, dimGlow, orbitR } = category;

  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const t0Ref = useRef(performance.now());

  // Stable node list — only rebuilt when category changes
  const nodesRef = useRef([]);
  const speedsRef = useRef([]);

  useEffect(() => {
    nodesRef.current = buildNodes(category);
    // Unique speed per node: base ring speed + small per-node delta
    speedsRef.current = nodesRef.current.map((n, i) => RING_SPEED[n.ringIndex] + i * 3);
    t0Ref.current = performance.now();
    setAngles(nodesRef.current.map((n) => n.startAngle));
    setHovered(null);
  }, [category.id]); // eslint-disable-line

  const [angles, setAngles] = useState(() =>
    buildNodes(category).map((n) => n.startAngle)
  );
  const [hovered, setHovered] = useState(null); // index into nodes array
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // Animation loop
  useEffect(() => {
    const tick = () => {
      const elapsed = (performance.now() - t0Ref.current) / 1000;
      setAngles(
        speedsRef.current.map((spd, i) =>
          (nodesRef.current[i].startAngle + (360 / spd) * elapsed) % 360
        )
      );
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  // Tilt on mouse move
  const onMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ rx: dy * -14, ry: dx * 14 });
  }, []);

  const onLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    setHovered(null);
  }, []);

  const nodes = nodesRef.current;
  const hoveredNode = hovered !== null ? nodes[hovered] : null;

  // Compute SVG position for each node at current angle
  const positions = angles.map((ang, i) =>
    nodes[i] ? ellipseXY(ang, nodes[i].rx) : { x: CX, y: CY }
  );

  // Render back-to-front (painter's algorithm)
  const order = nodes
    .map((_, i) => i)
    .sort((a, b) => zOf(angles[a]) - zOf(angles[b]));

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ width: "100%", height: "100%", perspective: "900px", cursor: "crosshair" }}
    >
      <motion.div
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 160, damping: 20, mass: 0.7 }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <radialGradient id={`atmo-${category.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.13" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`core-${category.id}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={color} stopOpacity="0.25" />
            </radialGradient>
            <radialGradient id={`nodeFill-${category.id}`} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor={color} stopOpacity="0.85" />
              <stop offset="100%" stopColor={color} stopOpacity="0.3" />
            </radialGradient>
          </defs>

          {/* Atmosphere */}
          <ellipse
            cx={CX} cy={CY}
            rx={200} ry={200 * Y_SQUASH * 3}
            fill={`url(#atmo-${category.id})`}
          />

          {/* ── Orbit rings ── */}
          {orbitR.map((rx, i) => {
            const ry = rx * Y_SQUASH;
            return (
              <g key={`ring-${i}`}>
                {/* Soft halo */}
                <ellipse
                  cx={CX} cy={CY} rx={rx} ry={ry}
                  fill="none"
                  stroke={color}
                  strokeOpacity={0.06}
                  strokeWidth={rx * 0.13}
                />
                {/* Dashed orbit line */}
                <ellipse
                  cx={CX} cy={CY} rx={rx} ry={ry}
                  fill="none"
                  stroke={color}
                  strokeOpacity={[0.55, 0.42, 0.3][i]}
                  strokeWidth={[1.8, 1.5, 1.2][i]}
                  strokeDasharray={["7 5", "5 6", "4 8"][i]}
                />
              </g>
            );
          })}

          {/* ── Skill nodes (back to front) ── */}
          {order.map((i) => {
            if (!nodes[i]) return null;
            const node = nodes[i];
            const { x, y } = positions[i];
            const isHov = hovered === i;
            const z = zOf(angles[i]); // -1 (behind) to +1 (front)
            const scale = 0.78 + z * 0.22; // smaller when behind
            const dimAlpha = 0.65 + z * 0.35;

            return (
              <g
                key={node.name}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover glow ring */}
                {isHov && (
                  <circle r={NODE_R * scale * 2} fill={color} opacity={0.15} />
                )}

                {/* Drop shadow ellipse */}
                <ellipse
                  cx={0} cy={NODE_R * scale * 0.55}
                  rx={NODE_R * scale * 0.85}
                  ry={NODE_R * scale * 0.2}
                  fill="#000"
                  opacity={0.28 + z * 0.1}
                />

                {/* Node body */}
                <circle
                  r={NODE_R * scale}
                  fill={isHov ? `url(#nodeFill-${category.id})` : "#0d0d1a"}
                  stroke={color}
                  strokeWidth={isHov ? 1.8 : 1.2}
                  strokeOpacity={isHov ? 1 : 0.45 + z * 0.35}
                  opacity={dimAlpha}
                />

                {/* Specular shine */}
                <circle
                  cx={-NODE_R * scale * 0.3}
                  cy={-NODE_R * scale * 0.3}
                  r={NODE_R * scale * 0.2}
                  fill="#fff"
                  opacity={isHov ? 0.2 : 0.07}
                />

                {/* Icon via foreignObject */}
                <foreignObject
                  x={-NODE_R * scale}
                  y={-NODE_R * scale}
                  width={NODE_R * 2 * scale}
                  height={NODE_R * 2 * scale}
                  style={{ pointerEvents: "none", overflow: "visible" }}
                >
                  <div
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: `${15 * scale}px`,
                      color: isHov ? "#fff" : color,
                      opacity: dimAlpha,
                    }}
                  >
                    {node.icon}
                  </div>
                </foreignObject>

                {/* Tooltip */}
                {isHov && (
                  <g>
                    <rect
                      x={-50} y={NODE_R * scale + 7}
                      width={100} height={22}
                      rx={4}
                      fill="#080812ee"
                      stroke={color}
                      strokeWidth={0.8}
                      strokeOpacity={0.45}
                    />
                    <text
                      x={0} y={NODE_R * scale + 22}
                      textAnchor="middle"
                      fill={color}
                      fontSize={8.5}
                      fontWeight={700}
                      letterSpacing={0.8}
                      style={{ fontFamily: "monospace" }}
                    >
                      {node.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── Central core ── */}
          <ellipse cx={CX} cy={CY + 30} rx={30} ry={7} fill="#000" opacity={0.3} />
          <circle cx={CX} cy={CY} r={40} fill={color} opacity={0.07} />
          <circle cx={CX} cy={CY} r={32} fill={color} opacity={0.1} />
          <circle
            cx={CX} cy={CY} r={26}
            fill={`url(#core-${category.id})`}
            stroke={color}
            strokeWidth={1.5}
            strokeOpacity={0.7}
          />
          <circle cx={CX - 9} cy={CY - 9} r={7} fill="#fff" opacity={0.18} />
          <text
            x={CX} y={CY + 4}
            textAnchor="middle"
            fill="#fff"
            fontSize={7}
            fontWeight={800}
            letterSpacing={1.6}
            opacity={0.95}
            style={{ fontFamily: "monospace" }}
          >
            {category.label.toUpperCase()}
          </text>

          {/* ── Hovered skill XP bar ── */}
          {hoveredNode && (() => {
            const blocks = Math.round(hoveredNode.xp / 5);
            const bw = 8, bh = 6, gap = 2;
            const totalW = 20 * (bw + gap) - gap;
            const sx = CX - totalW / 2;
            const barY = SVG_H - 36;
            return (
              <g>
                <rect
                  x={sx - 12} y={barY - 18}
                  width={totalW + 60} height={34}
                  rx={5}
                  fill="#08081299"
                  stroke={color}
                  strokeWidth={0.7}
                  strokeOpacity={0.3}
                />
                <text
                  x={CX} y={barY - 4}
                  textAnchor="middle"
                  fill={color}
                  fontSize={6.5}
                  fontWeight={700}
                  letterSpacing={1.2}
                  opacity={0.7}
                  style={{ fontFamily: "monospace" }}
                >
                  PROFICIENCY · {hoveredNode.xp}%
                </text>
                {Array.from({ length: 20 }).map((_, bi) => (
                  <rect
                    key={bi}
                    x={sx + bi * (bw + gap)}
                    y={barY + 2}
                    width={bw}
                    height={bh}
                    rx={1.5}
                    fill={bi < blocks ? color : "#1e1e2e"}
                    opacity={bi < blocks ? 0.95 : 0.4}
                  />
                ))}
              </g>
            );
          })()}
        </svg>
      </motion.div>
    </div>
  );
}

// ─── Category Tab ─────────────────────────────────────────────────────────────

function CategoryTab({ category, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 px-6 py-3 rounded-sm "
      style={{
        background: active ? `${category.color}15` : "gray-800",
        border: `1px solid ${active ? category.color + "66" : "#1e1e2e"}`,
        cursor: "pointer",
        minWidth: 110,
        outline: "none",
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          color: active ? category.color : "",
          transition: "color 0.2s",
        }}
      >
        {category.label.toUpperCase()}
      </span>
      <span style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}>
        {category.skills.length} skills
      </span>
      {active && (
        <motion.div
          className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 32, height: 2, background: category.color }}
          layoutId="tab-indicator"
        />
      )}
    </motion.button>
  );
}

// ─── Skill List Panel ─────────────────────────────────────────────────────────

function SkillListPanel({ category }) {
  return (
    <motion.div
      key={category.id}
      className="w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-3">
        {category.skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div
              className="flex items-center justify-center rounded-sm flex-shrink-0"
              style={{
                width: 32, height: 32,
                background: `${category.color}18`,
                border: `1px solid ${category.color}33`,
                color: category.color,
                fontSize: "1.1rem",
              }}
            >
              {skill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em"}}>
                  {skill.name}
                </span>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: category.color, opacity: 0.8 }}>
                  {skill.xp}%
                </span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: "#1a1a2e" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${category.color}88, ${category.color})`,
                    boxShadow: `0 0 6px ${category.color}66`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.xp}%` }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Skills() {
  const [active, setActive] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const category = CATEGORIES[active];

  useEffect(() => setIsMounted(true), []);

  return (
    <section id="skills" className="w-full px-4 md:px-8 py-20 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-20">

        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
            ▸ TECH <span className="text-orange-500">STACK</span>
          </p>
          <p className="text-gray-600 text-xs tracking-[0.2em] uppercase">
            Hover nodes · Select category · Explore skills
          </p>
        </motion.div>

        {/* Main UI */}
        <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">

          {/* Orbital canvas */}
          <motion.div
            className="relative flex-shrink-0 rounded-lg overflow-hidden"
            style={{
              width: "100%",
              maxWidth: 560,
              height: 600,
              margin: "0 auto",
            }}
       
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.38 }}
              >
                <OrbitalCanvas category={category} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Detail panel */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat, i) => (
                <CategoryTab
                  key={cat.id}
                  category={cat}
                  active={active === i}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>

            <motion.div
              style={{ height: 1 }}
              animate={{ background: `linear-gradient(90deg, ${category.color}55, transparent)` }}
              transition={{ duration: 0.4 }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={category.id + "-head"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", marginBottom: 4 }}>
                  CATEGORY
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: category.color,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                    textShadow: `0 0 30px ${category.glow}`,
                  }}
                >
                  {category.label.toUpperCase()}
                </div>
                <div style={{ fontSize: "0.7rem", marginTop: 4 }}>
                  {category.skills.length} technologies · hover nodes to inspect
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: 310 }}>
              <AnimatePresence mode="wait">
                <SkillListPanel key={category.id} category={category} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* GitHub Calendar */}
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
            <p className="text-gray-600 text-xs tracking-[0.2em] uppercase">
              Daily commits · Streak counter · Contribution map
            </p>
          </motion.div>

          <motion.div
            className="w-full rounded-lg p-6 overflow-x-auto flex justify-center"
            style={{
              background: "#050510",
              border: "1px solid #1a1a2e",
              boxShadow: "0 0 60px rgba(249,115,22,0.06)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center gap-2 self-start">
                <div className="rounded-full" style={{ width: 6, height: 6, background: "#f97316" }} />
                <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", color: "#333" }}>
                  PLAYER: MDPERRFAN · PLATFORM: GITHUB
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
                <div
                  className="animate-pulse rounded-sm"
                  style={{ height: 144, width: "100%", maxWidth: 680, background: "#0e0e1a" }}
                />
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}