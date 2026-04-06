"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AUTOPLAY_MS = 6000;

// ─────────────────────────────────────────────────────────────────────────────
// Memoize screenshot URLs — computed ONCE per project list, never regenerated
// ─────────────────────────────────────────────────────────────────────────────

function buildScreenshotUrl(url) {
  if (!url) return null;
  return `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS Laptop Shell — no SVG foreignObject, works on all real devices
// ─────────────────────────────────────────────────────────────────────────────

function LaptopShell({ children }) {
  return (
    <div className="relative w-full select-none" style={{ fontFamily: "inherit" }}>
      {/* Lid */}
      <div
        style={{
          background: "#111118",
          border: "2px solid #2a2a3a",
          borderRadius: "10px 10px 4px 4px",
          padding: "10px 10px 8px",
          position: "relative",
        }}
      >
        {/* Camera dot */}
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#222230",
            margin: "0 auto 6px",
          }}
        />
        {/* Screen bezel */}
        <div
          style={{
            background: "#050510",
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
            /* 16:10 aspect ratio — close to real laptop screens */
            aspectRatio: "16 / 10",
            border: "1px solid rgba(249,115,22,0.15)",
          }}
        >
          {children}
          {/* Scanlines overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)",
              zIndex: 2,
            }}
          />
        </div>
      </div>

      {/* Hinge strip */}
      <div
        style={{
          height: 6,
          background: "#18181f",
          borderRadius: "0 0 2px 2px",
          border: "1px solid #222232",
          borderTop: "none",
        }}
      />

      {/* Base / keyboard */}
      <div
        style={{
          background: "#141420",
          border: "1.5px solid #222232",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "8px 10px 6px",
        }}
      >
        {/* Keyboard rows */}
        {[14, 13, 12, 11].map((cols, row) => (
          <div
            key={row}
            style={{
              display: "flex",
              gap: 3,
              marginBottom: row < 3 ? 3 : 0,
              justifyContent: "center",
            }}
          >
            {Array.from({ length: cols }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 5,
                  maxWidth: 28,
                  background: "#1c1c2a",
                  border: "0.5px solid #252535",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
        ))}
        {/* Trackpad */}
        <div
          style={{
            width: "35%",
            height: 10,
            background: "#1a1a28",
            border: "0.5px solid #252535",
            borderRadius: 3,
            margin: "5px auto 0",
          }}
        />
      </div>

      {/* Feet */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
        <div style={{ width: 20, height: 3, background: "#0a0a12", borderRadius: "0 0 3px 3px" }} />
        <div style={{ width: 20, height: 3, background: "#0a0a12", borderRadius: "0 0 3px 3px" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Screen Content
// ─────────────────────────────────────────────────────────────────────────────

const screenVariants = {
  enter: (d) => ({ opacity: 0, x: d > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d > 0 ? -32 : 32 }),
};

function ScreenContent({ project, direction, imgSrc }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setLoaded(false); }, [project._id, project.title]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={project._id ?? project.title}
        custom={direction}
        variants={screenVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: "absolute", inset: 0, background: "#050510" }}
      >
        {imgSrc ? (
          <>
            {!loaded && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#0a0a18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: "2px solid #f97316",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}
            <img
              src={imgSrc}
              alt={project.title}
              onLoad={() => setLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.4s",
              }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.65rem",
                color: "#2a2a3e",
                letterSpacing: "0.2em",
              }}
            >
              NO PREVIEW
            </span>
          </div>
        )}

        {/* Info bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)",
            paddingTop: 28,
            paddingBottom: 8,
            paddingLeft: 10,
            paddingRight: 10,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 8,
            zIndex: 3,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "0.58rem",
                color: "#f97316",
                letterSpacing: "0.18em",
                margin: "0 0 2px",
              }}
            >
              PROJECT_{String(project._displayIndex ?? 1).padStart(2, "0")}
            </p>
            <p
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.95rem",
                lineHeight: 1.2,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {project.title}
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  fontFamily: "monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#d1d5db",
                  border: "1px solid #4b5563",
                  borderRadius: 3,
                  textDecoration: "none",
                }}
              >
                CODE
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  fontFamily: "monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#000",
                  background: "#f97316",
                  border: "1px solid #f97316",
                  borderRadius: 3,
                  textDecoration: "none",
                }}
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

// ─────────────────────────────────────────────────────────────────────────────
// Film Thumbnail
// ─────────────────────────────────────────────────────────────────────────────

function FilmThumb({ project, isActive, onClick, index, imgSrc }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height: 64,
        background: "#05050e",
        border: `2px solid ${isActive ? "#f97316" : "#1e1e2e"}`,
        borderRadius: 2,
        padding: 0,
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
        outline: "none",
        transition: "border-color 0.15s",
      }}
    >
      {/* Sprocket holes */}
      {[0, 1, 2].map((i) => (
        <div
          key={`l${i}`}
          style={{
            position: "absolute",
            left: 3,
            top: `${20 + i * 30}%`,
            width: 4,
            height: 5,
            background: "#0a0a14",
            border: "0.5px solid #1e1e2e",
            borderRadius: 1,
            zIndex: 2,
          }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <div
          key={`r${i}`}
          style={{
            position: "absolute",
            right: 3,
            top: `${20 + i * 30}%`,
            width: 4,
            height: 5,
            background: "#0a0a14",
            border: "0.5px solid #1e1e2e",
            borderRadius: 1,
            zIndex: 2,
          }}
        />
      ))}

      {imgSrc ? (
        <img
          src={imgSrc}
          alt={project.title}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            fontSize: "0.5rem",
            color: "#2a2a3e",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      )}

      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(249,115,22,0.1)",
            pointerEvents: "none",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
          paddingTop: 12,
          paddingBottom: 3,
          paddingLeft: 6,
          paddingRight: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.42rem",
            fontWeight: 700,
            color: isActive ? "#f97316" : "#4b4b6e",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "75%",
          }}
        >
          {project.title}
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.4rem",
            fontWeight: 700,
            color: isActive ? "#f97316" : "#333",
            flexShrink: 0,
          }}
        >
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
          ? {
              width: 6,
              height: "100%",
              background:
                "repeating-linear-gradient(180deg,#1e1e2e 0,#1e1e2e 7px,#0a0a14 7px,#0a0a14 11px)",
            }
          : {
              height: 6,
              width: "100%",
              background:
                "repeating-linear-gradient(90deg,#1e1e2e 0,#1e1e2e 7px,#0a0a14 7px,#0a0a14 11px)",
            }),
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Autoplay Bar
// ─────────────────────────────────────────────────────────────────────────────

function AutoplayBar({ progress, paused }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: "0.58rem",
          color: "#4b5563",
          flexShrink: 0,
          width: 12,
        }}
      >
        {paused ? "⏸" : "▶"}
      </span>
      <div
        style={{
          flex: 1,
          height: 2,
          background: "#111",
          borderRadius: 9999,
          overflow: "hidden",
        }}
      >
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

  const items = useMemo(
    () => projects.map((p, i) => ({ ...p, _displayIndex: i + 1 })),
    [projects]
  );

  // ── Memoize ALL screenshot URLs once — never regenerated on re-renders ──
  const screenshotUrls = useMemo(
    () => items.map((p) => buildScreenshotUrl(p.liveUrl)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.map((p) => p.liveUrl).join(",")]
  );

  const total = items.length;

  // Visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Navigation
  const goTo = useCallback((idx, dir) => {
    setDirection(dir);
    setActive(idx);
    setProgress(0);
  }, []);

  const next = useCallback(() => goTo((active + 1) % total, 1), [active, total, goTo]);
  const prev = useCallback(
    () => goTo((active - 1 + total) % total, -1),
    [active, total, goTo]
  );

  // Autoplay
  useEffect(() => {
    if (paused || total <= 1) {
      setProgress(0);
      return;
    }
    clearInterval(progressRef.current);
    clearTimeout(timeoutRef.current);
    setProgress(0);
    const step = 100 / (AUTOPLAY_MS / 50);
    progressRef.current = setInterval(
      () => setProgress((p) => Math.min(p + step, 100)),
      50
    );
    timeoutRef.current = setTimeout(() => {
      setDirection(1);
      setActive((a) => (a + 1) % total);
      setProgress(0);
    }, AUTOPLAY_MS);
    return () => {
      clearInterval(progressRef.current);
      clearTimeout(timeoutRef.current);
    };
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
      strip.scrollTo({
        top: thumb.offsetTop - strip.clientHeight / 2 + thumb.offsetHeight / 2,
        behavior: "smooth",
      });
    } else if (canScrollX) {
      strip.scrollTo({
        left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,
        behavior: "smooth",
      });
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
      <section
        id="projects"
        className="w-full py-20 flex justify-center items-center"
      >
        <p className="text-orange-500 font-bold tracking-widest text-sm font-mono">
          ▶ NO PROJECTS FOUND
        </p>
      </section>
    );
  }

  const current = items[active];
  const currentImgSrc = screenshotUrls[active];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full px-4 sm:px-6 lg:px-8 py-16 flex justify-center"
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        #projects ::-webkit-scrollbar { display: none; }
      `}</style>

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
              {/* Screen area — ScreenContent uses position:absolute, so we need
                  a positioned parent. The aspect-ratio on the bezel div inside
                  LaptopShell handles sizing — ScreenContent fills it via inset:0 */}
              <ScreenContent
                project={current}
                direction={direction}
                imgSrc={currentImgSrc}
              />
            </LaptopShell>

            <AutoplayBar progress={progress} paused={paused} />

            {/* Description */}
            <div style={{ height: 40, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current._id ?? current.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap gap-1.5"
                >
                  {(current.techStack ?? []).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[0.55rem] font-bold tracking-wider px-2 py-0.5 rounded-sm text-orange-500 bg-orange-500/10 border border-orange-500/20"
                    >
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
                    imgSrc={screenshotUrls[i]}
                  />
                </div>
              ))}
            </div>

            <FilmEdge vertical={false} />

            {/* Nav buttons — desktop only */}
            <div className="hidden md:flex justify-between mt-2">
              <button
                onClick={prev}
                className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer"
                aria-label="Previous project"
              >
                ▲
              </button>
              <span className="font-mono text-[0.5rem] text-gray-700 self-center tracking-wider">
                {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
              <button
                onClick={next}
                className="font-mono text-[0.65rem] text-gray-600 hover:text-orange-400 transition-colors px-3 py-1 bg-transparent border-none cursor-pointer"
                aria-label="Next project"
              >
                ▼
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
