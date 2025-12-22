import { ShieldAlertIcon, ShieldCheckIcon, AlertCircleIcon, Loader2Icon } from "lucide-react";

interface ProctoringUIProps {
    trustScore: number;
    status: "initializing" | "ready" | "error" | "no-stream";
    debugInfo?: { faces: number; ratio: number };
}

export default function ProctoringUI({ trustScore, status, debugInfo }: ProctoringUIProps) {
    if (status === "initializing") {
        return (
            <div className="absolute top-4 left-4 z-50">
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg animate-pulse">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Initializing...</span>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="absolute top-4 left-4 z-50">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Error</span>
                </div>
            </div>
        );
    }

    if (status === "no-stream") {
        return (
            <div className="absolute top-4 left-4 z-50">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                    <AlertCircleIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Camera Unavailable</span>
                </div>
            </div>
        );
    }

    // Determine status based on score
    let statusColor = "text-green-500 bg-green-500/10 border-green-500/20";
    let icon = <ShieldCheckIcon className="size-5" />;
    let label = "Trusted";

    if (trustScore < 80) {
        statusColor = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
        label = "Warning";
    }
    if (trustScore < 50) {
        statusColor = "text-red-500 bg-red-500/10 border-red-500/20";
        icon = <ShieldAlertIcon className="size-5" />;
        label = "At Risk";
    }

    return (
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
            <div className={`backdrop-blur-md rounded-full px-4 py-2 border flex items-center gap-3 shadow-lg transition-colors duration-500 ${statusColor}`}>
                {icon}
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">Trust Score</span>
                    <span className="text-sm font-bold">{trustScore}%</span>
                </div>
            </div>

            {/* DEBUG INFO - Helps user diagnose why AI logic isn't triggering */}
            {debugInfo && (
                <div className="bg-black/50 backdrop-blur text-xs text-zinc-400 px-3 py-1 rounded-full border border-white/5 font-mono ml-1 w-fit">
                    F: {debugInfo.faces} | R: {debugInfo.ratio}
                </div>
            )}
        </div>
    );
}
