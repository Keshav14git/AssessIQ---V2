"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoMicOutline, IoVideocamOutline, IoCallOutline, IoPlay, IoCheckmarkCircle, IoPeople } from "react-icons/io5";

const TypingCode = () => {
    const codeString = `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return []; // No solution found
}`;

    const [displayCode, setDisplayCode] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayCode((prev) => prev + codeString.charAt(index));
            index++;
            if (index === codeString.length) clearInterval(interval);
        }, 50); // Typing speed

        return () => clearInterval(interval);
    }, []);

    return (
        <pre className="font-mono text-xs sm:text-sm text-green-400 overflow-hidden">
            <code>{displayCode}</code>
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
            />
        </pre>
    );
};

export default function MockupInterface() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto rounded-xl border border-white/10 bg-[#0F0F10] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-[700px] relative group"
        >
            {/* Glossy Overlay/Header */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-4 z-20">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-medium text-white/40 bg-black/50 px-3 py-1 rounded-md border border-white/5">
                    app.snipp.com/interview/room-101
                </div>
            </div>

            {/* LEFT SIDEBAR - VIDEO & CONTROLS */}
            <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-white/10 bg-[#0a0a0a] flex flex-col pt-10 z-10">

                {/* Main Video Channel */}
                <div className="p-4 flex-1 flex flex-col gap-4">
                    {/* Large Video Feed */}
                    <div className="aspect-video w-full rounded-xl bg-neutral-800 relative overflow-hidden ring-1 ring-white/10 shadow-lg group-hover:ring-white/20 transition-all">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">K</div>
                        </div>
                        {/* Status Icons */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            <div className="p-1 rounded bg-black/50 backdrop-blur text-white/70">
                                <IoVideocamOutline size={12} />
                            </div>
                        </div>
                        <div className="absolute bottom-3 left-3 text-xs font-medium text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur">
                            Keshav (Interviewer)
                        </div>
                        <div className="absolute bottom-3 right-3 flex gap-1">
                            <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                            <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse delay-75" />
                            <div className="w-1 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                        </div>
                    </div>

                    {/* Secondary/Self Video Feed */}
                    <div className="flex-1 rounded-xl bg-neutral-900/50 border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <IoPeople size={48} className="text-white/20" />
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            {/* Call Controls */}
                            <div className="flex items-center gap-3 bg-neutral-800/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"><IoMicOutline size={16} /></button>
                                <button className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors text-white"><IoCallOutline size={16} /></button>
                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"><IoVideocamOutline size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0c] pt-10">

                {/* Header Row */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0c0c0c]">
                    <div>
                        <h2 className="text-lg font-bold text-white/90">First Bad Version</h2>
                        <p className="text-xs text-white/40">Choose your language and solve the problem</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-8 px-3 rounded border border-white/10 bg-white/5 flex items-center text-sm text-white/70 gap-2">
                            <span>Java</span>
                            <IoPlay size={10} className="rotate-90 opacity-50" />
                        </div>
                        <button className="h-8 px-4 rounded bg-green-600/20 text-green-400 text-sm font-medium border border-green-500/20 hover:bg-green-600/30 transition-colors">
                            Run Code
                        </button>
                    </div>
                </div>

                {/* Vertical Split Content */}
                <div className="flex-1 flex flex-col min-h-0">

                    {/* Top: Problem Description */}
                    <div className="flex-[0.45] p-6 overflow-y-auto border-b border-white/5">
                        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 mb-4">
                            <h3 className="text-sm font-semibold text-green-400 mb-1 flex items-center gap-2">
                                <IoCheckmarkCircle size={16} /> Problem Description
                            </h3>
                            <p className="text-xs text-white/50 leading-relaxed">
                                You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                            <p>Suppose you have <code className="bg-white/10 px-1.5 rounded text-white text-xs">n</code> versions <code className="bg-white/10 px-1.5 rounded text-white text-xs">[1, 2, ..., n]</code> and you want to find out the first bad one, which causes all the following ones to be bad.</p>
                            <p>You are given an API <code className="bg-white/10 px-1.5 rounded text-white text-xs">bool isBadVersion(version)</code> which returns whether version is bad.</p>
                        </div>
                    </div>

                    {/* Bottom: Code Editor */}
                    <div className="flex-1 relative bg-[rgb(30,30,30)] group/editor font-mono text-sm border-t border-black">
                        {/* Tabs/Breadcrumbs */}
                        <div className="h-9 bg-[#1e1e1e] flex items-center px-4 border-b border-white/5">
                            <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 px-3 py-1.5 rounded-t-md border-t border-l border-r border-white/5">
                                <span className="text-yellow-500">J</span> Solution.java
                            </div>
                        </div>

                        <div className="absolute top-9 inset-0 flex">
                            {/* Line Numbers */}
                            <div className="w-12 h-full bg-[#1e1e1e] border-r border-white/5 flex flex-col items-end pr-3 pt-4 text-white/30 text-xs select-none font-mono">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} className="mb-0 leading-6">{i + 1}</div>
                                ))}
                            </div>
                            {/* Code */}
                            <div className="flex-1 p-4 pt-4 text-[#d4d4d4] leading-6 overflow-hidden">
                                <span className="text-[#6a9955]">/* The isBadVersion API is defined in the parent class VersionControl. */</span><br />
                                <span className="text-[#6a9955] pl-4">boolean isBadVersion(int version); */</span><br /><br />

                                <span className="text-[#569cd6]">public class</span> <span className="text-[#4ec9b0]">Solution</span> <span className="text-[#569cd6]">extends</span> <span className="text-[#4ec9b0]">VersionControl</span> {"{"}<br />
                                <div className="pl-4 inline-block">
                                    <span className="text-[#569cd6]">public int</span> <span className="text-[#dcdcaa]">firstBadVersion</span>(<span className="text-[#569cd6]">int</span> n) {"{"}
                                </div><br />
                                <span className="pl-8 text-[#6a9955]">// Write your solution here</span><br />
                                <div className="pl-8 text-white relative">
                                    <TypingCode />
                                </div>
                                <span className="pl-4">{"}"}</span><br />
                                <span>{"}"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
