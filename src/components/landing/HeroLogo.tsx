"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function HeroLogo() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse tracking
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth "Heavy" Physics for the spotlight
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        // Optional: Reset or keep last position. 
        // Keeping last position usually feels more natural for "lighting"
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-20 flex justify-center items-center py-24"
        >
            {/* 
         THE MASKED LOGO CONTAINER 
         We use the logo png as a mask. The content inside creates the visual.
      */}
            <div
                className="relative w-[360px] h-[110px] sm:w-[580px] sm:h-[180px] md:w-[850px] md:h-[260px]"
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
                {/* 1. BASE MATERIAL (Deep, Rich Gradient) */}
                {/* Animated fluid background */}
                <motion.div
                    className="absolute inset-0 w-[200%] h-[200%]"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    style={{
                        background: "linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #064e3b 75%, #022c22 100%)",
                        // Deep Emerald to Dark Jungle Green
                    }}
                />

                {/* 2. TEXTURE OVERLAY (Noise) */}
                <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
                {/* If noise.png doesn't exist, this might just be transparent, which is fine. 
            Replacing with a CSS noise pattern if possible or just leaving it clean. 
            Let's stick to clean gradients for "Minimal".
        */}

                {/* 3. INTERACTIVE SPOTLIGHT (The "Mouse Light") */}
                <motion.div
                    className="absolute bg-white mix-blend-overlay blur-[30px] rounded-full pointer-events-none"
                    style={{
                        width: 200,
                        height: 200,
                        left: mouseX,
                        top: mouseY,
                        x: "-50%",
                        y: "-50%",
                        opacity: 0.8
                    }}
                />

                {/* 4. SECONDARY COLORED LIGHT (Teal Accent) */}
                <motion.div
                    className="absolute bg-teal-400 mix-blend-color-dodge blur-[40px] rounded-full pointer-events-none"
                    style={{
                        width: 150,
                        height: 150,
                        left: mouseX,
                        top: mouseY,
                        x: "-30%", // Offset slightly for chromatic feel
                        y: "-30%",
                        opacity: 0.6
                    }}
                />

            </div>

            {/* 
         REFLECTION / GLOW UNDERNEATH (Outside the mask)
         To ground it in the scene
      */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-green-500/20 blur-[50px] rounded-full pointer-events-none"
            />

        </div>
    );
}
