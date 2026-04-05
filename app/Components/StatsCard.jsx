"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ─── Pixel Avatar ─────────────────────────────────────────────────────────────

function PixelAvatar() {
  return (
    <svg width="64" height="80" viewBox="0 0 16 20" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="0" width="10" height="2" fill="#3b1f0a" />
      <rect x="2" y="1" width="12" height="3" fill="#3b1f0a" />
      <rect x="2" y="3" width="12" height="5" fill="#f5c07a" />
      <rect x="4" y="5" width="2" height="1" fill="#111" />
      <rect x="10" y="5" width="2" height="1" fill="#111" />
      <rect x="3" y="4" width="4" height="3" fill="none" stroke="#555" strokeWidth="0.4" />
      <rect x="9" y="4" width="4" height="3" fill="none" stroke="#555" strokeWidth="0.4" />
      <rect x="7" y="5" width="2" height="1" fill="#555" />
      <rect x="5" y="7" width="6" height="1" fill="#c07a3b" />
      <rect x="4" y="6" width="1" height="1" fill="#c07a3b" />
      <rect x="11" y="6" width="1" height="1" fill="#c07a3b" />
      <rect x="1" y="8" width="14" height="6" fill="#1a6fff" />
      <rect x="0" y="9" width="16" height="4" fill="#1560e8" />
      <rect x="5" y="11" width="6" height="3" fill="#1254cc" />
      <rect x="0" y="8" width="1" height="5" fill="#f5c07a" />
      <rect x="15" y="8" width="1" height="5" fill="#f5c07a" />
      <rect x="0" y="13" width="2" height="1" fill="#f5c07a" />
      <rect x="14" y="13" width="2" height="1" fill="#f5c07a" />
      <rect x="2" y="13" width="12" height="1" fill="#555" />
      <rect x="3" y="14" width="10" height="5" fill="#222" />
      <rect x="4" y="15" width="8" height="3" fill="#0e1a2e" />
      <rect x="4" y="15" width="5" height="1" fill="#f97316" />
      <rect x="4" y="16" width="3" height="1" fill="#22d3ee" />
      <rect x="4" y="17" width="6" height="1" fill="#a78bfa" />
      <rect x="2" y="19" width="12" height="1" fill="#444" />
    </svg>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value, color, delay }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  const blocks = Math.round((value / 100) * 8);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.58rem] font-black tracking-wide text-gray-500 w-16 flex-shrink-0 uppercase">
        {label}
      </span>
      <div className="flex gap-[2px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-[8px] h-[8px] rounded-sm"
            style={{ background: filled && i < blocks ? color : "#1e1e2e" }}
            initial={{ scale: 0 }}
            animate={filled && i < blocks ? { scale: 1 } : { scale: 0.5 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
          />
        ))}
      </div>
      <span className="text-[0.58rem] font-black" style={{ color }}>{value}</span>
    </div>
  );
}

function Cursor() {
  return <span className="blink-cursor inline-block w-[6px] h-3 bg-orange-500 ml-0.5 align-middle" />;
}

// ─── Main Card ────────────────────────────────────────────────────────────────

export default function StatsCard() {
  const [typed, setTyped] = useState("");
  const fullText = "PARVES.EXE";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.div
        className="relative rounded-sm overflow-hidden max-w-xs"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        {/* Title bar */}
        {/* <div className="flex items-center justify-between px-3 py-2 bg-orange-500">
          <span className="text-[0.65rem] font-black tracking-[0.2em] text-black">
            CHARACTER STATS
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-black/30 rounded-sm" />
            <div className="w-2 h-2 bg-black/30 rounded-sm" />
            <div className="w-2 h-2 bg-black rounded-sm" />
          </div>
        </div> */}
        {/* ── Row Body ── */}
        <div className=" flex flex-col items-center justify-center gap-4 p-4">

          {/* ── Col 1: Avatar + Identity ── */}
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-5 w-full" >
            <div
              className="p-2 bg-[#0e0e1a] rounded-sm avatar-idle"
              style={{ border: "2px solid #333", boxShadow: "3px 3px 0 #111" }}
            >
              <PixelAvatar />
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-orange-500 font-black text-sm tracking-widest">
                {typed}<Cursor />
              </div>
              <div className="text-[0.58rem] text-gray-500 font-bold tracking-[0.12em]">FULL-STACK DEV</div>
              <div className="text-[0.58rem] text-gray-500 font-bold tracking-[0.12em]">MERN STACK</div>
              <div className="mt-1 px-2 py-0.5 bg-orange-500 rounded-sm">
                <span className="text-[0.58rem] font-black text-black tracking-wider">LV.23  ★★★☆☆</span>
              </div>
              <div className="text-[0.55rem] text-orange-500 font-black blink-text mt-1">▶ AVAILABLE</div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .avatar-idle { animation: avatarBob 2s ease-in-out infinite; }
        @keyframes avatarBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        .blink-cursor { animation: cursorBlink 0.8s step-end infinite; }
        .blink-text   { animation: cursorBlink 1s   step-end infinite; }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .pixel-divider {
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #f97316 0px, #f97316 6px,
            #0a0a14 6px, #0a0a14 10px
          );
        }
        .scanlines-overlay {
          background: repeating-linear-gradient(
            0deg,
            transparent, transparent 2px,
            rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px
          );
        }
      `}</style>
    </>
  );
}