"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerClasses = `
    fixed left-1/2 -translate-x-1/2 z-50
    w-[95%] md:w-[70%] lg:w-[50%]
    flex items-center justify-center
    transition-all duration-700 ease-in-out
    border border-white/20 rounded-full
    backdrop-blur-md shadow-lg
  `;

  const positionClasses = isScrolled
    ? "bottom-8 py-3 bg-black/30"
    : "top-8 py-5 bg-white/10";

  return (
    <nav className={`${containerClasses} ${positionClasses}`}>
      
      {/* Smoke Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="smoke smoke1"></div>
        <div className="smoke smoke2"></div>
      </div>

      {/* Nav Links */}
      <ul className="relative z-10 flex items-center gap-8 text-white font-semibold tracking-wide">
        <li>
          <Link href="/" className="hover:text-orange-400 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-orange-400 transition-colors">
            About
          </Link>
        </li>
        <li>
          <Link href="/skills" className="hover:text-orange-400 transition-colors">
            Skills
          </Link>
        </li>
        <li>
          <Link href="/projects" className="hover:text-orange-400 transition-colors">
            Projects
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-orange-400 transition-colors">
            Contact
          </Link>
        </li>
      </ul>

      <style jsx>{`
        .smoke {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.15) 40%,
            transparent 70%
          );
          filter: blur(12px);
          animation: float 18s infinite linear;
          opacity: 0.6;
        }

        .smoke1 {
          animation-duration: 20s;
        }

        .smoke2 {
          animation-duration: 30s;
          animation-direction: reverse;
          opacity: 0.4;
        }

        @keyframes float {
          0% {
            transform: translate(0%, 0%) rotate(0deg);
          }
          50% {
            transform: translate(10%, -10%) rotate(180deg);
          }
          100% {
            transform: translate(0%, 0%) rotate(360deg);
          }
        }
      `}</style>
    </nav>
  );
}