"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Pixel Sun
function PixelSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 9 9" style={{ imageRendering: "pixelated" }}>
      {/* Rays */}
      <rect x="4" y="0" width="1" height="2" fill="#f5e642" />
      <rect x="4" y="7" width="1" height="2" fill="#f5e642" />
      <rect x="0" y="4" width="2" height="1" fill="#f5e642" />
      <rect x="7" y="4" width="2" height="1" fill="#f5e642" />
      <rect x="1" y="1" width="1" height="1" fill="#f5e642" />
      <rect x="7" y="1" width="1" height="1" fill="#f5e642" />
      <rect x="1" y="7" width="1" height="1" fill="#f5e642" />
      <rect x="7" y="7" width="1" height="1" fill="#f5e642" />
      {/* Core */}
      <rect x="2" y="2" width="5" height="5" fill="#f5e642" />
      <rect x="3" y="3" width="3" height="3" fill="#fff176" />
    </svg>
  );
}

// Pixel Moon
function PixelMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 9 9" style={{ imageRendering: "pixelated" }}>
      <rect x="3" y="1" width="3" height="1" fill="#e8e8ff" />
      <rect x="2" y="2" width="2" height="1" fill="#e8e8ff" />
      <rect x="1" y="3" width="2" height="3" fill="#e8e8ff" />
      <rect x="2" y="6" width="2" height="1" fill="#e8e8ff" />
      <rect x="3" y="7" width="3" height="1" fill="#e8e8ff" />
      <rect x="5" y="6" width="2" height="1" fill="#e8e8ff" />
      <rect x="6" y="3" width="1" height="2" fill="#e8e8ff" />
      <rect x="5" y="2" width="2" height="1" fill="#e8e8ff" />
      {/* crater */}
      <rect x="3" y="3" width="1" height="1" fill="#b0b0dd" />
      <rect x="4" y="5" width="1" height="1" fill="#b0b0dd" />
    </svg>
  );
}

// Pixel Cloud
function PixelCloud({ style }) {
  return (
    <svg width="20" height="10" viewBox="0 0 10 5" style={{ imageRendering: "pixelated", ...style }}>
      <rect x="2" y="2" width="6" height="3" fill="white" opacity="0.9" />
      <rect x="1" y="3" width="8" height="2" fill="white" opacity="0.9" />
      <rect x="3" y="1" width="3" height="2" fill="white" opacity="0.9" />
    </svg>
  );
}

// Pixel Star
function PixelStar({ style }) {
  return (
    <svg width="6" height="6" viewBox="0 0 3 3" style={{ imageRendering: "pixelated", ...style }}>
      <rect x="1" y="0" width="1" height="3" fill="#fff" opacity="0.9" />
      <rect x="0" y="1" width="3" height="1" fill="#fff" opacity="0.9" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    if (animating) return;
    setAnimating(true);
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="fixed top-20 md:top-5 right-8 z-100 cursor-pointer"
      style={{ background: "none", border: "none", padding: 0 }}
    >
      {/* Outer pixel border frame */}
      <div className="pixel-toggle-frame" style={{ background: isDark ? "#1a1a2e" : "#87ceeb" }}>
        {/* Decorative bg elements */}
        <div className="toggle-bg-elements">
          {isDark ? (
            <>
              <PixelStar style={{ position: "absolute", top: 4, left: 6, opacity: 0.9 }} />
              <PixelStar style={{ position: "absolute", top: 8, left: 20, opacity: 0.6, transform: "scale(0.7)" }} />
              <PixelStar style={{ position: "absolute", top: 3, left: 36, opacity: 0.8 }} />
            </>
          ) : (
            <>
              <PixelCloud style={{ position: "absolute", top: 3, left: 4, opacity: 0.85 }} />
              <PixelCloud style={{ position: "absolute", top: 6, left: 28, opacity: 0.6, transform: "scale(0.7)" }} />
            </>
          )}
        </div>

        {/* Ground strip */}
        <div
          className="toggle-ground"
          style={{ background: isDark ? "#2a2a4a" : "#5cb85c" }}
        />

        {/* Sliding knob */}
        <div
          className="toggle-knob"
          style={{
            transform: isDark ? "translateX(36px)" : "translateX(2px)",
            background: isDark ? "#2d2d5e" : "#f5e642",
            boxShadow: isDark
              ? "inset -2px -2px 0 #1a1a3e, inset 2px 2px 0 #4a4a8a"
              : "inset -2px -2px 0 #c8a800, inset 2px 2px 0 #fff9aa",
          }}
        >
          <div className={animating ? "knob-icon-pop" : ""}>
            {isDark ? <PixelMoon /> : <PixelSun />}
          </div>
        </div>

        {/* Pixel border overlay (gives chunky game feel) */}
        <div className="pixel-border-overlay" />
      </div>

      <style>{`
        .pixel-toggle-frame {
          position: relative;
          width: 76px;
          height: 34px;
          border-radius: 4px;
          overflow: hidden;
          transition: background 0.4s ease;
          /* Chunky pixel border */
          outline: 3px solid #111;
          outline-offset: 0px;
          box-shadow:
            0 4px 0 #111,
            4px 0 0 #111,
            -4px 0 0 #111,
            0 -1px 0 #333,
            inset 0 1px 0 rgba(255,255,255,0.15);
        }

        .toggle-bg-elements {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .toggle-ground {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 6px;
          transition: background 0.4s ease;
          border-top: 2px solid rgba(0,0,0,0.2);
        }

        .toggle-knob {
          position: absolute;
          top: 4px;
          width: 28px;
          height: 24px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.68, -0.55, 0.27, 1.55), background 0.4s ease, box-shadow 0.4s ease;
          outline: 2px solid #111;
          z-index: 2;
        }

        .knob-icon-pop {
          animation: iconPop 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        @keyframes iconPop {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(0.6) rotate(-20deg); }
          70%  { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .pixel-border-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          /* Corner pixel accents */
          background:
            linear-gradient(#111 2px, transparent 2px) top left / 4px 4px no-repeat,
            linear-gradient(#111 2px, transparent 2px) top right / 4px 4px no-repeat,
            linear-gradient(#111 2px, transparent 2px) bottom left / 4px 4px no-repeat,
            linear-gradient(#111 2px, transparent 2px) bottom right / 4px 4px no-repeat;
          z-index: 3;
        }

        /* Hover: slight lift */
        .pixel-toggle-frame:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 0 #111,
            4px 0 0 #111,
            -4px 0 0 #111,
            0 -1px 0 #333,
            inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.1s, box-shadow 0.1s, background 0.4s;
        }

        /* Active: press down */
        .pixel-toggle-frame:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 #111,
            4px 0 0 #111,
            -4px 0 0 #111,
            inset 0 1px 0 rgba(255,255,255,0.15);
        }
      `}</style>
    </button>
  );
}