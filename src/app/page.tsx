"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoVideocam, IoCodeSlash, IoPeople, IoAnalytics, IoShieldCheckmark, IoLaptopOutline, IoChevronForward, IoLogoLinkedin, IoLogoGithub } from "react-icons/io5";
import MockupInterface from "@/components/landing/MockupInterface";
import HeroLogo from "@/components/landing/HeroLogo";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";



export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 selection:text-green-200 font-sans overflow-x-hidden">


      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] mix-blend-screen opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen opacity-20 animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">SNIPP</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60 absolute left-1/2 -translate-x-1/2">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="https://github.com/Keshav14git/AssessIQ---V2" target="_blank" className="text-white/40 hover:text-white transition-colors mr-2">
            <IoLogoGithub className="w-6 h-6" />
          </Link>

          <SignedOut>
            <Link href="/panel">
              <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white backdrop-blur-sm rounded-full px-6">
                Log In
              </Button>
            </Link>
          </SignedOut>

          <Link href="/panel">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full px-6 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all">
              <SignedIn>Dashboard</SignedIn>
              <SignedOut>Get Started</SignedOut>
            </Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-32 pb-40 px-6 max-w-7xl mx-auto text-center">
        <HeroLogo />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]"
        >
          Interview <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">Better. Faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/50 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          The all-in-one technical interview platform. Real-time coding, HD video, and AI-powered insights designed to hire the top 1%.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/panel">
            <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full font-semibold transition-all hover:scale-105">
              Start Interviewing Now
            </Button>
          </Link>
          <Link href="/docs" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors text-lg font-medium">
            See how it works <IoChevronForward className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>



      {/* DASHBOARD PREVIEW MOCKUP */}
      <section className="relative z-10 px-4 mb-40">
        <MockupInterface />
      </section>

      {/* FEATURES GRID (BENTO STYLE) */}
      <section id="features" className="relative z-10 py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Integrity meets <br />Intelligence.</h2>
            <p className="text-white/50 text-xl max-w-2xl">The only platform that combines a premium coding environment with forensic-level proctoring.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 (Large - AI Proctoring) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-red-500/20 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-all duration-700" />

              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <IoShieldCheckmark className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4 relative z-10">AI Sentinel &trade;</h3>
              <p className="text-white/50 text-lg leading-relaxed max-w-md relative z-10">
                Advanced anti-cheat engine that monitors head gaze, face visibility, and multi-person detection in real-time. Automated detailed "Trust Scores" ensure complete interview integrity without being intrusive.
              </p>
            </motion.div>

            {/* Feature 2 (Command Center) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-50" />

              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <IoLaptopOutline className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Command Center</h3>
              <p className="text-white/50 text-lg leading-relaxed relative z-10">
                A distracted-free, immersive dark-mode UI. Split-screen coding, 1080p video, and instant controls.
              </p>
            </motion.div>

            {/* Feature 3 (Smart Insights) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-500/20 transition-all duration-700" />

              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <IoAnalytics className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Forensic Reports</h3>
              <p className="text-white/50 text-lg leading-relaxed relative z-10">
                Get a breakdown of every violation, session duration, and code quality immediately after the call.
              </p>
            </motion.div>

            {/* Feature 4 (Large - Coding) */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-green-500/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-all duration-700" />

              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                <IoCodeSlash className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 relative z-10">Review & Code</h3>
              <p className="text-white/50 text-lg leading-relaxed max-w-md relative z-10">
                A fully collaborative IDE powered by Monaco. Syntax highlighting, multi-language support (JS, Python, Java), and integrated execution. It's VS Code in the browser.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-20 bg-neutral-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="relative w-32 h-32 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/snipp.png" alt="Logo" fill className="object-contain" />
            </div>
            <p className="text-sm font-medium text-green-400 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">© {new Date().getFullYear()} Snipp</p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-white/40 flex-wrap justify-end items-center">
            <Link href="/about" className="hover:text-green-400 transition-colors">About</Link>
            <Link href="/integrations" className="hover:text-green-400 transition-colors">Integrations</Link>
            <Link href="/docs" className="hover:text-green-400 transition-colors">Documentation</Link>
            <Link href="/help" className="hover:text-green-400 transition-colors">Help Center</Link>
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <Link href="https://www.linkedin.com/in/keshav-jangir-nov1411/" target="_blank" className="hover:text-[#0077b5] transition-colors">
                <IoLogoLinkedin className="w-5 h-5" />
              </Link>
              <Link href="https://github.com/Keshav14git/AssessIQ---V2" target="_blank" className="hover:text-white transition-colors">
                <IoLogoGithub className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}