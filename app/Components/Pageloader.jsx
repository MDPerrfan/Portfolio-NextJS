"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Pixel Mario running across the screen ───────────────────────────────────

function RunningMario({ progress }) {
  const x = `${progress * 100}%`;
  return (
    <div className="absolute bottom-[52px]" style={{ left: x, transform: "translateX(-50%)" }}>
      <div className={progress < 1 ? "mario-run" : "mario-idle"}>
        <svg width="32" height="40" viewBox="0 0 16 20" style={{ imageRendering: "pixelated" }}>
          <rect x="3" y="0" width="8" height="2" fill="#e52222" />
          <rect x="2" y="2" width="10" height="2" fill="#e52222" />
          <rect x="2" y="4" width="9" height="1" fill="#f5c07a" />
          <rect x="1" y="5" width="11" height="3" fill="#f5c07a" />
          <rect x="3" y="5" width="2" height="1" fill="#111" />
          <rect x="8" y="5" width="2" height="1" fill="#111" />
          <rect x="2" y="7" width="10" height="1" fill="#7a3b00" />
          <rect x="1" y="8" width="5" height="1" fill="#7a3b00" />
          <rect x="8" y="8" width="5" height="1" fill="#7a3b00" />
          <rect x="1" y="9" width="12" height="4" fill="#1a6fff" />
          <rect x="0" y="10" width="14" height="2" fill="#e52222" />
          <rect x="3" y="9" width="2" height="1" fill="#f5e642" />
          <rect x="9" y="9" width="2" height="1" fill="#f5e642" />
          <rect x="1" y="13" width="5" height="2" fill="#1a6fff" />
          <rect x="8" y="13" width="5" height="2" fill="#1a6fff" />
          <rect x="0" y="14" width="6" height="2" fill="#7a3b00" />
          <rect x="8" y="14" width="6" height="2" fill="#7a3b00" />
          <rect x="0" y="9" width="1" height="3" fill="#f5c07a" />
          <rect x="13" y="9" width="1" height="3" fill="#f5c07a" />
        </svg>
      </div>
    </div>
  );
}

// ─── Pixel Ground ────────────────────────────────────────────────────────────

function PixelGround() {
  return (
    <div className="w-full h-12 relative flex-shrink-0">
      {/* Ground top row - grass */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#5cb85c]"
        style={{ borderTop: "3px solid #3d8b3d" }} />
      {/* Ground body */}
      <div className="absolute top-3 left-0 right-0 bottom-0 bg-[#c8a46e]"
        style={{ borderTop: "3px solid #a07840" }} />
      {/* Brick pattern */}
      <div className="absolute top-3 left-0 right-0 bottom-0 ground-bricks" />
    </div>
  );
}

// ─── Pixel Cloud ─────────────────────────────────────────────────────────────

function PixelCloud({ style }) {
  return (
    <div style={style} className="absolute">
      <svg width="64" height="32" viewBox="0 0 16 8" style={{ imageRendering: "pixelated" }}>
        <rect x="4" y="4" width="8" height="4" fill="white" opacity="0.9" />
        <rect x="2" y="5" width="12" height="3" fill="white" opacity="0.9" />
        <rect x="5" y="2" width="5" height="4" fill="white" opacity="0.9" />
        <rect x="3" y="3" width="4" height="3" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

// ─── Boot messages ────────────────────────────────────────────────────────────

const BOOT_STEPS = [
  { text: "INITIALIZING PARVES.EXE...",      pct: 10 },
  { text: "LOADING SKILL TREE...",            pct: 25 },
  { text: "SPAWNING PROJECTS...",             pct: 42 },
  { text: "EQUIPPING MERN STACK...",          pct: 58 },
  { text: "CONNECTING TO GITHUB...",          pct: 72 },
  { text: "CALIBRATING PIXEL ENGINE...",      pct: 85 },
  { text: "ALL SYSTEMS GO ✓",                 pct: 100 },
];

// ─── Coin counter ─────────────────────────────────────────────────────────────

function CoinCounter({ count }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="0" width="4" height="1" fill="#f5e642" />
        <rect x="1" y="1" width="6" height="1" fill="#f5e642" />
        <rect x="0" y="2" width="8" height="4" fill="#f5e642" />
        <rect x="1" y="6" width="6" height="1" fill="#f5e642" />
        <rect x="2" y="7" width="4" height="1" fill="#f5e642" />
      </svg>
      <span className="text-[#f5e642] font-black text-sm tracking-widest">
        ×{String(count).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Main Loader ──────────────────────────────────────────────────────────────

export default function PageLoader({ onComplete }) {
  const [stepIdx, setStepIdx]       = useState(0);
  const [progress, setProgress]     = useState(0);
  const [coins, setCoins]           = useState(0);
  const [visible, setVisible]       = useState(true);
  const [showReady, setShowReady]   = useState(false);
  const [blinkOn, setBlinkOn]       = useState(true);

  // Step through boot messages
  useEffect(() => {
    if (stepIdx >= BOOT_STEPS.length) return;
    const delay = stepIdx === 0 ? 400 : 480;
    const t = setTimeout(() => {
      setProgress(BOOT_STEPS[stepIdx].pct / 100);
      setCoins((c) => c + 3);
      if (stepIdx < BOOT_STEPS.length - 1) {
        setStepIdx((i) => i + 1);
      } else {
        // all done
        setTimeout(() => setShowReady(true), 400);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 1800);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [stepIdx]);

  // Blink cursor
  useEffect(() => {
    const t = setInterval(() => setBlinkOn((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
          style={{ background: "#5c94fc" }} // mario sky blue
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Sky / Scene ── */}
          <div className="flex-1 relative overflow-hidden">

            {/* Clouds */}
            <PixelCloud style={{ top: "12%", left: "8%",  animation: "cloudDrift 18s linear infinite" }} />
            <PixelCloud style={{ top: "20%", left: "55%", animation: "cloudDrift 24s linear infinite", opacity: 0.85 }} />
            <PixelCloud style={{ top: "8%",  left: "80%", animation: "cloudDrift 20s linear infinite", opacity: 0.7 }} />

            {/* HUD — top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3"
              style={{ background: "rgba(0,0,0,0.35)", borderBottom: "3px solid rgba(0,0,0,0.3)" }}>
              <span className="text-white font-black text-sm tracking-[0.2em] drop-shadow">
                PARVES
              </span>
              <CoinCounter count={coins} />
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-sm tracking-[0.2em] drop-shadow">
                  WORLD 1-1
                </span>
              </div>
            </div>

            {/* Center console */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="flex flex-col gap-3 px-8 py-6 w-full max-w-md mx-4"
                style={{
                  background: "rgba(0,0,0,0.72)",
                  border: "4px solid #f97316",
                  boxShadow: "6px 6px 0 #111, 8px 8px 0 #f9731644",
                  imageRendering: "pixelated",
                }}
              >
                {/* Title */}
                <div className="text-center mb-1">
                  <p className="text-orange-500 font-black text-xl tracking-[0.25em] mb-0">
                    PORTFOLIO
                  </p>
                  <p className="text-white font-black text-[0.65rem] tracking-[0.3em] text-gray-400">
                    © 2025 MOHAMMED PARVES  ·  VER 1.0
                  </p>
                </div>

                {/* Pixel divider */}
                <div style={{
                  height: 3,
                  background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 6px, transparent 6px, transparent 10px)"
                }} />

                {/* Boot log */}
                <div className="flex flex-col gap-1 min-h-[120px]">
                  {BOOT_STEPS.slice(0, stepIdx + 1).map((step, i) => (
                    <motion.p
                      key={i}
                      className="text-[0.65rem] font-bold tracking-wider m-0"
                      style={{ color: i === stepIdx ? "#f97316" : "#4ade80" }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {i < stepIdx ? "✓ " : "▶ "}
                      {step.text}
                      {i === stepIdx && blinkOn && !showReady && (
                        <span className="inline-block w-2 h-3 bg-orange-500 ml-1 align-middle" />
                      )}
                    </motion.p>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-[0.58rem] text-gray-500 font-bold tracking-widest">LOADING</span>
                    <span className="text-[0.58rem] text-orange-500 font-black">
                      {Math.round(progress * 100)}%
                    </span>
                  </div>
                  <div
                    className="w-full h-4 relative overflow-hidden"
                    style={{ background: "#1e1e2e", border: "2px solid #333" }}
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0"
                      style={{ background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 10px, #c2410c 10px, #c2410c 14px)" }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* PRESS START */}
                <AnimatePresence>
                  {showReady && (
                    <motion.p
                      className="text-center text-orange-400 font-black text-sm tracking-[0.3em] mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ animation: "readyBlink 0.6s step-end infinite" }}
                    >
                      ▶ PRESS START
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Ground strip with Mario ── */}
          <div className="relative flex-shrink-0">
            <RunningMario progress={progress} />
            <PixelGround />
          </div>

          <style>{`
            @keyframes cloudDrift {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-120vw); }
            }
            .mario-run {
              animation: marioRun 0.3s steps(2) infinite;
            }
            @keyframes marioRun {
              0%   { transform: scaleX(1)  translateY(0); }
              50%  { transform: scaleX(1)  translateY(-3px); }
              100% { transform: scaleX(1)  translateY(0); }
            }
            .mario-idle {
              animation: idleBob 1s ease-in-out infinite;
            }
            @keyframes idleBob {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(-4px); }
            }
            @keyframes readyBlink {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            .ground-bricks {
              background: repeating-linear-gradient(
                90deg,
                rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px,
                transparent 1px, transparent 24px
              ),
              repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px,
                transparent 1px, transparent 12px
              );
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}