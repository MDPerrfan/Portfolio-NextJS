"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import dynamic from "next/dynamic";

import PageLoader from "./Components/Pageloader";
import ThemeToggle from "./Components/ThemeToggle";

// Only keep ssr:false where absolutely needed
const StarsBackground = dynamic(() => import("./Components/StarsBackground"), { ssr: false });
const DaylightBackground = dynamic(() => import("./Components/DaylightBackground"), { ssr: false });

// Allow SSR for main components (important for mobile stability)
const Hero = dynamic(() => import("./Components/Hero"));
const About = dynamic(() => import("./Components/About"));
const Skills = dynamic(() => import("./Components/Skills"));
const Navbar = dynamic(() => import("./Components/Navbar"));
const Projects = dynamic(() => import("./Components/Projects"));
const Contact = dynamic(() => import("./Components/Contact"));
const Footer = dynamic(() => import("./Components/Footer"));
const Services = dynamic(() => import("./Components/Services"));

export default function HomeClient({ projects, about }) {
  const mainContainer = useRef(null);
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [siteVisible, setSiteVisible] = useState(false);
  const [wave, setWave] = useState(0);

  //  Register GSAP plugins safely
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Flip);
  }, []);

  useEffect(() => setMounted(true), []);

  // Proper timeout cleanup (IMPORTANT)
  useEffect(() => {
    if (!siteVisible) return;

    const t1 = setTimeout(() => setWave(1), 50);
    const t2 = setTimeout(() => setWave(2), 300);
    const t3 = setTimeout(() => setWave(3), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [siteVisible]);

  const handleLoaderComplete = () => {
    setLoading(false);
    setSiteVisible(true);
  };

  useGSAP(() => {
    if (!siteVisible) return;

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
            const end = target.getBoundingClientRect();
            gsap.set(leaf, {
              x: (end.left - start.left) * p + Math.sin(p * 8) * 40,
              y: (end.top - start.top) * p,
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

    return () => {
      trigger.kill();
    };
  }, { scope: mainContainer, dependencies: [siteVisible, wave] });

  return (
    <>
      {loading && <PageLoader onComplete={handleLoaderComplete} />}

      <div
        ref={mainContainer}
        className="flex flex-col min-h-screen items-center justify-center transition-colors duration-500 overflow-x-hidden w-full"
        style={{ opacity: siteVisible ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        {/* Wave 1 */}
        {wave >= 1 && mounted && (
          resolvedTheme === "dark"
            ? <StarsBackground />
            : <DaylightBackground />
        )}

        <ThemeToggle />
        {wave >= 1 && <Navbar />}

        {/* Wave 2 */}
        {wave >= 2 && <Hero />}
        {wave >= 2 && <About about={about} />}

        {/* Wave 3 */}
        {wave >= 3 && <Skills />}
        {wave >= 3 && <Services />}
        {wave >= 3 && <Projects projects={projects} />}
        {wave >= 3 && <Contact />}
        {wave >= 3 && <Footer about={about} />}

        {/*  Leaf layer */}
        <div
          id="leaf-layer"
          className="fixed inset-0 text-orange-500 font-semibold text-4xl pointer-events-none z-[9999]"
        />
      </div>
    </>
  );
}
