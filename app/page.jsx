"use client";

import { useState } from "react";
import Loader from "./Components/Loader";
import Hero from "./Components/Hero";
import About from "./Components/About";
import StarsBackground from "./Components/StarsBackground";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {!loading && (
        <div className="flex flex-col min-h-screen items-center justify-center lg:px-28">
          <StarsBackground />
          <Hero />
          <About />
        </div>
      )}
    </>
  );
}