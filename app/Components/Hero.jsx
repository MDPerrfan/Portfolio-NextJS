"use client";
import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const container = useRef(null);
  const name = "Mohammed Parves";

  useGSAP(() => {
    gsap.to(".blink-excl", {
      opacity: 0,
      duration: 0.6,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)"
    });
  }, { scope: container });

  return (
    <div id='hero' ref={container} className='min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 px-8 md:px-12 py-12'>
      <div className='flex flex-col items-start justify-center w-full'>
        <p className='px-5 text-2xl md:text-6xl lg:text-8xl font-bold'>
          Hi, There<span className="blink-excl">!</span>
        </p>

        <p className='my-8 px-2  font-bold text-2xl md:text-6xl lg:text-8xl'>
          I'm{" "}
          <span className="inline-block ml-2 text-orange-500">
            {name.split("").map((char, i) => (
              <span
                key={i}
                className={`inline-block whitespace-pre ${i === 9 ? "origin-p" : ""}`}
              >
                {char}
              </span>
            ))}
          </span>
        </p>

        <div className='overflow-hidden h-12'>
          <div className="text-gray-400 text-xl px-4 md:text-4xl">
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