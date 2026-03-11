"use client";

import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

// ─── 8-bit Loader ─────────────────────────────────────────────────────────────

function PixelSpinner() {
  return (
    <div className="relative w-10 h-10" aria-label="Loading">
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`pixel-dot dot-${i} absolute w-2 h-2 bg-orange-500 rounded-sm`} />
      ))}
    </div>
  );
}

function CoinRow() {
  return (
    <div className="flex gap-2 items-end">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="pixel-coin" style={{ animationDelay: `${i * 0.18}s` }}>
          <svg width="24" height="24" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
            <rect x="2" y="0" width="4" height="1" fill="#f5e642" />
            <rect x="1" y="1" width="6" height="1" fill="#f5e642" />
            <rect x="0" y="2" width="8" height="4" fill="#f5e642" />
            <rect x="1" y="6" width="6" height="1" fill="#f5e642" />
            <rect x="2" y="7" width="4" height="1" fill="#f5e642" />
            <rect x="2" y="3" width="1" height="2" fill="#c8a800" />
            <rect x="3" y="2" width="2" height="1" fill="#c8a800" />
            <rect x="3" y="5" width="2" height="1" fill="#c8a800" />
          </svg>
        </div>
      ))}
    </div>
  );
}

function PixelLoadingCard() {
  return (
    <div className="bg-[#0e0e1a] border-[3px] border-[#222] rounded-sm px-4 py-5
                    flex flex-col items-center justify-center gap-3 min-h-280px
                    shadow-[4px_4px_0_#111]">
      <div className="flex flex-col items-center gap-3">
        <PixelSpinner />
        <CoinRow />
        <p className="text-orange-500 text-[0.7rem] font-bold tracking-[0.15em] m-0">
          LOADING<span className="ellipsis-blink">...</span>
        </p>
      </div>
      <div className="w-4/5 h-2 rounded-sm plc-bar" />
      <div className="w-3/5 h-2 rounded-sm plc-bar" style={{ animationDelay: "0.3s" }} />
      <div className="flex gap-3">
        <div className="w-16 h-5 bg-[#1e1e3a] border-2 border-[#333] rounded-sm plc-bar" style={{ animationDelay: "0.1s" }} />
        <div className="w-16 h-5 bg-[#1e1e3a] border-2 border-[#333] rounded-sm plc-bar" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      className="bg-[#0e0e1a] border-[3px] border-[#333] rounded-sm overflow-hidden
                 flex flex-col cursor-pointer
                 shadow-[4px_4px_0_#111,6px_6px_0_#f97316]
                 hover:shadow-[6px_6px_0_#111,8px_8px_0_#f97316]
                 hover:-translate-x-0.5 hover:-translate-y-0.5
                 transition-all duration-150"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-video bg-[#050510] overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050510]">
            <PixelSpinner />
          </div>
        )}
        <img
          src={item.image}
          alt={item.title}
          className={`w-full h-full object-cover block transition-all duration-300
                      ${hovered ? "scale-105" : "scale-100"}
                      ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0 pointer-events-none z-1 scanlines" />
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center z-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-orange-500 text-sm font-bold tracking-widest blink">
                ▶ VIEW PROJECT
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pixel strip */}
      <div className="h-1 pixel-strip" />

      {/* Info */}
      <div className="px-4 pt-3 pb-2 flex-1">
        <h3 className="text-white font-bold text-base tracking-wide mb-2">{item.title}</h3>
        <p className="text-gray-500 text-[0.82rem] leading-relaxed line-clamp-3 m-0">
          {item.description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 px-4 pb-4 pt-2">
        {item.githubLink && (
<a
        href = { item.githubLink }
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5
        text-[0.75rem] font-bold tracking-wide no-underline
        text-gray-300 bg-transparent
        outline-2 outline-[#333] rounded-sm
        shadow-[3px_3px_0_#333]
        hover:text-white hover:shadow-[4px_4px_0_#555]
        hover:-translate-y-0.5 active:translate-y-px
        active:shadow-none transition-all duration-100"
  >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        GitHub
      </a>
)}
      <a
        href={item.demoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-3 py-1.5
                     text-[0.75rem] font-bold tracking-wide no-underline
                     text-black bg-orange-500
                      outline-2 outline-[#333] rounded-sm
                     shadow-[3px_3px_0_#c2410c]
                     hover:bg-orange-400 hover:shadow-[4px_4px_0_#c2410c]
                     hover:-translate-y-0.5 active:translate-y-px
                     active:shadow-none transition-all duration-100"
      >
        ▶ Demo
      </a>
    </div>
    </motion.div >
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Projects() {
  const { projectData, loading } = useContext(AppContext);

  return (
    <section id="projects" className="w-full min-h-screen px-6 py-20 flex justify-center">
      <div className="w-full max-w-6xl">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-2xl md:text-4xl font-extrabold tracking-widest mb-2">
            ▸ MY RECENT <span className="text-orange-500">WORKS</span>
          </p>
          <p className="text-gray-500 text-base m-0">
            Here are a few projects I've worked on recently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <PixelLoadingCard key={i} />)
            : projectData
              .slice()
              .reverse()
              .map((item, i) => <ProjectCard key={i} item={item} index={i} />)
          }
        </div>
      </div>

      {/* Only things Tailwind truly can't handle: keyframes, repeating-gradients, step-end */}
      <style>{`
        .blink { animation: blink 0.9s step-end infinite; }
        .ellipsis-blink { animation: blink 0.8s step-end infinite; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .scanlines {
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px
          );
        }
        .pixel-strip {
          background: repeating-linear-gradient(
            90deg,
            #f97316 0px, #f97316 8px,
            #0e0e1a 8px, #0e0e1a 12px
          );
        }
        .plc-bar {
          background: repeating-linear-gradient(
            90deg,
            #1e1e3a 0px, #1e1e3a 12px,
            #2a2a4a 12px, #2a2a4a 24px
          );
          animation: barScan 1.4s linear infinite;
        }
        @keyframes barScan {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .pixel-coin { animation: coinBounce 0.6s ease-in-out infinite alternate; }
        @keyframes coinBounce {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        .pixel-dot { animation: spinFade 1s step-end infinite; }
        .dot-0 { top: 0;    left: 16px; animation-delay: 0s; }
        .dot-1 { top: 5px;  left: 28px; animation-delay: 0.125s; }
        .dot-2 { top: 16px; left: 32px; animation-delay: 0.25s; }
        .dot-3 { top: 28px; left: 28px; animation-delay: 0.375s; }
        .dot-4 { top: 32px; left: 16px; animation-delay: 0.5s; }
        .dot-5 { top: 28px; left: 5px;  animation-delay: 0.625s; }
        .dot-6 { top: 16px; left: 0;    animation-delay: 0.75s; }
        .dot-7 { top: 5px;  left: 5px;  animation-delay: 0.875s; }
        @keyframes spinFade {
          0%   { opacity: 1; }
          12%  { opacity: 0.15; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </section>
  );
}