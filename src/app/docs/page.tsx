"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoChevronBack, IoLogoGithub, IoServer, IoShieldCheckmark, IoVideocam, IoCodeSlash, IoList, IoImage, IoFlash, IoGitNetwork, IoLockClosed } from "react-icons/io5";

const sections = [
    { id: "overview", label: "01. System Overview" },
    { id: "architecture", label: "02. High-Level Architecture" },
    { id: "tech-stack", label: "03. Technology Stack" },
    { id: "features", label: "04. Feature Deep Dives" },
    { id: "database", label: "05. Database Schema" },
    { id: "workflow", label: "06. Application Workflow" },
    { id: "scalability", label: "07. Scalability & Performance" },
];

const CodeBlock = ({ language, code }: { language: string, code: string }) => (
    <div className="rounded-lg bg-[#1e1e1e] border border-white/10 overflow-hidden my-4 group">
        <div className="flex items-center px-4 py-2 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <span className="ml-auto text-xs text-white/30 font-mono">{language}</span>
        </div>
        <pre className="p-4 overflow-x-auto text-sm font-mono text-blue-100 leading-relaxed">
            <code>{code}</code>
        </pre>
    </div>
);

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const handleScroll = () => {
            // Check if user is at the bottom of the page
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            const scrollPosition = window.scrollY + 200;
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
            </div>

            {/* Top Navigation Bar */}
            <header className="fixed top-0 inset-x-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6 md:px-12">
                <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mr-12 text-sm font-medium">
                    <IoChevronBack /> Back to Application
                </Link>
                <div className="font-bold text-lg tracking-tight">
                    AssessIQ <span className="text-white/40 font-normal ml-2">Developer Docs</span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-white/40 hover:text-white transition-colors">
                        <IoLogoGithub size={20} />
                    </a>
                </div>
            </header>

            <div className="pt-24 max-w-[90rem] mx-auto px-6 flex items-start gap-12 relative">

                {/* Sidebar Navigation (Sticky) */}
                <aside className="hidden lg:block w-72 sticky top-24 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] pr-6">
                    <div className="mb-6 text-xs font-bold text-white/40 uppercase tracking-widest pl-4">Table of Contents</div>
                    <nav className="space-y-1 relative border-l border-white/5">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollTo(section.id)}
                                className={`block w-full text-left py-2.5 pl-4 border-l-2 transition-all text-sm ${activeSection === section.id
                                    ? "border-purple-500 text-white font-semibold bg-purple-500/5 translate-x-1"
                                    : "border-transparent text-white/50 hover:text-white hover:border-white/20"
                                    }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0 pb-96 max-w-4xl">

                    {/* Overview */}
                    <section id="overview" className="mb-20 scroll-mt-24">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6 border border-purple-500/20">
                                v1.0.0
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">System Documentation</h1>
                            <p className="text-xl text-white/60 leading-relaxed mb-8">
                                AssessIQ is a comprehensive technical interview platform engineering for low-latency collaboration. It unifies video conferencing, code execution, and real-time synchronization into a single, cohesive interface.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h3 className="text-lg font-bold mb-2 text-white">Problem Statement</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        Traditional interviewing tools rely on disjointed applications (Zoom + Google Docs + HackerRank), leading to context switching and improved candidate anxiety.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h3 className="text-lg font-bold mb-2 text-white">Technical Solution</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">
                                        A specialized IDE that syncs state via WebSockets (Convex), verifies identity at the edge (Clerk), and isolates code execution (RPC to Piston).
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <hr className="border-white/5 mb-20" />

                    {/* Architecture */}
                    <section id="architecture" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoGitNetwork className="text-purple-500" />
                            High-Level Architecture
                        </h2>
                        <p className="text-white/60 leading-relaxed mb-6">
                            The system follows a <strong>Serverless & Event-Driven</strong> architecture. We minimize stateful services on our own infrastructure by leveraging specialized managed platforms. This ensures high availability and reduces operational overhead.
                        </p>
                        <div className="mb-8 bg-neutral-900 rounded-xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                            <Image
                                src="/Architecture.png"
                                alt="AssessIQ System Architecture"
                                width={1200}
                                height={675}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Data Flow Components</h3>
                            <div className="grid gap-4">
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <div className="font-bold text-white mb-1">Client (Next.js)</div>
                                    <p className="text-sm text-white/50">React 18 Server Components for layout, Client Components for interactivity. Uses optimistic UI updates for perceived zero-latency.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <div className="font-bold text-white mb-1">Sync Engine (Convex)</div>
                                    <p className="text-sm text-white/50">A purely reactive database. Clients subscribe to queries; the server pushes updates immediately upon transaction commit. No manual polling required.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <div className="font-bold text-white mb-1">Execution Sandbox (Piston)</div>
                                    <p className="text-sm text-white/50">Stateless container orchestration. Receives source code + inputs, runs in isolated Docker container with strict resource limits, and returns stdout/stderr.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5 mb-20" />

                    {/* Tech Stack */}
                    <section id="tech-stack" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoCodeSlash className="text-green-500" />
                            Technology Stack & Reasoning
                        </h2>

                        {/* Frontend */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Frontend
                            </h3>
                            <div className="space-y-4">
                                <div className="pl-4 border-l-2 border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">Next.js 14 (App Router)</span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">
                                        <strong>Why?</strong> The App Router allows us to fetch data on the server for initial load (reducing TTI) while keeping the editor highly interactive with Client Components.
                                    </p>
                                </div>
                                <div className="pl-4 border-l-2 border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">Tailwind CSS + Framer Motion</span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">
                                        <strong>Why?</strong> Utility-first CSS improves developer velocity. Framer Motion handles complex layout transitions (shared element transitions) that CSS alone cannot easily achieve.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Backend */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Backend & Data
                            </h3>
                            <div className="space-y-4">
                                <div className="pl-4 border-l-2 border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">Convex</span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">
                                        <strong>Why?</strong> Unlike Firebase, Convex provides ACID transactions and Strong Consistency. This is critical for an interview state where two users editing the same line must resolve deterministically.
                                    </p>
                                    <CodeBlock language="typescript" code={`// Example Convex Mutation: Sending lines of code\nexport const sendCode = mutation({\n  args: { roomId: v.string(), code: v.string() },\n  handler: async (ctx, args) => {\n    await ctx.db.patch(args.roomId, { code: args.code });\n  },\n});`} />
                                </div>
                            </div>
                        </div>

                        {/* Auth */}
                        <div className="mb-12">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Security & Identity
                            </h3>
                            <div className="space-y-4">
                                <div className="pl-4 border-l-2 border-white/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold">Clerk</span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">
                                        <strong>Why?</strong> Managing session cookies and JWT rotation securely is hard. Clerk handles MFA, social login, and session revocation out of the box. We use Clerk's JWT templates to pass user identity to Convex.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5 mb-20" />

                    {/* Feature Deep Dive */}
                    <section id="features" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoFlash className="text-yellow-500" />
                            Feature Deep Dives
                        </h2>

                        <div className="space-y-12">
                            {/* Execution */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Secure Code Execution</h3>
                                <p className="text-white/60 mb-4">
                                    Running untrusted code is dangerous. We follow a strict isolation protocol.
                                </p>
                                <ol className="list-decimal pl-5 space-y-2 text-white/70 mb-4">
                                    <li>User code is captured from the Monaco Editor instance.</li>
                                    <li>The code is sent to a Convex Action (Server-side function).</li>
                                    <li>Convex proxies the request to the Piston API.</li>
                                    <li>Piston spins up an ephemeral Docker container without network access.</li>
                                    <li>Code runs; output/errors are captured and returned.</li>
                                    <li>Container is destroyed immediately.</li>
                                </ol>
                                <CodeBlock language="typescript" code={`// Convex Action for Code Execution\nexport const executeCode = action({\n  args: { language: v.string(), code: v.string() },\n  handler: async (ctx, args) => {\n    const response = await fetch("https://emkc.org/api/v2/piston/execute", {\n       method: "POST",\n       body: JSON.stringify({ language: args.language, version: "*", files: [{ content: args.code }] })\n    });\n    return response.json();\n  }\n});`} />
                            </div>

                            {/* Editor Config */}
                            <div>
                                <h3 className="text-2xl font-bold mb-4">Monaco Editor Configuration</h3>
                                <p className="text-white/60 mb-4">
                                    We don't just use the default text area. We configure Monaco to provide a near-native VS Code experience.
                                </p>
                                <ul className="grid grid-cols-2 gap-4 text-sm text-white/70">
                                    <li className="p-3 bg-white/5 rounded border border-white/5">Auto-closing brackets & quotes enabled</li>
                                    <li className="p-3 bg-white/5 rounded border border-white/5">Minimap enabled for quick navigation</li>
                                    <li className="p-3 bg-white/5 rounded border border-white/5">Semantic highlighting for TypeScript</li>
                                    <li className="p-3 bg-white/5 rounded border border-white/5">Read-only mode for past interviews</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5 mb-20" />

                    {/* Database */}
                    <section id="database" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoList className="text-pink-500" />
                            Database Schema
                        </h2>
                        <p className="text-white/60 leading-relaxed mb-6">
                            While Convex is a document database, we enforce a relational structure via schema validation.
                        </p>
                        <div className="mb-8 bg-neutral-900 rounded-xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                            <Image
                                src="/Uml.png"
                                alt="AssessIQ ER Diagram"
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <h4 className="font-mono text-yellow-400 mb-2">users table</h4>
                                <p className="text-sm text-white/60 mb-4">Stores profile information. The <code>clerkId</code> is the foreign key to the Auth provider.</p>
                                <ul className="space-y-1 font-mono text-xs text-white/40">
                                    <li>_id: Id&lt;"users"&gt;</li>
                                    <li>name: string</li>
                                    <li>email: string</li>
                                    <li>role: "candidate" | "interviewer"</li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <h4 className="font-mono text-yellow-400 mb-2">interviews table</h4>
                                <p className="text-sm text-white/60 mb-4">The core session object. <code>streamCallId</code> links to the video session.</p>
                                <ul className="space-y-1 font-mono text-xs text-white/40">
                                    <li>_id: Id&lt;"interviews"&gt;</li>
                                    <li>roomId: string (indexed)</li>
                                    <li>status: "scheduled" | "active" | "completed"</li>
                                    <li>candidateId: Id&lt;"users"&gt;</li>
                                    <li>currentLanguage: string</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5 mb-20" />

                    {/* Workflow */}
                    <section id="workflow" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoImage className="text-blue-500" />
                            Application Workflow
                        </h2>
                        <div className="mb-8 bg-neutral-900 rounded-xl border border-white/10 p-2 overflow-hidden shadow-2xl">
                            <Image
                                src="/Workflow.png"
                                alt="AssessIQ Application Workflow"
                                width={1200}
                                height={600}
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <h3 className="text-xl font-bold mb-4">Critical Path: The Interview Session</h3>
                            <p className="text-white/60 mb-4">
                                The most complex part of the application is the initialization of the interview room. This happens in parallel to minimize waiting time:
                            </p>
                            <ol className="list-decimal pl-5 space-y-3 text-white/70">
                                <li><strong>Route Load:</strong> Next.js Server verifies `roomId` exists.</li>
                                <li><strong>Auth Check:</strong> Checks if user has permission to view this room.</li>
                                <li><strong>Convex Sub:</strong> Client establishes WebSocket and subscribes to `interview` document.</li>
                                <li><strong>Stream Init:</strong> Client generates a token serverside, then connects to Stream's edge network for video.</li>
                                <li><strong>Editor Init:</strong> Monaco Editor lazy-loads its heavy 3MB bundle in the background.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Scalability */}
                    <section id="scalability" className="mb-20 scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <IoServer className="text-red-500" />
                            Scalability & Performance
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3">Convex Auto-Scaling</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Convex is built on top of a distributed transactional key-value store. It automatically shards data and scales read throughput linearly. We can handle thousands of concurrent interview sessions without provisioning new servers.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Edge Caching</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Static assets and the initial HTML shell are cached on Vercel's Edge Network (CDN). This ensures that the time-to-first-byte (TTFB) is under 100ms globally, providing an instant loading feel.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* End of Content Indicator */}
                    <div className="mt-24 border-t border-white/5 flex items-center justify-center pt-8">
                        <div className="w-24 h-1 rounded-full bg-white/10" />
                    </div>

                </main>
            </div>
        </div>
    );
}
