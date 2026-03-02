"use client";

import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

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
    fixed left-0 right-0 mx-auto
    z-50
    w-[92%] sm:w-[85%] md:w-[70%] lg:w-[50%]
    max-w-5xl
    transition-all duration-500 ease-in-out
    border border-white/20
    rounded-full
    backdrop-blur-md
    shadow-lg
    overflow-hidden
  `;

  const positionClasses = isScrolled
    ? "bottom-6 py-3 bg-black/40 dark:bg-white/10"
    : "top-6 py-4 bg-white/20 dark:bg-black/30";

  return (
    <>
      {/* NAV BAR */}
      <nav className={`${containerClasses} ${positionClasses}`}>
        <div className="flex items-center justify-between px-6">

          {/* LEFT: Hamburger (mobile only) */}
          <button
            className="md:hidden text-2xl text-gray-800 dark:text-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>

          {/* CENTER: Logo */}
          <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
            MP
          </div>

          {/* RIGHT: Desktop Links */}
          <ul className="hidden md:flex items-center gap-8 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* MOBILE MENU PANEL */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all duration-500 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
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
    </>
  );
}