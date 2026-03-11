"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

import ThemeToggle from "./Components/ThemeToggle";
import StarsBackground from "./Components/StarsBackground";
import DaylightBackground from "./Components/DaylightBackground";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Navbar from "./Components/Navbar";
import Projects from "./Components/Projects";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function Home() {
  const mainContainer = useRef(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(() => {

    const origin = document.querySelector(".origin-p");
    const target = document.querySelector(".target-p");
    const layer = document.querySelector("#leaf-layer");

    if (!origin || !target || !layer) return;

    ScrollTrigger.create({
      trigger: target,
      start: "top 80%",
      once: true,

      onEnter: () => {
        const start = origin.getBoundingClientRect();

        const leaf = origin.cloneNode(true);
        const computedSize = window.getComputedStyle(origin).fontSize;
        leaf.style.fontSize = computedSize;
        leaf.style.position = "fixed";
        leaf.style.left = start.left + "px";
        leaf.style.top = start.top + "px";
        leaf.style.margin = 0;
        leaf.style.zIndex = 9999;

        layer.appendChild(leaf);

        origin.style.opacity = 0;
        target.style.opacity = 0;

        const tl = gsap.timeline();

        tl.to(leaf, {
          duration: 2.2,
          ease: "power1.in",
          rotation: 720,
          scale: 0.85,

          onUpdate() {
            const p = this.progress();

            // ✅ Re-read target position every frame so it accounts for scroll
            const end = target.getBoundingClientRect();

            const deltaX = end.left - start.left;
            const deltaY = end.top - start.top;

            gsap.set(leaf, {
              x: deltaX * p + Math.sin(p * 8) * 40,
              y: deltaY * p,
            });
          },
        });

        tl.call(() => {
          leaf.remove();
          target.textContent = "P";
          target.style.opacity = 1;
          origin.style.opacity = 1;
        });
      },

    });

  }, { scope: mainContainer });

  return (
    <div
      ref={mainContainer}
      className="flex flex-col min-h-screen items-center justify-center lg:px-28 transition-colors duration-500 overflow-x-hidden w-full"
    >
      <ThemeToggle />

      {mounted &&
        (resolvedTheme === "dark"
          ? <StarsBackground />
          : <DaylightBackground />
        )}

      <Navbar />
      <Hero />

      <div id="about">
        <About />
      </div>

      <Skills />
      <Projects />
      <div id="leaf-layer" className="fixed inset-0 text-orange-500 font-semibold text-4xl pointer-events-none z-9999" />    </div>
  );
}