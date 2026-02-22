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
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container.current,
      start: "top top",
      end: "+=90%",
      scrub: 1,
      anticipatePin: 1,
    }
  });

  tl.to(".char", {
    y: window.innerHeight,
    x: () => (Math.random() - 0.5) * 500,
    rotation: () => (Math.random() - 0.5) * 720,
    opacity: 0,
    stagger: 0.05,
    ease: "power2.in",
  });

}, { scope: container });
  return (
    <div ref={container} className='min-h-screen flex flex-col lg:flex-row items-center justify-between gap-8 px-8 md:px-12 md:text-4xl text-3xl py-12 '>
      <div className='flex flex-col items-start justify-center w-full '>
        <p className=' font-bold  text-gray-800 dark:text-gray-200'>Hi, There!</p>
        <p className=' my-5'> I'm <span  className="inline-block ml-4 text-orange-500">
          {name.split("").map((char, i) => (
            <span
              key={i}
              className="char inline-block whitespace-pre font-semibold text-4xl md:text-5xl"
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
        </span></p>
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
      <div className='flex items-center justify-ceter w-full'>
        <img className='w-80 md:w-full' src="https://res.cloudinary.com/ddbqfnyfc/image/upload/v1747771857/business-man-illustration_cw8jhi.png" alt="" />
      </div>
    </div>
  )
}
