"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Helpers ───────────────────────────────────────────────────────────────────

function screenshotUrl(url) {
  if (!url) return null;
  return `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

// ── Laptop SVG shell ──────────────────────────────────────────────────────────
// Renders an SVG laptop frame; children go inside the screen area via foreignObject

function LaptopShell({ children, accent = "#f97316" }) {
  return (
    <div className="relative w-full select-none" style={{ maxWidth: 860, margin: "0 auto",maxHeight:700}}>
      <svg
        viewBox="0 0 860 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.7))" }}
      >
        {/* ── Lid / screen bezel ── */}
        <rect x="60" y="10" width="740" height="460" rx="14" fill="#111118" />
        <rect x="60" y="10" width="740" height="460" rx="14"
          stroke="#2a2a3a" strokeWidth="2" />

        {/* Screen glass inset */}
        <rect x="80" y="28" width="700" height="424" rx="6" fill="#080810" />

        {/* Top camera dot */}
        <circle cx="430" cy="21" r="4" fill="#222230" />
        <circle cx="430" cy="21" r="2" fill="#1a1a28" />

        {/* Accent glow behind screen */}
        <rect x="80" y="28" width="700" height="424" rx="6"
          fill="none"
          stroke={accent}
          strokeWidth="1"
          strokeOpacity="0.18" />

        {/* ── Base / keyboard ── */}
        {/* Hinge bar */}
        <rect x="56" y="468" width="748" height="10" rx="3" fill="#18181f" />

        {/* Base top face */}
        <path d="M30 478 L830 478 L800 528 L60 528 Z" fill="#141420" />
        <path d="M30 478 L830 478 L800 528 L60 528 Z"
          stroke="#222232" strokeWidth="1.5" />

        {/* Keyboard area (decorative rows) */}
        {[0, 1, 2, 3].map((row) =>
          Array.from({ length: 14 - row }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={120 + col * 46 + row * 6}
              y={482 + row * 10}
              width={40 - row * 2}
              height={7}
              rx={1.5}
              fill="#1c1c2a"
              stroke="#252535"
              strokeWidth="0.5"
            />
          ))
        )}

        {/* Trackpad */}
        <rect x="330" y="508" width="200" height="14" rx="4"
          fill="#1a1a28" stroke="#252535" strokeWidth="1" />

        {/* Base bottom edge */}
        <path d="M60 528 L800 528 L790 536 L70 536 Z" fill="#0e0e18" />

        {/* Rubber feet */}
        {[100, 760].map((x) => (
          <rect key={x} x={x} y="534" width="30" height="4" rx="2" fill="#0a0a12" />
        ))}

        {/* Screen content area — foreignObject */}
        <foreignObject x="80" y="28" width="700" height="424">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}
          >
            {children}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

// ── Screen content (image + overlay) ─────────────────────────────────────────

function ScreenContent({ project, direction }) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = screenshotUrl(project.liveUrl);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60, scale: 0.97 }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={project._id ?? project.title}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: "100%", height: "100%", position: "relative", background: "#050510" }}
      >
        {/* Loading shimmer */}
        {!loaded && imgSrc && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(110deg, #0a0a18 30%, #12122a 50%, #0a0a18 70%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s infinite linear",
            }}
          />
        )}

        {/* Screenshot */}
        {imgSrc ? (
          <img
            key={project._id ?? project.title}
            src={imgSrc}
            alt={project.title}
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top",
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />
        ) : (
          /* Fallback — no live URL */
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#05050e",
            flexDirection: "column", gap: 12,
          }}>
            <svg width="48" height="48" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
              <rect x="1" y="1" width="14" height="10" fill="#1a6fff" />
              <rect x="2" y="2" width="12" height="8" fill="#0a0a14" />
              <rect x="3" y="3" width="3" height="1" fill="#f97316" />
              <rect x="3" y="5" width="5" height="1" fill="#4ade80" />
              <rect x="3" y="7" width="4" height="1" fill="#f97316" />
            </svg>
            <span style={{ color: "#2a2a3e", fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.1em" }}>
              NO PREVIEW
            </span>
          </div>
        )}

        {/* Scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)",
        }} />

        {/* Bottom info bar inside screen */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.92))",
          padding: "28px 20px 14px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#f97316", letterSpacing: "0.18em", marginBottom: 4 }}>
              PROJECT_{String(project._displayIndex ?? "").padStart(2, "0")}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", letterSpacing: "0.03em", lineHeight: 1.1 }}>
              {project.title}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px",
                  background: "transparent",
                  border: "1px solid #444",
                  borderRadius: 4,
                  color: "#ccc",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  fontFamily: "monospace",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f97316"; e.currentTarget.style.color = "#f97316"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#ccc"; }}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                CODE
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "5px 12px",
                  background: "#f97316",
                  border: "1px solid #f97316",
                  borderRadius: 4,
                  color: "#000",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  fontFamily: "monospace",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fb923c"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f97316"; }}
              >
                ▶ LIVE
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Filmstrip thumbnail ───────────────────────────────────────────────────────

function FilmThumb({ project, isActive, onClick, index }) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = screenshotUrl(project.liveUrl);

  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 120,
        height: 76,
        position: "relative",
        border: `2px solid ${isActive ? "#f97316" : "#1e1e2e"}`,
        borderRadius: 4,
        overflow: "hidden",
        background: "#05050e",
        cursor: "pointer",
        outline: "none",
        padding: 0,
        transition: "border-color 0.2s, transform 0.2s",
        transform: isActive ? "scale(1.06)" : "scale(1)",
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.borderColor = "#f9731666"; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.borderColor = "#1e1e2e"; }}
    >
      {/* Sprocket holes top */}
      <div style={{ position: "absolute", top: 2, left: 0, right: 0, display: "flex", justifyContent: "space-around", zIndex: 3 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ width: 6, height: 4, background: "#0a0a14", border: "1px solid #1e1e2e", borderRadius: 1 }} />
        ))}
      </div>
      {/* Sprocket holes bottom */}
      <div style={{ position: "absolute", bottom: 2, left: 0, right: 0, display: "flex", justifyContent: "space-around", zIndex: 3 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ width: 6, height: 4, background: "#0a0a14", border: "1px solid #1e1e2e", borderRadius: 1 }} />
        ))}
      </div>

      {/* Thumbnail image */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={project.title}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: "0.55rem", color: "#2a2a3e",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      {/* Active orange tint */}
      {isActive && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(249,115,22,0.12)",
          pointerEvents: "none",
        }} />
      )}

      {/* Index number */}
      <div style={{
        position: "absolute", bottom: 8, right: 4,
        fontFamily: "monospace", fontSize: "0.5rem",
        color: isActive ? "#f97316" : "#333",
        fontWeight: 700,
        zIndex: 4,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
    </button>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total, progress }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "#333", minWidth: 36 }}>
        {String(current + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </span>
      <div style={{ flex: 1, height: 2, background: "#111", borderRadius: 1, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "#f97316", borderRadius: 1 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

const AUTOPLAY_MS = 5000;

export default function Projects({ projects = [] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const filmstripRef = useRef(null);

  // Attach display index to projects
  const items = projects.map((p, i) => ({ ...p, _displayIndex: i + 1 }));

  // Intersection observer
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goTo = useCallback((idx, dir) => {
    setDirection(dir);
    setActive(idx);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % items.length, 1);
  }, [active, items.length, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + items.length) % items.length, -1);
  }, [active, items.length, goTo]);

  // Autoplay with smooth progress bar
  useEffect(() => {
    if (paused || items.length <= 1) return;

    setProgress(0);
    const step = 100 / (AUTOPLAY_MS / 50);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + step;
      });
    }, 50);

    intervalRef.current = setTimeout(() => {
      setDirection(1);
      setActive((a) => (a + 1) % items.length);
      setProgress(0);
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(progressRef.current);
      clearTimeout(intervalRef.current);
    };
  }, [active, paused, items.length]);

  // Scroll filmstrip to active thumb — scrollLeft only, never touches page scroll
  useEffect(() => {
    const strip = filmstripRef.current;
    if (!strip) return;
    const thumb = strip.children[active];
    if (!thumb) return;
    const stripCenter = strip.offsetWidth / 2;
    const thumbCenter = thumb.offsetLeft + thumb.offsetWidth / 2;
    strip.scrollTo({ left: thumbCenter - stripCenter, behavior: "smooth" });
  }, [active]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (items.length === 0) {
    return (
      <section id="projects" className="w-full min-h-screen px-6 py-20 flex justify-center items-center">
        <p className="text-orange-500 font-bold tracking-widest text-sm font-mono">
          ▶ NO PROJECTS FOUND
        </p>
      </section>
    );
  }

  const current = items[active];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full min-h-screen px-4 md:px-8 py-20 flex justify-center"
    >
      <div className="w-full max-w-6xl flex flex-col gap-12">

        {/* ── Heading ── */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
            ▸ MY RECENT <span className="text-orange-500">WORKS</span>
          </p>
          <p className="text-gray-500 text-sm font-mono tracking-wide">
            {items.length} PROJECTS · CLICK FILMSTRIP OR USE KEYBOARD TO NAVIGATE
          </p>
        </motion.div>

        {/* ── Main display ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Laptop — full width, no nav buttons */}
          <div className="w-full " onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>
            <LaptopShell>
              <ScreenContent project={current} direction={direction} />
            </LaptopShell>
          </div>

          {/* ── Project meta + progress ── */}
          <div className="w-full flex flex-col gap-3">

            {/* Progress + counter */}
            <ProgressBar current={active} total={items.length} progress={progress} />

            {/* Description + tags — fixed height block to prevent layout shift */}
            <div style={{ minHeight: 88 }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current._id ?? current.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-gray-500 text-sm leading-relaxed font-mono mb-3"
                >
                  {current.description}
                </motion.p>
              </AnimatePresence>

              {/* Tech tags — always reserve space even when empty */}
              <div className="flex flex-wrap gap-2 min-h-[24px]">
                <AnimatePresence mode="wait">
                  {current.techStack?.length > 0 && (
                    <motion.div
                      key={current._id ?? current.title + "-tags"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-wrap gap-2"
                    >
                      {current.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[0.6rem] font-bold tracking-[0.12em]
                                     px-2 py-0.5 rounded-sm
                                     text-orange-500 bg-orange-500/10
                                     border border-orange-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Filmstrip scrubber ── */}
          <div className="w-full">
            {/* Film edge top */}
            <div
              className="w-full h-1.5 mb-1"
              style={{
                background: "repeating-linear-gradient(90deg,#1e1e2e 0,#1e1e2e 10px,#0a0a14 10px,#0a0a14 14px)",
              }}
            />

            <div
              ref={filmstripRef}
              className="flex gap-3 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((p, i) => (
                <FilmThumb
                  key={p._id ?? i}
                  project={p}
                  index={i}
                  isActive={active === i}
                  onClick={() => {
                    const dir = i > active ? 1 : -1;
                    goTo(i, dir);
                  }}
                />
              ))}
            </div>

            {/* Film edge bottom */}
            <div
              className="w-full h-1.5 mt-1"
              style={{
                background: "repeating-linear-gradient(90deg,#1e1e2e 0,#1e1e2e 10px,#0a0a14 10px,#0a0a14 14px)",
              }}
            />
          </div>

          {/* Pause indicator */}
          {paused && (
            <div className="font-mono text-[0.58rem] text-[#2a2a3a] tracking-[0.16em]">
              ⏸ AUTOPLAY PAUSED
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        /* Hide filmstrip scrollbar */
        #projects ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}