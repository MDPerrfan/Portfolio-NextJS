"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger, Flip } from "gsap/all";

import ThemeToggle from "./Components/ThemeToggle";
import StarsBackground from "./Components/StarsBackground";
import DaylightBackground from "./Components/DaylightBackground";
import Hero from "./Components/Hero";
import About from "./Components/About";
import dynamic from "next/dynamic";
const Skills = dynamic(() => import("./Components/Skills"), { ssr: false });import Navbar from "./Components/Navbar";
const Projects = dynamic(() => import("./Components/Projects"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, Flip);

export default function HomeClient({ projects = [] }) {
  const mainContainer = useRef(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // GSAP animation setup
  useEffect(() => {
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
        leaf.style.position = "fixed";
        leaf.style.left = start.left + "px";
        leaf.style.top = start.top + "px";
        leaf.style.zIndex = 9999;
        layer.appendChild(leaf);
        origin.style.opacity = 0;
        target.style.opacity = 0;

        const tl = gsap.timeline();
        tl.to(leaf, {
          duration: 2,
          rotation: 720,
          scale: 0.85,
          onUpdate() {
            const p = this.progress();
            const end = target.getBoundingClientRect();
            gsap.set(leaf, {
              x: (end.left - start.left) * p,
              y: (end.top - start.top) * p,
            });
          },
        }).call(() => {
          leaf.remove();
          target.style.opacity = 1;
          origin.style.opacity = 1;
        });
      },
    });
  }, []);

  return (
    <div ref={mainContainer} className="flex flex-col items-center w-full">
      <ThemeToggle />
      {mounted && (resolvedTheme === "dark" ? <StarsBackground /> : <DaylightBackground />)}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects projects={projects} />
      <div id="leaf-layer" className="fixed inset-0 z-50 pointer-events-none text-orange-500 text-4xl font-bold" />
    </div>
  );
}