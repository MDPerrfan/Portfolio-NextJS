"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ThemeToggle from "./Components/ThemeToggle";
import StarsBackground from "./Components/StarsBackground";
import DaylightBackground from "./Components/DaylightBackground";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Navbar from "./Components/Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainContainer = useRef(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const originP = document.querySelector(".origin-p");
      const targetP = document.querySelector(".target-p");

      if (!originP || !targetP) return;

      // Reset target P hidden
      gsap.set(targetP, { opacity: 0 });

      const getDelta = () => {
        const start = originP.getBoundingClientRect();
        const end = targetP.getBoundingClientRect();
        return {
          x: end.left - start.left,
          y: end.top - start.top,
        };
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: targetP,
          start: "top 85%",
          end: "top 40%",
          scrub: 1.2,
        },
      });

      const delta = getDelta();

      // --- PHASE 1: Anticipation (slight unstable move)
      tl.to(originP, {
        rotation: -20,
        y: 20,
        duration: 0.2,
        ease: "power1.inOut",
      });

      // --- PHASE 2: Leaf fall with side wiggle
      tl.to(originP, {
        duration: 1,
        ease: "none",
        rotation: 720,
        scale: 0.7,
        onUpdate: function () {
          const progress = this.progress();

          gsap.set(originP, {
            x: delta.x * progress + Math.sin(progress * 10) * 25,
            y: delta.y * progress,
          });
        },
      });

      // --- PHASE 3: Hand-off
      tl.to(originP, {
        opacity: 0,
        duration: 0.15,
      }).to(
        targetP,
        {
          opacity: 1,
          duration: 0.15,
        },
        "<"
      );

      // Recalculate on resize (important!)
      window.addEventListener("resize", ScrollTrigger.refresh);

      return () => {
        window.removeEventListener("resize", ScrollTrigger.refresh);
      };
    },
    { scope: mainContainer }
  );

  return (
    <div
      ref={mainContainer}
      className="flex flex-col min-h-screen items-center justify-center lg:px-28 transition-colors duration-500"
    >
      <ThemeToggle />

      {mounted &&
        (resolvedTheme === "dark" ? (
          <StarsBackground />
        ) : (
          <DaylightBackground />
        ))}

      <Navbar />
      <Hero />

      <div id="about">
        <About />
      </div>

      <Skills />
    </div>
  );
}