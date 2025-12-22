"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LogoLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="relative flex flex-col items-center">
                {/* Logo Container with Masking */}
                <div
                    className="relative w-48 h-16 md:w-64 md:h-24 overflow-hidden"
                    style={{
                        maskImage: "url('/assessiq.png')", // Using the full logo text image if available, or assess.png
                        // User mentioned "assessiq" text logo earlier, let's stick to the consistent one used in footer/navbar if possible.
                        // Actually usage in Navbar was just text. Usage in footer was /assessiq.png. 
                        // Let's use /assess.png as the mask shape if it's the main brand mark, or /assessiq.png.
                        // The user said "update logo with the same that is on the landing page" for navbar. 
                        // Landing page hero used /assess.png. Navbar text was text. Footer used /assessiq.png.
                        // Let's use the Image based one for the loader for visual impact. /assess.png (the hero one) is likely the big graphical one.
                        maskImage: "url('/assessiq.png')",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskImage: "url('/assessiq.png')",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                    }}
                >
                    {/* Base Layer */}
                    <div className="absolute inset-0 bg-white/10" />

                    {/* Animated Liquid Fill */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"
                        animate={{
                            translateX: ["-100%", "100%"]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>

                {/* Loading Spinner / Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex gap-1"
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-green-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
