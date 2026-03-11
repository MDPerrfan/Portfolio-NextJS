"use client";

import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerClasses = `
    fixed left-1/2 -translate-x-1/2 z-50
    w-[40%] md:w-[70%] lg:w-[50%]
    flex items-center justify-center
    transition-all duration-700 ease-in-out
    border border-white/20
    rounded-full
    backdrop-blur-md
    shadow-lg
    overflow-hidden
  `;

  const positionClasses = isScrolled
    ? "bottom-8 py-3 bg-black/30 dark:bg-white/10"
    : "top-8 py-5 bg-white/10";

  return (
    <>
      {/* Navbar */}
      <nav className={`${containerClasses} ${positionClasses}`}>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="smoke smoke1"></div>
          <div className="smoke smoke2"></div>
        </div>

        <div className="relative z-10 w-full flex items-center justify-center">

          {/* Mobile Hamburger (LEFT) */}
          <button
            className="absolute left-6 md:hidden text-2xl "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center justify-between gap-10 lg:gap-15 text-xl font-semibold tracking-wide ">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="flex gap-10 justify-center items-center">

          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-start justify-center h-full pl-10 gap-10 text-2xl font-semibold text-white">
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="hover:text-orange-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .smoke {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.15) 40%,
            transparent 70%
          );
          filter: blur(20px);
          animation: float 18s infinite linear;
          opacity: 0.5;
        }

        .smoke1 { animation-duration: 22s; }
        .smoke2 {
          animation-duration: 30s;
          animation-direction: reverse;
          opacity: 0.35;
        }

        @keyframes float {
          0% { transform: translate(0%,0%) rotate(0deg); }
          50% { transform: translate(5%,-5%) rotate(180deg); }
          100% { transform: translate(0%,0%) rotate(360deg); }
        }
      `}</style>
    </>
  );
}