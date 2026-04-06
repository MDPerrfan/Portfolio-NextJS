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
// ─────────────────────────────────────────────────────────────────────────────

function LaptopShell({ children }) {
  return (
    <div className="relative w-full select-none">
      <svg
        viewBox="0 0 860 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
      >
        <rect x="60" y="10" width="740" height="460" rx="14" fill="#111118" stroke="#2a2a3a" strokeWidth="2" />
        <rect x="80" y="28" width="700" height="424" rx="6" fill="#080810" />
        <circle cx="430" cy="21" r="4" fill="#222230" />
        <circle cx="430" cy="21" r="2" fill="#1a1a28" />
        <rect x="80" y="28" width="700" height="424" rx="6" fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2" />
        <rect x="56" y="468" width="748" height="10" rx="3" fill="#18181f" />
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
        <rect x="330" y="508" width="200" height="14" rx="4" fill="#1a1a28" stroke="#252535" strokeWidth="1" />
        <path d="M60 528 L800 528 L790 536 L70 536 Z" fill="#0e0e18" />
        <rect x="100" y="534" width="30" height="4" rx="2" fill="#0a0a12" />
        <rect x="760" y="534" width="30" height="4" rx="2" fill="#0a0a12" />
        <foreignObject x="80" y="28" width="700" height="424">
          <div xmlns="http://www.w3.org/1999/xhtml"
            style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: 6 }}>
            {children}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen Content — parent must have position:relative + explicit size
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
        className="absolute inset-0 bg-[#050510]"
      >
        {!loaded && imgSrc && (
          <div className="absolute inset-0 bg-[#0a0a18]" />
        )}

        {imgSrc ? (
          <img
            src={imgSrc} alt={project.title}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-contain md:object-cover object-top block transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#05050e]">
            <svg width="48" height="48" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
              <rect x="1" y="1" width="14" height="10" fill="#1a6fff" />
              <rect x="2" y="2" width="12" height="8" fill="#0a0a14" />
              <rect x="3" y="3" width="3" height="1" fill="#f97316" />
              <rect x="3" y="5" width="5" height="1" fill="#4ade80" />
              <rect x="3" y="7" width="4" height="1" fill="#f97316" />
            </svg>
            <span className="font-mono text-[0.7rem] text-[#2a2a3e] tracking-widest">NO PREVIEW</span>
          </div>
        )}

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px)" }}
        />

        {/* Info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent pt-8 pb-3 px-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] text-orange-500 tracking-[0.18em] mb-1">
              PROJECT_{String(project._displayIndex ?? 1).padStart(2, "0")}
            </p>
            <p className="text-white font-extrabold text-lg leading-tight truncate">{project.title}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] font-bold tracking-widest text-gray-300 border border-gray-600 rounded no-underline hover:border-orange-500 hover:text-orange-500 transition-colors">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                CODE
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-[0.6rem] font-bold tracking-widest text-black bg-orange-500 border border-orange-500 rounded no-underline hover:bg-orange-400 transition-colors">
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
      className={`
        relative flex-shrink-0 overflow-hidden rounded-sm border-2 cursor-pointer
        transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500
        ${isActive ? "border-orange-500" : "border-[#1e1e2e] hover:border-orange-500/40"}
      `}
      /* Fixed size: vertical on desktop, horizontal on mobile */
      style={{ width: "100%", height: 64, background: "#05050e", padding: 0 }}
    >
      {/* Sprocket holes — left/right on desktop thumb (vertical strip) */}
      <div className="absolute left-1 inset-y-0 z-10 flex flex-col justify-around">
        {[0, 1, 2].map(i => <div key={i} className="w-[4px] h-[5px] bg-[#0a0a14] border border-[#1e1e2e] rounded-sm" />)}
      </div>
      <div className="absolute right-1 inset-y-0 z-10 flex flex-col justify-around">
        {[0, 1, 2].map(i => <div key={i} className="w-[4px] h-[5px] bg-[#0a0a14] border border-[#1e1e2e] rounded-sm" />)}
      </div>

      {imgSrc ? (
        <img
          src={imgSrc} alt={project.title}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover object-top transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-[0.5rem] text-[#2a2a3e]">
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      {isActive && <div className="absolute inset-0 bg-orange-500/10 pointer-events-none" />}

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent pt-4 pb-1 px-2 flex items-end justify-between">
        <span className={`font-mono text-[0.45rem] font-bold truncate max-w-[75%] ${isActive ? "text-orange-500" : "text-gray-600"}`}>
          {project.title}
        </span>
        <span className={`font-mono text-[0.42rem] font-bold flex-shrink-0 ${isActive ? "text-orange-500" : "text-[#333]"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Film Edge
// ─────────────────────────────────────────────────────────────────────────────

function FilmEdge({ vertical = false, hideOnMobile = false }) {
  return (
    <div
      className={`flex-shrink-0 ${hideOnMobile ? "hidden md:block" : ""} ${vertical ? "w-[6px] h-full" : "h-[6px] w-full"
        }`}
      style={{
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
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.58rem] text-gray-700 flex-shrink-0 w-3">
        {paused ? "⏸" : "▶"}
      </span>
      <div className="flex-1 h-[2px] bg-[#111] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange-500 rounded-full"
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

  // Auto-scroll filmstrip — works for both vertical (desktop) and horizontal (mobile)
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
      <section id="projects" className="w-full py-20 flex justify-center items-center">
        <p className="text-orange-500 font-bold tracking-widest text-sm font-mono">▶ NO PROJECTS FOUND</p>
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

        {/* ── Main layout ─────────────────────────────────────────────────────
            Desktop (md+): laptop left | filmstrip right (vertical)
            Mobile:        laptop top  | filmstrip bottom (horizontal)
        ──────────────────────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 items-stretch"
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >

          {/* ── Left / top: Laptop + meta ── */}
          <div
            className="flex flex-col gap-3 flex-1 min-w-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* KEY FIX: wrap laptop in a relative container with explicit aspect
                ratio so ScreenContent's absolute children always have a size.
                The SVG viewBox is 860:560 ≈ 61.5/40 ratio but the base/keyboard
                uses the bottom ~100px, so screen ≈ 424/560 of total height.
                Using aspect-[860/560] on the wrapper keeps it stable. */}
            <div className="relative w-full aspect-[860/560]">
              {/* LaptopShell is position:relative w-full so it fills the parent */}
              <div className="absolute inset-0">
                <LaptopShell>
                  <ScreenContent project={current} direction={direction} />
                </LaptopShell>
              </div>
            </div>

            {/* Autoplay bar */}
            <AutoplayBar progress={progress} paused={paused} />

            {/* Description — exactly 2 lines, never shifts */}
            <div className="h-10 overflow-hidden">
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

            {/* Tech tags — exactly 1 line height, never shifts */}
            <div className="h-6 overflow-hidden">
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

          {/* ── Fixed Filmstrip Column ── */}
          <div className="flex flex-col md:w-36 w-full flex-shrink-0 md:h-2/3">
            <p className="font-mono text-[0.45rem] tracking-[0.2em] text-gray-700 font-bold text-center mb-1.5 hidden md:block">
              FILMSTRIP
            </p>

            {/* Top/Left Edge: Vertical on desktop, Horizontal on mobile */}
            <FilmEdge vertical={false} />

            {/* Scrollable thumbnails container */}
            <div
              ref={filmstripRef}
              className="
                flex-1 bg-[#080810] flex
                md:flex-col md:overflow-y-auto md:overflow-x-hidden md:py-1.5 md:px-1
                flex-row overflow-x-auto overflow-y-hidden py-2 px-2
                gap-2
              "
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {items.map((p, i) => (
                <div
                  key={p._id ?? i}
                  className="md:w-full w-32 flex-shrink-0"
                >
                  <FilmThumb
                    project={p}
                    index={i}
                    isActive={active === i}
                    onClick={() => goTo(i, i > active ? 1 : -1)}
                  />
                </div>
              ))}
            </div>

            {/* Bottom/Right Edge: Vertical on desktop, Horizontal on mobile */}
            <FilmEdge vertical={false} />

            {/* Nav buttons — only visible on desktop */}
            <div className="hidden md:flex justify-between mt-2">
              <button
                onClick={prev}
                className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer"
                aria-label="Previous project"
              >▲</button>
              <span className="font-mono text-[0.5rem] text-gray-700 self-center tracking-wider">
                {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
              <button
                onClick={next}
                className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer"
                aria-label="Next project"
              >▼</button>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        #projects ::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}