"use client";
import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger);
export default function Hero() {
  const container = useRef(null);
  const hammerRef = useRef(null);
  const name = "Mohammed Parves";

useGSAP(() => {
    // Create a timeline tied to the scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=50%", 
        toggleActions: "play none none none",
        // scrub: 1, // Optional: uncomment if you want to control the hit with scroll depth
      },
    });

    tl.to(hammerRef.current, {
      rotation: -45, // Pull back the hammer
      duration: 0.2,
      ease: "power2.out"
    })
    .to(hammerRef.current, {
      rotation: 20, // The "Hit"
      x: 20,
      duration: 0.1,
      ease: "back.in(2)"
    })
    .to(".char", {
      y: window.innerHeight,
      x: () => (Math.random() - 0.5) * 600,
      rotation: () => (Math.random() - 0.5) * 1000,
      opacity: 0,
      stagger: 0.02, // Faster stagger feels more like an impact
      ease: "power3.out",
      duration: 1.5,
    }, "-=0.1") // Starts slightly before the hammer finish for realism
    .to(hammerRef.current, {
      opacity: 0,
      duration: 0.5
    }, "-=1"); // Fade hammer out as letters fall

  }, { scope: container });
  return (
    <div ref={container} className='min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-8 md:px-12 md:text-5xl lg:text-7xl text-2xl py-12 '>
      <div className='flex flex-col items-start justify-center w-full '>
        <p className=' font-bold  text-gray-800 dark:text-gray-200'>Hi, There!</p>
        <div className='flex items-center relative'>
          <p className=' my-5'> I'm <span className="inline-block ml-2 text-orange-500">
            {name.split("").map((char, i) => (
              <span
                key={i}
                className="char inline-block whitespace-pre font-semibold text-3xl md:text-5xl lg:text-7xl"
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </span></p>
          {/* THE HAMMER */}
          <img
            ref={hammerRef}
            src="/hammer.png" // Ensure your png is in the public folder
            alt="hammer"
            className="absolute -right-16 md:-right-24 w-20 md:w-30 md:h-30 z-10"
            style={{ transformOrigin: "bottom right" }} // Pivots from the handle
          />
        </div>

        <div className='anim-text overflow-hidden h-12'>
          <div className="text-gray-600 dark:text-gray-400 font-mono text-2xl">
            <Typewriter
              options={{
                strings: ['Web Developer', 'Techie', 'Teacher', 'Ecophile'],
                autoStart: true,
                loop: true,
              }}
            />          </div>
        </div>
      </div>
    </div>
  )
}
