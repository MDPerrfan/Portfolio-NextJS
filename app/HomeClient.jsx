"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import dynamic from "next/dynamic";

import PageLoader from "./Components/Pageloader";

// Load animated components client-side only to avoid hydration mismatch
const StarsBackground    = dynamic(() => import("./Components/StarsBackground"),    { ssr: false });
const DaylightBackground = dynamic(() => import("./Components/DaylightBackground"), { ssr: false });
const Hero               = dynamic(() => import("./Components/Hero"),               { ssr: false });
const About              = dynamic(() => import("./Components/About"),              { ssr: false });
const Skills             = dynamic(() => import("./Components/Skills"),             { ssr: false });
const Navbar             = dynamic(() => import("./Components/Navbar"),             { ssr: false });
const Projects           = dynamic(() => import("./Components/Projects"),           { ssr: false });

gsap.registerPlugin(ScrollTrigger, Flip);

export default function HomeClient({ projects }) {
  const mainContainer = useRef(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [siteVisible, setSiteVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLoaderComplete = () => {
    setLoading(false);
    setSiteVisible(true);
  };

  useGSAP(() => {
    if (!siteVisible) return;

    const origin = document.querySelector(".origin-p");
    const target = document.querySelector(".target-p");
    const layer  = document.querySelector("#leaf-layer");
    if (!origin || !target || !layer) return;

    ScrollTrigger.create({
      trigger: target,
      start: "top 80%",
      once: true,
      onEnter: () => {
        const start = origin.getBoundingClientRect();
        const leaf  = origin.cloneNode(true);
        const computedSize = window.getComputedStyle(origin).fontSize;

        leaf.style.fontSize  = computedSize;
        leaf.style.position  = "fixed";
        leaf.style.left      = start.left + "px";
        leaf.style.top       = start.top  + "px";
        leaf.style.margin    = 0;
        leaf.style.zIndex    = 9999;

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
            const p   = this.progress();
            const end = target.getBoundingClientRect();
            gsap.set(leaf, {
              x: (end.left - start.left) * p + Math.sin(p * 8) * 40,
              y: (end.top  - start.top)  * p,
            });
          },
        });
        tl.call(() => {
          leaf.remove();
          target.textContent   = "P";
          target.style.opacity = 1;
          origin.style.opacity = 1;
        });
      },
    });
  }, { scope: mainContainer, dependencies: [siteVisible] });

  return (
    <>
      {/* Loader sits on top until complete */}
      {loading && <PageLoader onComplete={handleLoaderComplete} />}

      {/* Site fades in after loader exits */}
      <div
        ref={mainContainer}
        className="flex flex-col min-h-screen items-center justify-center lg:px-28 transition-colors duration-500 overflow-x-hidden w-full"
        style={{ opacity: siteVisible ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        {mounted && (
          resolvedTheme === "dark"
            ? <StarsBackground />
            : <DaylightBackground />
        )}

        <Navbar />
        <Hero />

        <div id="about">
          <About />
        </div>

        <Skills />
        <Projects projects={projects} />

        <div
          id="leaf-layer"
          className="fixed inset-0 text-orange-500 font-semibold text-4xl pointer-events-none z-[9999]"
        />
      </div>
    </>
  );
}