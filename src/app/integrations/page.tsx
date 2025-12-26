"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoShieldCheckmark, IoServer, IoVideocam, IoCodeSlash, IoClose, IoCheckmarkCircle } from "react-icons/io5";

interface Integration {
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    details: {
        title: string;
        overview: string;
        features: string[];
        technical: string;
    };
}

const integrations: Integration[] = [
    {
        name: "Clerk",
        description: "The most comprehensive user management platform. It handles secure authentication, session management, and granular user profiles with enterprise-grade security.",
        icon: <IoShieldCheckmark className="w-8 h-8" />,
        color: "group-hover:text-purple-400",
        bg: "from-purple-900/50 to-purple-950/30",
        details: {
            title: "Complete Identity & User Management",
            overview: "Clerk is more than just a login box. It's a complete suite of identity management tools designed for the modern web. We use Clerk to ensure that every candidate and interviewer has a secure, persistent identity across sessions, handling all the complexity of authentication so we can focus on the interview experience.",
            features: [
                "Multi-factor Authentication (MFA) enforcement",
                "Social Login (Google, GitHub, Microsoft, etc.)",
                "Bot protection and leaky password checks",
                "Real-time session management and revocation"
            ],
            technical: "Implemented via Next.js middleware for edge-compatible authentication. User metadata allows us to store role-based access control (RBAC) claims directly on the user session, ensuring immediate permission checks without database lookups."
        }
    },
    {
        name: "Convex",
        description: "A revolutionary reactive backend-as-a-service. It powers our entire real-time data layer, ensuring that every keystroke and status change is synchronized instantly.",
        icon: <IoServer className="w-8 h-8" />,
        color: "group-hover:text-orange-400",
        bg: "from-orange-900/50 to-orange-950/30",
        details: {
            title: "The Reactive Database for App Development",
            overview: "Convex replaces the traditional glue code of databases, servers, and cache invalidation. It allows AssessIQ to function like a multiplayer game, where state changes are pushed to all clients instantly. This implies no stale data, ever.",
            features: [
                "Automatic caching and real-time subscriptions",
                "ACID-compliant transactions",
                "Scheduled jobs and cron tasks",
                "End-to-end type safety with TypeScript"
            ],
            technical: "We rely on Convex's websocket connection to sync the code editor state. When one user types, the operational transform delta is sent to Convex and broadcasted to all other participants in the room within milliseconds, ensuring conflict-free collaborative editing."
        }
    },
    {
        name: "Stream",
        description: "The world's leading video and audio SDK. It provides crystal-clear, low-latency 1080p video conferencing capabilities for seamless interviews.",
        icon: <IoVideocam className="w-8 h-8" />,
        color: "group-hover:text-blue-400",
        bg: "from-blue-900/50 to-blue-950/30",
        details: {
            title: "Enterprise-Grade Video & Audio",
            overview: "Technical interviews rely on clear communication. Stream provides the infrastructure for high-definition, low-latency video calls that scale to millions of users globally. It ensures that even with poor network conditions, the interview can proceed smoothly.",
            features: [
                "Global Edge Network for < 300ms latency",
                "Adaptive bitrate streaming for poor connections",
                "Noise cancellation and echo reduction",
                "Screen sharing and recording capabilities"
            ],
            technical: "AssessIQ integrates Stream's React SDK to embed video directly into the interview workspace. This allows for a picture-in-picture mode and side-by-side coding without context switching, managed entirely by client-side hooks."
        }
    },
    {
        name: "Monaco Editor",
        description: "The industrial-grade code editor that powers VS Code. It brings a familiar, powerful coding environment to the browser with advanced features.",
        icon: <IoCodeSlash className="w-8 h-8" />,
        color: "group-hover:text-blue-500",
        bg: "from-blue-800/40 to-blue-950/30",
        details: {
            title: "The VS Code Experience in the Browser",
            overview: "Monaco is the code editor that powers VS Code. By using it, we give candidates a familiar environment where they can be their most productive, with all the keyboard shortcuts and features they expect from a desktop IDE.",
            features: [
                "Syntax highlighting for 100+ languages",
                "IntelliSense (code completion and suggestions)",
                "Inline error validation and linting",
                "Multi-cursor editing and minimap"
            ],
            technical: "We use a customized build of Monaco optimized for performance. It is hooked into our custom language server protocol (LSP) proxy to provide language-specific features and runs in a web worker to keep the main thread unblocked."
        }
    }
];

export default function IntegrationsPage() {
    const [selected, setSelected] = useState<Integration | null>(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-green-500/30 selection:text-green-200 font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 mt-16">
                {/* Navbar Placeholder */}
                <header className="fixed top-0 inset-x-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6 md:px-12 justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                        <IoChevronBack /> Back to Application
                    </Link>
                </header>

                {/* Header */}
                <div className="max-w-3xl mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black tracking-tight mb-8"
                    >
                        Connect your <br />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Workflow.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-white/50 leading-relaxed"
                    >
                        AssessIQ plays nice with the tools you already love. Streamline your hiring process by connecting your favorite platforms.
                    </motion.p>
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {integrations.map((item, index) => (
                        <motion.div
                            layoutId={`card-${item.name}`}
                            key={item.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative overflow-hidden flex flex-col items-start"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            <div className={`mb-6 p-4 rounded-2xl bg-white/5 w-fit ${item.color} transition-colors`}>
                                {item.icon}
                            </div>

                            <h3 className="text-xl font-bold mb-3">{item.name}</h3>
                            <p className="text-white/40 leading-relaxed text-sm mb-8 min-h-[60px]">
                                {item.description}
                            </p>

                            <button
                                onClick={() => setSelected(item)}
                                className="mt-auto flex items-center gap-2 text-sm font-medium text-white/40 group-hover:text-white transition-colors cursor-pointer"
                            >
                                View More <IoChevronBack className="rotate-180" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-32 p-12 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 text-center">
                    <h2 className="text-2xl font-bold mb-4">Don&apos;t see what you need?</h2>
                    <p className="text-white/50 mb-8">Our API is open and extensible. Build your own integration in minutes.</p>
                    <Link href="/docs" className="inline-block px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
                        Read the Docs
                    </Link>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            layoutId={`card-${selected.name}`}
                            className="relative w-full max-w-2xl bg-[#0F0F10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar z-50"
                        >
                            {/* Glossy Header BG */}
                            <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-br ${selected.bg} opacity-30`} />

                            <div className="relative p-8 md:p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 w-fit ${selected.color}`}>
                                            {selected.icon}
                                        </div>
                                        <div>
                                            <motion.h2 className="text-3xl font-bold mb-1">{selected.name}</motion.h2>
                                            <p className="text-sm text-white/60 font-medium">{selected.details.title}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <IoClose size={20} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Overview</h3>
                                        <p className="text-white/80 leading-relaxed text-base">{selected.details.overview}</p>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
                                            Key Features
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selected.details.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3 text-sm text-white/70 bg-white/[0.03] p-3 rounded-lg border border-white/5">
                                                    <IoCheckmarkCircle className="mt-0.5 text-green-500 shrink-0" size={16} />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
                                            Technical Implementation
                                        </h3>
                                        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white/60 leading-relaxed font-mono">
                                            {selected.details.technical}
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5 flex justify-end">
                                    <button
                                        onClick={() => setSelected(null)}
                                        className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors"
                                    >
                                        Hide Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
