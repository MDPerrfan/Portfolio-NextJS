"use client";

import React from "react";
import StatsCard from "./StatsCard";
import { AiOutlineApi, AiTwotoneRocket } from "react-icons/ai";
import { GiAk47 } from "react-icons/gi";
const About = ({ about }) => {
  const name = about?.name || "Mohammed Parves";
  const bio = about?.description || "A CS Graduate from Chittagong, Bangladesh who turns coffee into code and ideas into full-stack apps.";
  const location = about?.location || "Chittagong, Bangladesh";
  const title = about?.title || "Full Stack Developer";
  return (
    <div id="about" className="flex flex-col lg:flex-row  items-center justify-center gap-20 px-6 py-4">
      <div className="flex flex-col items-center text-center max-w-6xl">
        {/* Heading */}
        <p className="text-2xl md:text-4xl font-semibold mb-8">
          ▸MY {''}
          <span className="text-orange-500 font-black">
            <span className="target-p inline-block opacity-0">P</span>ERSONA
          </span>
        </p>

        {/* Intro Text */}
        <div className="space-y-4">
          <p className="text-xl md:text-2xl leading-relaxed ">
            A <span className="text-orange-500 font-black">CS </span>Graduate from{" "}
            <span className="text-orange-500 font-black">Chittagong, Bangladesh</span>{" "}
            who turns coffee into code and ideas into full-stack apps.
          </p>

          <p className="text-sm md:text-lg my-10 italic">
            Beyond coding, I find joy in various activities:
          </p>

          <div className="flex items-center justify-center gap-10">
            <div className="hidden md:block">
              <div className="flex items-center justify-center">
                <StatsCard />
              </div>
            </div>
            <div>
              <ul className="space-y-3 pl-4 text-lg md:text-xl font-medium">
                <li className="flex items-center gap-3 hover:text-orange-500 transition-colors duration-300">
                  <GiAk47 className="text-orange-500" /> Gaming
                </li>
                <li className="flex items-center gap-3 hover:text-orange-500 transition-colors duration-300">
                  <AiOutlineApi className="text-orange-500" /> Tech Exploration
                </li>
                <li className="flex items-center gap-3 hover:text-orange-500 transition-colors duration-300">
                  <AiTwotoneRocket className="text-orange-500" /> Traveling
                </li>
              </ul>
            </div>

          </div>
          {/* Activities List */}


          {/* Quote Section */}
          <div className="pt-8 italic">
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
              "The best thing about a boolean is even if you are wrong, you are only off by a bit."
            </p>
            <span className="text-sm text-gray-500 dark:text-gray-500 block mt-1">
              — Anonymous
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;