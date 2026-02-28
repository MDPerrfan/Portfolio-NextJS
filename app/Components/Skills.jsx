"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { CgCPlusPlus } from "react-icons/cg";
import { DiBootstrap } from "react-icons/di";
import {
    SiTailwindcss,
    SiFirebase,
    SiExpress,
    SiNextdotjs,
} from "react-icons/si";
import {
    DiJavascript1,
    DiReact,
    DiNodejs,
    DiMongodb,
    DiCss3Full,
    DiHtml5,
} from "react-icons/di";
export default function Skills() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => setIsMounted(true), []);

    const skills = [
        { icon: <DiHtml5 />, name: "HTML5" },
        { icon: <DiCss3Full />, name: "CSS3" },
        { icon: <DiBootstrap />, name: "Bootstrap" },
        { icon: <SiTailwindcss />, name: "Tailwind CSS" },
        { icon: <SiFirebase />, name: "Firebase" },
        { icon: <CgCPlusPlus />, name: "C++" },
        { icon: <DiJavascript1 />, name: "JavaScript" },
        { icon: <DiNodejs />, name: "Node.js" },
        { icon: <SiExpress />, name: "Express.js" },
        { icon: <DiReact />, name: "React" },
        { icon: <SiNextdotjs />, name: "Next.js" },
        { icon: <DiMongodb />, name: "MongoDB" },
    ];
  return (
    <div className="flex flex-col items-center justify-center">
        {/* ===== SKILLS ===== */}
            <div className="flex flex-col items-center text-center space-y-10 mt-20">
                <h2 className="text-3xl font-bold">
                    Tech{" "}
                    <span className="text-orange-500">Stack</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 my-8 w-full">
                    {skills.map((skill, i) => (
                        <div
                            key={i}
                            className="group flex flex-col items-center justify-center w-28 h-28p-4 rounded-xl shadow hover:shadow-lg hover:cursor-pointer transition bg-transparent hover:bg-orange-500">
                            <div className="text-5xl text-gray-500 group-hover:text-white transition">
                                {skill.icon}
                            </div>
                            <span className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition">
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== GITHUB CALENDAR ===== */}
            <div className="flex flex-col items-center justify-center text-center space-y-6">
                <h2 className="text-3xl font-bold">
                    GitHub <span className="text-orange-500">Contributions</span>
                </h2>

                <div className="flex w-1/3 md:w-2/3  lg:w-full items-center justify-center overflow-x-auto">
                    {isMounted ? (
                        <GitHubCalendar
                            username="MDPerrfan"
                            blockSize={15}
                            blockMargin={5}
                            fontSize={14}
                        />
                    ) : (
                        <div className="h-52 w-full max-w-xl bg-gray-200 animate-pulse rounded-lg" />
                    )}
                </div>
            </div>
      
    </div>
  )
}
