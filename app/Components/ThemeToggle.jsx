"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-5 right-5 p-3 rounded-full bg-orange-500 text-white shadow-lg hover:scale-110 transition-all z-[100]"
    >
      {theme === "dark" ? <HiSun size={24} /> : <HiMoon size={24} />}
    </button>
  );
}