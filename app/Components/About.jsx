"use client";

import React from "react";
import { AiOutlineApi, AiTwotoneRocket } from "react-icons/ai";
import { GiAk47 } from "react-icons/gi";
const About = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-20 px-8 md:px-12 py-4">
            <div className="flex flex-col items-center text-center">
                {/* Heading */}
                <p className="text-2xl md:text-4xl text-center font-semibold  mb-8 tracking-tight">
                    Be familiar with my
                    <span className=" md:inline text-orange-500 font-black"> Persona</span>
                </p>

                {/* Intro Text */}
                <div className="space-y-4 text-gray-500">
                    <p className="text-xl md:text-2xl leading-relaxed">
                        Hi Everyone, I am <span className="text-orange-500 font-semibold">Parves</span> from
                        <span className="text-orange-500"> Chittagong, Bangladesh.</span>
                        <br />
                        I am currently a CS Student at
                        <span className="text-orange-500 font-semibold ml-1">Port City International University</span>.
                    </p>

                    <p className="text-xl md:text-2xl">
                        Beyond coding, I find joy in various activities:
                    </p>

                    {/* Activities List */}
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
            {/* ===== HERO / PERSONA ===== */}
            <div className="flex flex-col items-center justify-center text-center space-y-6">

                <div className="flex items-center justify-center w-full">
                    <img
                        src="https://res.cloudinary.com/ddbqfnyfc/image/upload/v1747669401/about_e5wvib.png"
                        alt="About illustration"
                        className="w-72 md:w-96 object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default About;