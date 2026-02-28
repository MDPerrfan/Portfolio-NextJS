"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ThemeToggle from "./Components/ThemeToggle";
import StarsBackground from "./Components/StarsBackground";
import DaylightBackground from "./Components/DaylightBackground";
import Hero from "./Components/Hero";
import About from "./Components/About";
import Skills from "./Components/Skills";
import Navbar from "./Components/Navbar";
export default function Home() {
  const { resolvedTheme } = useTheme(); // 'resolvedTheme' accounts for system settings
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center lg:px-28  transition-colors duration-500 ">
      <ThemeToggle />

      {/* Conditionally render backgrounds based on theme */}
      {mounted && (
        resolvedTheme === "dark" ? <StarsBackground /> : <DaylightBackground />
      )}
      <Navbar />
        <Hero />
        <div id="about">
        <About />
        </div>
        <Skills />
    </div>
  );
}