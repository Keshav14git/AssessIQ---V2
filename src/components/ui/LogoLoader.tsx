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
                        maskImage: "url('/1.png')",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskImage: "url('/1.png')",
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
