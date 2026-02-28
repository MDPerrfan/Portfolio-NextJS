"use client";
import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const container = useRef(null);
  const name = "Mohammed Parves";

  useGSAP(() => {
    // 1. The Blinking "!" 
    gsap.to(".blink-excl", {
      opacity: 0,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)" // "steps" makes it feel more like a digital cursor blink
    });

    // 2. The Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        toggleActions: "play none reverse none", // "reverse" reconstructs it on scroll up
      },
    });

    tl.to(".char", {
      // Scatter to random edges of the screen
      y: () => (Math.random() > 0.5 ? -window.innerHeight : window.innerHeight),
      x: () => (Math.random() - 0.5) * window.innerWidth,
      rotation: () => (Math.random() - 0.5) * 1000,
      opacity: 0,
      stagger: 0.02,
      duration: 1.2,
      ease: "power3.inOut",
    });

  }, { scope: container });

  return (
    <div ref={container} className='min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-8 md:px-12 py-12'>
      <div className='flex flex-col items-start justify-center w-full'>
        
        {/* Restored original text sizes */}
        <p className='px-5 text-gray-800 text-2xl md:text-6xl lg:text-8xl font-bold'> 
          Hi, There<span className="blink-excl">!</span>
        </p>

        <div className='flex items-center relative'>
          <p className='my-8 px-2 text-gray-800 font-bold text-2xl md:text-6xl lg:text-8xl'> 
            I'm <span className="inline-block ml-2 text-orange-500">
              {name.split("").map((char, i) => (
                <span
                  key={i}
                  className={`inline-block whitespace-pre ${char === 'P' ? 'traveling-p opacity-100' : 'char'}`}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </span>
              ))}
            </span>
          </p>
        </div>

        <div className='anim-text overflow-hidden h-12'>
          <div className="text-gray-200 dark:text-gray-600 text-xl px-4 md:text-4xl">
            <Typewriter
              options={{
                strings: ['Web Developer', 'Techie', 'Teacher', 'Ecophile'],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}