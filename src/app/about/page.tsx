"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoRocketOutline, IoConstructOutline, IoPeopleOutline, IoHeartOutline, IoAdd, IoRemove, IoCodeSlash, IoLogoGithub, IoCheckmarkCircle } from "react-icons/io5";

const faqs = [
    {
        question: "What is Assessiq?",
        answer: "Assessiq is a comprehensive technical interview platform designed to replace the fragmented toolchain of Zoom, Google Docs, and CodeSandbox. It brings video calling, collaborative coding, and real-time synchronization into a single, unified interface."
    },
    {
        question: "Why did you build this?",
        answer: "As a computer science student entering the job market, I realized how broken the technical interview process is. The anxiety of coding on a whiteboard or in a shared document often masks a candidate's true potential. I wanted to build the tool I wished I had during my own interviews."
    },
    {
        question: "What technologies does it use?",
        answer: "Assessiq is a modern full-stack application built with Next.js 14, Convex for real-time backend state, Clerk for secure authentication, and Stream for low-latency video calls. The editor uses the Monaco Editor engine (from VS Code) for a professional coding experience."
    },
    {
        question: "Is this a real startup?",
        answer: "This is a high-fidelity portfolio project that demonstrates production-ready code and modern web development practices. While it functions like a real SaaS product, it was built to showcase technical skills and product design sensibilities."
    },
    {
        question: "Can I see the source code?",
        answer: "Yes! The project is open source. I believe in learning in build in public. You can check out the repository on my GitHub to see how the real-time collaboration engine works under the hood."
    }
];

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/5 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors px-4 rounded-lg"
            >
                <span className="text-lg font-medium text-white/90">{question}</span>
                <div className={`p-2 rounded-full bg-white/5 text-white/50 transition-all ${isOpen ? 'bg-white text-black rotate-180' : ''}`}>
                    {isOpen ? <IoRemove /> : <IoAdd />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 px-4 text-white/50 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 mt-16">

                {/* Navbar Placeholder */}
                <header className="fixed top-0 inset-x-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6 md:px-12 justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                        <IoChevronBack /> Back to Application
                    </Link>
                </header>

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-24 text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 border border-purple-500/20">
                        <IoCodeSlash className="mb-0.5" /> Student Project
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                        Refactoring the <br />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Hiring Process.</span>
                    </h1>
                    <p className="text-2xl text-white/50 leading-relaxed max-w-3xl mx-auto">
                        Assessiq is a full-stack engineering project born from a desire to make technical interviews fair, realistic, and delightful.
                    </p>
                </motion.div>

                {/* The Problem & Solution Narrative */}
                <section className="mb-32 space-y-24">

                    {/* The Inspiration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Born from Experience</h2>
                            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                                <p>
                                    As a student preparing for internships and jobs, I spent countless hours LeetCoding and doing mock interviews. I quickly realized that the tools we use—Zoom for video, Google Docs for code—add unnecessary friction.
                                </p>
                                <p>
                                    I asked myself: <span className="text-white italic">"Why isn't the interview environment as good as the development environment?"</span>
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen opacity-20" />
                            <div className="relative z-10 p-8 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🤔</div>
                                    <div>
                                        <div className="text-sm font-bold text-white">The Student Dilemma</div>
                                        <div className="text-xs text-white/40">Why practice in an IDE but interview in a Doc?</div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                        ❌ No Syntax Highlighting
                                    </div>
                                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                        ❌ No Auto-Complete
                                    </div>
                                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                                        ❌ Constant Context Switching
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Build */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold mb-6">Building the Solution</h2>
                            <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                                <p>
                                    Assessiq is my answer to that problem. It's built with the same technologies that power billion-dollar startups, engineered to handle real-time concurrency and low-latency streaming.
                                </p>
                                <p>
                                    It's not just a clone; it's a rethinking of how we should assess talent—focusing on collaboration and code quality, not just memorization.
                                </p>
                            </div>
                            <ul className="mt-8 space-y-3">
                                {["Built with Next.js & TypeScript", "Real-time sync via Convex", "Video powered by Stream", "Secure Auth with Clerk"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80">
                                        <IoCheckmarkCircle className="text-purple-500 text-xl" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full mix-blend-screen opacity-20" />
                            <div className="relative z-10 p-8 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-2xl">🚀</div>
                                    <div>
                                        <div className="text-sm font-bold text-white">The Engineer's Choice</div>
                                        <div className="text-xs text-white/40">A robust, modern tech stack.</div>
                                    </div>
                                </div>
                                <div className="font-mono text-sm text-blue-300 bg-black/50 p-4 rounded-lg border border-white/5">
                                    <span className="text-purple-400">const</span> <span className="text-yellow-200">stack</span> = [<br />
                                    &nbsp;&nbsp;<span className="text-green-300">"Next.js"</span>,<br />
                                    &nbsp;&nbsp;<span className="text-green-300">"Convex"</span>,<br />
                                    &nbsp;&nbsp;<span className="text-green-300">"Clerk"</span>,<br />
                                    &nbsp;&nbsp;<span className="text-green-300">"Stream"</span><br />
                                    ];
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                {/* Tech Stack Showcase */}
                <section className="mb-32 text-center">
                    <h2 className="text-3xl font-bold mb-12">Powered by Modern Tech</h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-70">
                        {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Convex", "Clerk", "Stream", "Monaco Editor"].map((tech, i) => (
                            <span key={i} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 hover:scale-105 transition-all cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-32 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
                    <div className="space-y-2">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </section>

                {/* Footer CTA */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center py-24 border-t border-white/5"
                >
                    <div className="mb-8 flex justify-center text-purple-500">
                        <IoHeartOutline size={48} />
                    </div>
                    <h2 className="text-4xl font-bold mb-6">Thanks for checking it out!</h2>
                    <p className="text-xl text-white/50 leading-relaxed mb-12 max-w-2xl mx-auto">
                        Assessiq is a labor of love and a testament to modern web engineering. I hope you enjoy using it as much as I enjoyed building it.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform w-full sm:w-auto">
                            Try the Demo
                        </Link>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                            <IoLogoGithub size={20} /> View on GitHub
                        </a>
                    </div>
                </motion.section>

            </div>
        </div>
    );
}
