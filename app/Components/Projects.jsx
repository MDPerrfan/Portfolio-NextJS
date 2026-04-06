"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTOPLAY_MS = 6000;

function screenshotUrl(url) {
  if (!url) return null;
  return `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Laptop Shell
// FIX: Removed foreignObject entirely — it is unreliable on mobile Safari.
// The screen content is now absolutely positioned on top of the SVG using
// percentage-based insets that match the SVG viewBox coordinates exactly.
//
// SVG viewBox = 860 × 560
// Screen rect in SVG: x=80 y=28 width=700 height=424
// As percentages of 860×560:
//   left   = 80/860   = 9.302%
//   top    = 28/560   = 5%
//   width  = 700/860  = 81.395%
//   height = 424/560  = 75.714%
// ─────────────────────────────────────────────────────────────────────────────

const SCREEN = {
  left:   "9.302%",
  top:    "5%",
  width:  "81.395%",
  height: "75.714%",
};

function LaptopShell({ children }) {
  return (
    // Outer wrapper maintains the SVG aspect ratio
    <div className="relative w-full" style={{ aspectRatio: "860 / 560" }}>

      {/* Screen content sits BEHIND the SVG, clipped to screen area */}
      <div
        style={{
          position: "absolute",
          left:   SCREEN.left,
          top:    SCREEN.top,
          width:  SCREEN.width,
          height: SCREEN.height,
          overflow: "hidden",
          borderRadius: "4px",
          background: "#080810",
          zIndex: 0,
        }}
      >
        {children}
      </div>

      {/* SVG laptop frame sits ON TOP — screen area is transparent */}
      <svg
        viewBox="0 0 860 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none", // clicks pass through to content below
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.8))",
        }}
      >
        {/* Outer lid */}
        <rect x="60" y="10" width="740" height="460" rx="14" fill="#111118" stroke="#2a2a3a" strokeWidth="2" />

        {/* Screen bezel — dark fill EXCEPT the viewport hole */}
        {/* Top bezel */}
        <rect x="60" y="10" width="740" height="18" rx="0" fill="#111118" />
        {/* Left bezel */}
        <rect x="60" y="10" width="20" height="460" fill="#111118" />
        {/* Right bezel */}
        <rect x="780" y="10" width="20" height="460" fill="#111118" />
        {/* Bottom bezel */}
        <rect x="60" y="452" width="740" height="18" fill="#111118" />

        {/* Screen border glow */}
        <rect x="80" y="28" width="700" height="424" rx="6" fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2" />

        {/* Camera dot */}
        <circle cx="430" cy="21" r="4" fill="#222230" />
        <circle cx="430" cy="21" r="2" fill="#1a1a28" />

        {/* Hinge bar */}
        <rect x="56" y="468" width="748" height="10" rx="3" fill="#18181f" />

        {/* Base/keyboard */}
        <path d="M30 478 L830 478 L800 528 L60 528 Z" fill="#141420" stroke="#222232" strokeWidth="1.5" />
        {[0, 1, 2, 3].map(row =>
          Array.from({ length: 14 - row }).map((_, col) => (
            <rect key={`${row}-${col}`}
              x={120 + col * 46 + row * 6} y={482 + row * 10}
              width={40 - row * 2} height={7} rx={1.5}
              fill="#1c1c2a" stroke="#252535" strokeWidth="0.5"
            />
          ))
        )}
        {/* Trackpad */}
        <rect x="330" y="508" width="200" height="14" rx="4" fill="#1a1a28" stroke="#252535" strokeWidth="1" />
        <path d="M60 528 L800 528 L790 536 L70 536 Z" fill="#0e0e18" />
        <rect x="100" y="534" width="30" height="4" rx="2" fill="#0a0a12" />
        <rect x="760" y="534" width="30" height="4" rx="2" fill="#0a0a12" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen Content
// FIX: always object-cover + object-top so image fills the screen area
// completely on all screen sizes. object-contain was letting the image
// shrink and show gaps on mobile.
// ─────────────────────────────────────────────────────────────────────────────

const screenVariants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
  center: ({ opacity: 1, x: 0 }),
  exit: (d) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
};

function ScreenContent({ project, direction }) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = screenshotUrl(project.liveUrl);

  useEffect(() => { setLoaded(false); }, [project._id, project.title]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={project._id ?? project.title}
        custom={direction}
        variants={screenVariants}
        initial="enter" animate="center" exit="exit"
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#050510",
          // FIX: overflow hidden ensures nothing bleeds outside the screen area
          overflow: "hidden",
        }}
      >
        {/* Skeleton while image loads */}
        {!loaded && imgSrc && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, #0a0a18 25%, #111128 50%, #0a0a18 75%)",
            backgroundSize: "200% 200%",
            animation: "shimmer 1.5s infinite",
          }} />
        )}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={project.title}
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              // FIX: always cover+top — fills screen, crops bottom if needed
              // This is the correct behaviour for a "browser screenshot in a laptop"
              objectFit: "cover",
              objectPosition: "top center",
              display: "block",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 12, background: "#05050e",
          }}>
            <svg width="48" height="48" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
              <rect x="1" y="1" width="14" height="10" fill="#1a6fff" />
              <rect x="2" y="2" width="12" height="8" fill="#0a0a14" />
              <rect x="3" y="3" width="3" height="1" fill="#f97316" />
              <rect x="3" y="5" width="5" height="1" fill="#4ade80" />
              <rect x="3" y="7" width="4" height="1" fill="#f97316" />
            </svg>
            <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#2a2a3e", letterSpacing: "0.2em" }}>
              NO PREVIEW
            </span>
          </div>
        )}

        {/* Scanlines overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)",
        }} />

        {/* Info bar at bottom of screen */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
          paddingTop: 32, paddingBottom: 10, paddingLeft: 14, paddingRight: 14,
          display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.6rem", color: "#f97316", letterSpacing: "0.18em", margin: "0 0 4px" }}>
              PROJECT_{String(project._displayIndex ?? 1).padStart(2, "0")}
            </p>
            <p style={{
              color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1.2,
              margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {project.title}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px", fontFamily: "monospace", fontSize: "0.55rem",
                fontWeight: 700, letterSpacing: "0.1em", color: "#ccc",
                border: "1px solid #444", borderRadius: 4,
                textDecoration: "none", transition: "color 0.2s, border-color 0.2s",
              }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                CODE
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px", fontFamily: "monospace", fontSize: "0.55rem",
                fontWeight: 700, letterSpacing: "0.1em", color: "#000",
                background: "#f97316", border: "1px solid #f97316", borderRadius: 4,
                textDecoration: "none",
              }}>
                ▶ LIVE
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Film Thumbnail
// ─────────────────────────────────────────────────────────────────────────────

function FilmThumb({ project, isActive, onClick, index }) {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = screenshotUrl(project.liveUrl);

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative", width: "100%", height: 64,
        background: "#05050e", padding: 0, flexShrink: 0,
        overflow: "hidden", borderRadius: 2, cursor: "pointer",
        border: `2px solid ${isActive ? "#f97316" : "#1e1e2e"}`,
        transition: "border-color 0.2s",
        outline: "none",
      }}
    >
      <div style={{ position: "absolute", left: 3, top: 0, bottom: 0, zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 5, background: "#0a0a14", border: "1px solid #1e1e2e", borderRadius: 1 }} />)}
      </div>
      <div style={{ position: "absolute", right: 3, top: 0, bottom: 0, zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 5, background: "#0a0a14", border: "1px solid #1e1e2e", borderRadius: 1 }} />)}
      </div>

      {imgSrc ? (
        <img
          src={imgSrc} alt={project.title}
          onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: "0.5rem", color: "#2a2a3e" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      {isActive && <div style={{ position: "absolute", inset: 0, background: "rgba(249,115,22,0.1)", pointerEvents: "none" }} />}

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
        paddingTop: 16, paddingBottom: 4, paddingLeft: 8, paddingRight: 8,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: "monospace", fontSize: "0.45rem", fontWeight: 700, color: isActive ? "#f97316" : "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
          {project.title}
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "0.42rem", fontWeight: 700, color: isActive ? "#f97316" : "#333", flexShrink: 0 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Film Edge
// ─────────────────────────────────────────────────────────────────────────────

function FilmEdge({ vertical = false }) {
  return (
    <div
      style={{
        flexShrink: 0,
        ...(vertical
          ? { width: 6, alignSelf: "stretch" }
          : { height: 6, width: "100%" }),
        background: vertical
          ? "repeating-linear-gradient(180deg,#1e1e2e 0,#1e1e2e 7px,#0a0a14 7px,#0a0a14 11px)"
          : "repeating-linear-gradient(90deg,#1e1e2e 0,#1e1e2e 7px,#0a0a14 7px,#0a0a14 11px)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Autoplay Bar
// ─────────────────────────────────────────────────────────────────────────────

function AutoplayBar({ progress, paused }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontFamily: "monospace", fontSize: "0.58rem", color: "#555", flexShrink: 0, width: 12 }}>
        {paused ? "⏸" : "▶"}
      </span>
      <div style={{ flex: 1, height: 2, background: "#111", borderRadius: 9999, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "#f97316", borderRadius: 9999 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: "linear" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function Projects({ projects = [] }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  const sectionRef = useRef(null);
  const filmstripRef = useRef(null);
  const progressRef = useRef(null);
  const timeoutRef = useRef(null);

  const items = projects.map((p, i) => ({ ...p, _displayIndex: i + 1 }));
  const total = items.length;

  // Visibility
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

  // Navigation
  const goTo = useCallback((idx, dir) => {
    setDirection(dir); setActive(idx); setProgress(0);
  }, []);

  const next = useCallback(() => goTo((active + 1) % total, 1), [active, total, goTo]);
  const prev = useCallback(() => goTo((active - 1 + total) % total, -1), [active, total, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused || total <= 1) { setProgress(0); return; }
    clearInterval(progressRef.current);
    clearTimeout(timeoutRef.current);
    setProgress(0);
    const step = 100 / (AUTOPLAY_MS / 50);
    progressRef.current = setInterval(() => setProgress(p => Math.min(p + step, 100)), 50);
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setActive(a => (a + 1) % total);
      setProgress(0);
    }, AUTOPLAY_MS);
    return () => { clearInterval(progressRef.current); clearTimeout(timeoutRef.current); };
  }, [active, paused, total]);

  // Auto-scroll filmstrip
  useEffect(() => {
    const strip = filmstripRef.current;
    if (!strip) return;
    const thumb = strip.children[active];
    if (!thumb) return;
    const canScrollY = strip.scrollHeight > strip.clientHeight;
    const canScrollX = strip.scrollWidth > strip.clientWidth;
    if (canScrollY) {
      strip.scrollTo({ top: thumb.offsetTop - strip.clientHeight / 2 + thumb.offsetHeight / 2, behavior: "smooth" });
    } else if (canScrollX) {
      strip.scrollTo({ left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      e.key === "ArrowRight" || e.key === "ArrowDown" ? next() : prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev]);

  if (total === 0) {
    return (
      <section id="projects" style={{ width: "100%", padding: "80px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "#f97316", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.875rem", fontFamily: "monospace" }}>▶ NO PROJECTS FOUND</p>
      </section>
    );
  }

  const current = items[active];

  return (
    <section id="projects" ref={sectionRef} className="w-full px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-8">

        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
            ▸ MY RECENT <span className="text-orange-500">WORKS</span>
          </p>
          <p className="text-gray-500 text-xs font-mono tracking-widest">
            {total} PROJECTS · FILMSTRIP OR ← → KEYS
          </p>
        </motion.div>

        {/* Main layout */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 items-stretch"
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Left/top: Laptop + meta */}
          <div
            className="flex flex-col gap-3 flex-1 min-w-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <LaptopShell>
              <ScreenContent project={current} direction={direction} />
            </LaptopShell>

            <AutoplayBar progress={progress} paused={paused} />

            {/* Description */}
            <div style={{ height: 40, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current._id ?? current.title}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xs text-gray-500 leading-5 line-clamp-2"
                >
                  {current.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Tech tags */}
            <div style={{ height: 24, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={(current._id ?? current.title) + "-tags"}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {(current.techStack ?? []).map(tech => (
                    <span key={tech}
                      className="font-mono text-[0.55rem] font-bold tracking-wider px-2 py-0.5 rounded-sm text-orange-500 bg-orange-500/10 border border-orange-500/20">
                      {tech}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Filmstrip Column */}
          <div className="flex flex-col md:w-36 w-full flex-shrink-0 md:h-2/3">
            <p className="font-mono text-[0.45rem] tracking-[0.2em] text-gray-700 font-bold text-center mb-1.5 hidden md:block">
              FILMSTRIP
            </p>

            <FilmEdge vertical={false} />

            <div
              ref={filmstripRef}
              className="flex-1 bg-[#080810] flex md:flex-col md:overflow-y-auto md:overflow-x-hidden md:py-1.5 md:px-1 flex-row overflow-x-auto overflow-y-hidden py-2 px-2 gap-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((p, i) => (
                <div key={p._id ?? i} className="md:w-full w-32 flex-shrink-0">
                  <FilmThumb
                    project={p} index={i}
                    isActive={active === i}
                    onClick={() => goTo(i, i > active ? 1 : -1)}
                  />
                </div>
              ))}
            </div>

            <FilmEdge vertical={false} />

            <div className="hidden md:flex justify-between mt-2">
              <button onClick={prev} className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer" aria-label="Previous">▲</button>
              <span className="font-mono text-[0.5rem] text-gray-700 self-center tracking-wider">
                {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
              <button onClick={next} className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer" aria-label="Next">▼</button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        #projects ::-webkit-scrollbar { display: none; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}