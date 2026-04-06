'use client';
import React, { useState, useEffect, useRef } from "react";
import { gsap, Expo } from "gsap";

export default function Loader({ onComplete }) {
  const [counter, setCounter] = useState(0);
  const hasRevealed = useRef(false);

  useEffect(() => {
    // Faster interval (15ms vs 25ms) + accelerating increments
    // so it feels snappy early and dramatic at the end
    const count = setInterval(() => {
      setCounter((c) => {
        if (c >= 100) {
          clearInterval(count);
          return 100;
        }
        // Accelerate: bigger jumps early, slow near 100 for suspense
        const increment = c < 50 ? 3 : c < 80 ? 2 : 1;
        return Math.min(c + increment, 100);
      });
    }, 15);

    return () => clearInterval(count);
  }, []);

  // Trigger reveal when counter hits 100
  useEffect(() => {
    if (counter === 100 && !hasRevealed.current) {
      hasRevealed.current = true;
      reveal();
    }
  }, [counter]);

  const reveal = () => {
    const tl = gsap.timeline({
      onComplete: () => onComplete?.(),
    });

    tl
      // Reduced delays: 0.7 → 0.3, durations tightened across the board
      .to(".follow", {
        width: "100%",
        ease: Expo.easeInOut,
        duration: 0.9,
        delay: 0.3,
      })
      .to(".hide", { opacity: 0, duration: 0.2 }, "<0.4")
      .set(".hide", { display: "none" })           // instant, no duration needed
      .to(".follow", {
        height: "100%",
        ease: Expo.easeInOut,
        duration: 0.6,
        delay: 0.2,
      })
      .to(".content", {
        width: "100%",
        ease: Expo.easeInOut,
        duration: 0.6,
      });
  };

  return (
    // FIX: position:fixed instead of absolute — prevents layout shift
    // because the loader sits above the document flow entirely
    <div style={{
      position: "fixed",   // ← was relative via AppContainer, caused reflow
      inset: 0,
      zIndex: 9999,
      color: "#000",
    }}>

      {/* Loading overlay */}
      <div style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
      }}>
        {/* Follow bar */}
        <div className="follow" style={{
          position: "absolute",
          backgroundColor: "#f48049",
          height: "2px",
          width: 0,
          left: 0,
          zIndex: 2,
        }} />

        {/* Progress bar */}
        <div className="hide" style={{
          position: "absolute",
          left: 0,
          backgroundColor: "#fff",
          height: "2px",
          width: `${counter}%`,
          transition: "width 0.15s ease-out",  // tighter than 0.4s
        }} />

        {/* Counter */}
        <p className="hide" style={{
          position: "absolute",
          fontSize: "50px",
          color: "#fff",
          transform: "translateY(-20px)",
          fontWeight: 500,
          margin: 0,
        }}>
          {counter}%
        </p>
      </div>

      {/* Content panel that sweeps in */}
      <div className="content" style={{
        height: "100%",
        width: 0,
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "#121212",
        zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        overflow: "hidden",
        color: "#fff",
      }} />
    </div>
  );
}