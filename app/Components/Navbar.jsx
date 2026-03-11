"use client";

import React, { useState, useEffect, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";
const NAV_ITEMS = ["Home", "About", "Skills", "Projects", "Contact"];

// Pixel Mario SVG (8-bit style, inline)
function MarioSprite({ jumping, facingLeft }) {
  return (
    <svg
      width="28"
      height="32"
      viewBox="0 0 14 16"
      style={{
        imageRendering: "pixelated",
        transform: facingLeft ? "scaleX(-1)" : "scaleX(1)",
        transition: "transform 0.1s",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hat */}
      <rect x="3" y="0" width="8" height="2" fill="#e52222" />
      <rect x="2" y="2" width="10" height="2" fill="#e52222" />
      {/* Face */}
      <rect x="2" y="4" width="9" height="1" fill="#f5c07a" />
      <rect x="1" y="5" width="11" height="3" fill="#f5c07a" />
      {/* Eyes */}
      <rect x="3" y="5" width="2" height="1" fill="#111" />
      <rect x="8" y="5" width="2" height="1" fill="#111" />
      {/* Mustache */}
      <rect x="2" y="7" width="10" height="1" fill="#7a3b00" />
      <rect x="1" y="8" width="5" height="1" fill="#7a3b00" />
      <rect x="8" y="8" width="5" height="1" fill="#7a3b00" />
      {/* Overalls */}
      <rect x="1" y="9" width="12" height="4" fill="#1a6fff" />
      <rect x="0" y="10" width="14" height="2" fill="#e52222" />
      {/* Buckles */}
      <rect x="3" y="9" width="2" height="1" fill="#f5e642" />
      <rect x="9" y="9" width="2" height="1" fill="#f5e642" />
      {/* Legs */}
      <rect x="1" y="13" width="5" height="2" fill="#1a6fff" />
      <rect x="8" y="13" width="5" height="2" fill="#1a6fff" />
      {/* Shoes */}
      <rect x="0" y="14" width="6" height="2" fill="#7a3b00" />
      <rect x="8" y="14" width="6" height="2" fill="#7a3b00" />
      {/* Arms */}
      <rect x="0" y="9" width="1" height="3" fill="#f5c07a" />
      <rect x="13" y="9" width="1" height="3" fill="#f5c07a" />
    </svg>
  );
}

// Coin collected burst
function CoinBurst({ x, y, visible }) {
  return visible ? (
    <div
      className="coin-burst"
      style={{ left: x - 8, top: y - 16, position: "absolute", pointerEvents: "none", zIndex: 20 }}
    >
      <svg width="16" height="16" viewBox="0 0 8 8" style={{ imageRendering: "pixelated" }}>
        <rect x="2" y="0" width="4" height="8" fill="#f5e642" />
        <rect x="0" y="2" width="8" height="4" fill="#f5e642" />
        <rect x="1" y="1" width="6" height="6" fill="#f5e642" />
      </svg>
    </div>
  ) : null;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [marioPos, setMarioPos] = useState({ x: 0, idx: 0 });
  const [jumping, setJumping] = useState(false);
  const [jumpTarget, setJumpTarget] = useState(null);
  const [facingLeft, setFacingLeft] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [coinBursts, setCoinBursts] = useState({});
  const [pressed, setPressed] = useState(null);
  const navRefs = useRef([]);
  const navBarRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

// Replace the existing scroll useEffect with this:
useEffect(() => {
  const handleScroll = () => {
    const footer = document.getElementById("contact");
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      // If footer is visible on screen, go back to top
      if (footerRect.top < window.innerHeight) {
        setIsScrolled(false);
        return;
      }
    }
    setIsScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // Initialize mario under first nav item
  // Map nav items to their section IDs
  const SECTION_IDS = ["hero", "about", "skills", "projects", "contact"];

  useEffect(() => {
    const observers = [];

    SECTION_IDS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Only jump if it's a different section
              setActiveIdx(prev => {
                if (prev !== i) {
                  jumpTo(i, prev); // pass current active as "from"
                }
                return prev; // let jumpTo handle the state update
              });
            }
          });
        },
        {
          threshold: 0.4, // section must be 40% visible to trigger
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [jumping]); // re-run when jumping state settles
  // Change the signature to accept optional fromIdx
  const jumpTo = (toIdx, fromIdx_override) => {
    const fromIdx = fromIdx_override ?? activeIdx; // ← use override if provided
    if (jumping) return;
    if (toIdx === fromIdx) return;

    const navRect = navBarRef.current?.getBoundingClientRect();
    const fromEl = navRefs.current[fromIdx];
    const toEl = navRefs.current[toIdx];
    if (!fromEl || !toEl || !navRect) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const fromX = fromRect.left - navRect.left + fromRect.width / 2 - 14;
    const toX = toRect.left - navRect.left + toRect.width / 2 - 14;

    setFacingLeft(toX < fromX);
    setJumping(true);
    setJumpTarget(toIdx);

    setCoinBursts(prev => ({ ...prev, [fromIdx]: true }));
    setTimeout(() => setCoinBursts(prev => ({ ...prev, [fromIdx]: false })), 500);

    const duration = Math.abs(toX - fromX) * 3.5 + 300;
    const startTime = performance.now();
    const startX = fromX;

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const x = startX + (toX - startX) * t;
      posRef.current = x;
      setMarioPos({ x, idx: toIdx });
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setJumping(false);
        setActiveIdx(toIdx);         // ← now correctly updates from scroll too
        setFacingLeft(false);
        setCoinBursts(prev => ({ ...prev, [toIdx]: true }));
        setTimeout(() => setCoinBursts(prev => ({ ...prev, [toIdx]: false })), 500);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  // Parabolic Y offset for mario (CSS handles via animation)
  const jumpY = jumping ? -1 : 0;

  const containerClasses = `
    fixed left-1/2 -translate-x-1/2 z-50
    w-[85%] md:w-[80%] lg:w-[60%]
    flex items-center justify-center
    transition-all duration-700 ease-in-out
    border border-white/20
    rounded-full
    backdrop-blur-md
    shadow-lg
    overflow-visible
  `;

  const positionClasses = isScrolled
    ? "bottom-8 py-3 bg-black/40 :bg-white/10"
    : "top-8 py-4 bg-white/10";

  return (
    <>
      <nav ref={navBarRef} className={`${containerClasses} ${positionClasses}`}>
        {/* Smoke BG */}
        <div className="absolute inset-0 z-0 pointer-events-none rounded-full overflow-hidden">
          <div className="smoke smoke1" />
          <div className="smoke smoke2" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center px-4">
          {/* Mobile hamburger */}
          <button
            className="absolute left-6 md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:block relative w-full">
            {/* Mario layer — sits above links */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: marioPos.x,
                bottom: "calc(100% + 4px)",
                zIndex: 30,
                transition: jumping ? "none" : "left 0.15s ease-out",
              }}
            >
              <div className={jumping ? "mario-jump" : "mario-idle"}>
                <MarioSprite jumping={jumping} facingLeft={facingLeft} />
              </div>
            </div>

            {/* Nav links */}
            <ul className="flex items-center justify-evenly gap-6 lg:gap-8 text-base lg:text-lg font-semibold tracking-wide px-4 py-1">
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item}
                  ref={el => (navRefs.current[i] = el)}
                  className="relative"
                >
                  {/* Coin burst */}
                  <CoinBurst
                    x={16}
                    y={0}
                    visible={!!coinBursts[i]}
                  />

                  <a
                    href={item === "Home" ? "#hero" : `#${item.toLowerCase()}`}
                    onClick={() => jumpTo(i)}
                    className={`
                      nav-link-pixel
                      relative inline-block px-2 py-1
                      transition-colors duration-200
                      ${activeIdx === i
                        ? "text-orange-400"
                        : "hover:text-orange-300"
                      }
                      ${pressed === i ? "nav-link-pressed" : ""}
                      ${activeIdx === i ? "nav-link-float" : ""}
                    `}
                    onMouseDown={() => setPressed(i)}
                    onMouseUp={() => setPressed(null)}
                    onMouseLeave={() => setPressed(null)}
                  >
                    {/* Active pixel underline */}
                    {activeIdx === i && (
                      <span className="pixel-underline" />
                    )}
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-start justify-center h-full pl-10 gap-10 text-2xl font-semibold text-white">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={item === "Home" ? "#hero" : `#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="hover:text-orange-400 transition-colors flex items-center gap-3"
              >
                <span className="text-orange-500 text-sm">▶</span>
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        /* Smoke */
        .smoke {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: radial-gradient(
            circle at center,
            rgba(255,255,255,0.2) 0%,
            rgba(255,255,255,0.1) 40%,
            transparent 70%
          );
          filter: blur(18px);
          animation: float 22s infinite linear;
          opacity: 0.45;
        }
        .smoke1 { animation-duration: 22s; }
        .smoke2 {
          animation-duration: 30s;
          animation-direction: reverse;
          opacity: 0.3;
        }
        @keyframes float {
          0%   { transform: translate(0%,0%) rotate(0deg); }
          50%  { transform: translate(5%,-5%) rotate(180deg); }
          100% { transform: translate(0%,0%) rotate(360deg); }
        }

        /* Mario jump arc */
        .mario-jump {
          animation: jumpArc 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes jumpArc {
          0%   { transform: translateY(0px) scaleY(1) scaleX(1); }
          15%  { transform: translateY(0px) scaleY(0.7) scaleX(1.3); } /* squish on takeoff */
          40%  { transform: translateY(-38px) scaleY(1.15) scaleX(0.88); } /* stretch at peak */
          70%  { transform: translateY(-28px) scaleY(1.1) scaleX(0.9); }
          88%  { transform: translateY(-4px) scaleY(0.75) scaleX(1.25); } /* squish on land */
          100% { transform: translateY(0px) scaleY(1) scaleX(1); }
        }

        /* Mario idle bob */
        .mario-idle {
          animation: idleBob 1.8s ease-in-out infinite;
        }
        @keyframes idleBob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-3px); }
        }

        /* Floating active nav item */
        .nav-link-float {
          animation: navFloat 2s ease-in-out infinite;
        }
        @keyframes navFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }

        /* Pixel underline on active */
        .pixel-underline {
          display: block;
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: repeating-linear-gradient(
            90deg,
            #f97316 0px, #f97316 4px,
            transparent 4px, transparent 7px
          );
          image-rendering: pixelated;
        }

        /* Press effect */
        .nav-link-pressed {
          transform: translateY(2px) !important;
          animation: none !important;
        }

        /* Coin burst */
        .coin-burst {
          animation: coinPop 0.5s ease-out forwards;
        }
        @keyframes coinPop {
          0%   { transform: translateY(0px) scale(1); opacity: 1; }
          60%  { transform: translateY(-20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-32px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}