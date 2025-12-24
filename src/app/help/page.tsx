"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch, IoChevronBack, IoMail, IoTicket, IoConstruct, IoCheckmarkCircle, IoWarning, IoRocket, IoBug, IoCard, IoCodeSlash, IoChevronDown, IoServer, IoGlobe } from "react-icons/io5";

type KPIssue = {
    id: string;
    category: "Connectivity" | "IDE" | "Execution" | "Account";
    title: string;
    description: string;
    solution: React.ReactNode;
};

const KNOWLEDGE_BASE: KPIssue[] = [
    {
        id: "kb-1",
        category: "Connectivity",
        title: "Video feed is black or disconnected",
        description: "Troubleshooting camera permissions and firewall issues.",
        solution: (
            <div className="space-y-4 text-sm text-white/70">
                <p>This is usually caused by browser permissions or network firewall settings.</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Check if your browser has permission to access the Camera/Microphone. Look for a lock icon in the URL bar.</li>
                    <li>If you are on a corporate VPN, try disconnecting it as it might block WebRTC traffic.</li>
                    <li>Refresh the page. A new token will be generated for the Stream edge network.</li>
                </ol>
            </div>
        )
    },
    {
        id: "kb-2",
        category: "Execution",
        title: "Code execution timed out",
        description: "Understanding limitations of the sandbox environment.",
        solution: (
            <div className="space-y-4 text-sm text-white/70">
                <p>To prevent abuse, we enforce strict resource limits on the runner.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Time Limit:</strong> 3 seconds max execution time.</li>
                    <li><strong>Memory Limit:</strong> 128MB. Infinite loops or heavy recursion will kill the process.</li>
                    <li><strong>Network:</strong> The sandbox has NO internet access for security reasons.</li>
                </ul>
            </div>
        )
    },
    {
        id: "kb-3",
        category: "IDE",
        title: "Editor syntax highlighting not working",
        description: "Fixing Monaco Editor worker issues.",
        solution: (
            <div className="space-y-4 text-sm text-white/70">
                <p>The LSP (Language Server Protocol) workers might have crashed.</p>
                <div className="p-3 bg-white/5 rounded border border-white/10 font-mono text-xs">
                    Ctrl + Shift + R
                </div>
                <p>Performing a hard refresh usually restarts the web workers. If problem persists, check your browser console for `wasm` errors.</p>
            </div>
        )
    },
    {
        id: "kb-4",
        category: "Account",
        title: "GitHub Login failed",
        description: "Resolving OAuth callback errors.",
        solution: (
            <div className="space-y-4 text-sm text-white/70">
                <p>This happens if the OAuth state token mismatches or expires.</p>
                <p>Clear your browser cookies for `snipp.com` and `clerk.com` and try signing in again. Ensure you are not using an Incognito window that blocks third-party cookies.</p>
            </div>
        )
    },
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    // Form State
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        severity: "low" as "low" | "medium" | "critical",
        service: "video" as "video" | "code" | "platform",
        message: "",
        showServiceDropdown: false
    });

    const filteredKB = KNOWLEDGE_BASE.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("sending");

        setTimeout(() => {
            setFormStatus("success");
            setFormData({ name: "", email: "", severity: "low", service: "video", message: "", showServiceDropdown: false });
            setTimeout(() => setFormStatus("idle"), 4000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">

            {/* Navbar Placeholder */}
            <header className="fixed top-0 inset-x-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6 md:px-12 justify-between">
                <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
                    <IoChevronBack /> Back to Application
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono text-green-500 uppercase tracking-widest">System Normal</span>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

                {/* Hero Section */}
                <section className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                            Support Center
                        </h1>
                        <p className="text-lg text-white/50 max-w-2xl mx-auto">
                            Search our knowledge base for instant answers or escalate to engineering.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-xl mx-auto relative group"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-500 transition-colors">
                            <IoSearch size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search issues (e.g. 'timeout', 'black screen')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-lg shadow-2xl"
                        />
                    </motion.div>
                </section>

                {/* Knowledge Base Accordion */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest ml-1">
                            {searchQuery ? `Results for "${searchQuery}"` : "Common Technical Issues"}
                        </h2>
                        <div className="text-xs text-white/30 font-mono">
                            {filteredKB.length} articles found
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {filteredKB.map((issue) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={issue.id}
                                    className="rounded-xl bg-[#0F0F10] border border-white/5 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setActiveAccordion(activeAccordion === issue.id ? null : issue.id)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/5 
                                    ${issue.category === "Connectivity" ? "bg-orange-500/10 text-orange-400" :
                                                    issue.category === "Execution" ? "bg-red-500/10 text-red-400" :
                                                        issue.category === "IDE" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}
                                            >
                                                {issue.category === "Connectivity" && <IoGlobe size={20} />}
                                                {issue.category === "Execution" && <IoServer size={20} />}
                                                {issue.category === "IDE" && <IoCodeSlash size={20} />}
                                                {issue.category === "Account" && <IoCard size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{issue.title}</h3>
                                                <p className="text-sm text-white/50">{issue.description}</p>
                                            </div>
                                        </div>
                                        <IoChevronDown className={`text-white/30 transition-transform duration-300 ${activeAccordion === issue.id ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {activeAccordion === issue.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-white/5 bg-white/[0.02]"
                                            >
                                                <div className="p-6 pt-2 pl-[5.5rem]">
                                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Solution</div>
                                                    {issue.solution}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filteredKB.length === 0 && (
                        <div className="text-center py-12 text-white/30 border border-dashed border-white/10 rounded-xl">
                            <IoSearch className="mx-auto mb-4 text-4xl opacity-20" />
                            <p>No issues found. Try adjusting your search term.</p>
                        </div>
                    )}
                </section>

                {/* Enhanced Contact Form */}
                <section className="grid md:grid-cols-5 gap-0 rounded-3xl overflow-hidden border border-white/10 bg-[#0F0F10] shadow-2xl">

                    {/* Sidebar Info */}
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-10 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none" />
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Submit a Ticket</h2>
                            <p className="text-white/60 mb-8 leading-relaxed text-sm">
                                Can't find a solution? Escalate to our DevOps team. We usually respond within 24 hours.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <IoMail className="text-blue-400" size={18} /> support@snipp.com
                                </div>
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <IoTicket className="text-purple-400" size={18} /> API Issues: Priority 1
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 opacity-50">
                            <div className="text-xs font-mono mb-2">LAST INCIDENT</div>
                            <div className="p-3 bg-black/20 rounded border border-white/10 text-xs">
                                <span className="text-green-400 font-bold">Resolved</span> • Piston API latency high (2 days ago)
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="md:col-span-3 bg-[#0a0a0a] p-10 relative">
                        {formStatus === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-12"
                            >
                                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
                                    <IoCheckmarkCircle size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Ticket #8492 Created</h3>
                                <p className="text-white/50 text-sm max-w-xs mx-auto">
                                    We've sent a confirmation email to <strong>{formData.email}</strong>. You can close this page.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20"
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Email</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none focus:bg-white/[0.05] transition-all text-white placeholder:text-white/20"
                                            placeholder="Enter email"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Affected Service</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, showServiceDropdown: !prev.showServiceDropdown }))}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none focus:bg-white/[0.05] transition-all text-white text-left flex items-center justify-between"
                                            >
                                                {formData.service === 'video' && 'Video / Audio'}
                                                {formData.service === 'code' && 'Code Execution'}
                                                {formData.service === 'platform' && 'Account / Billing'}
                                                <IoChevronDown className={`text-white/30 transition-transform ${formData.showServiceDropdown ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {formData.showServiceDropdown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 5 }}
                                                        className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                                    >
                                                        {[
                                                            { value: 'video', label: 'Video / Audio' },
                                                            { value: 'code', label: 'Code Execution' },
                                                            { value: 'platform', label: 'Account / Billing' }
                                                        ].map((option) => (
                                                            <button
                                                                key={option.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, service: option.value as any, showServiceDropdown: false }));
                                                                }}
                                                                className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${formData.service === option.value ? 'text-blue-400 bg-blue-500/10' : 'text-white'}`}
                                                            >
                                                                {option.label}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Severity</label>
                                        <div className="grid grid-cols-3 gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/10">
                                            {["low", "medium", "critical"].map((acc) => (
                                                <button
                                                    key={acc}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, severity: acc as any })}
                                                    className={`text-xs font-bold capitalize py-2 rounded-lg transition-all ${formData.severity === acc
                                                        ? (acc === "critical" ? "bg-red-500/20 text-red-500 border border-red-500/30" : "bg-white/10 text-white border border-white/10")
                                                        : "text-white/40 hover:text-white/60"
                                                        }`}
                                                >
                                                    {acc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-white/40 uppercase mb-2 ml-1">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm focus:border-blue-500 focus:outline-none focus:bg-white/[0.05] transition-all text-white resize-none placeholder:text-white/20"
                                        placeholder="Describe exactly what happened..."
                                    />
                                </div>

                                <button
                                    disabled={formStatus === "sending"}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold tracking-wide transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {formStatus === "sending" ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting Ticket...
                                        </>
                                    ) : (
                                        "Submit Ticket"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </section>

            </main>
        </div>
    );
}
