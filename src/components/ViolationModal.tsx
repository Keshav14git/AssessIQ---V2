import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ViolationModalProps {
    isOpen: boolean;
    onContinue: () => void;
    title: string;
    description: string;
}

export default function ViolationModal({
    isOpen,
    onContinue,
    title,
    description,
}: ViolationModalProps) {
    // Vibrate on mount if open
    useEffect(() => {
        if (isOpen && typeof navigator !== "undefined" && navigator.vibrate) {
            // Vibrate pattern: 200ms on, 100ms off, 200ms on
            navigator.vibrate([200, 100, 200]);
        }
    }, [isOpen]);

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="bg-red-950/20 border-red-500/50 backdrop-blur-xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                        <AlertTriangleIcon className="size-6 animate-pulse" />
                        <AlertDialogTitle className="text-xl font-bold uppercase tracking-wide">
                            Proctoring Alert
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogTitle className="text-white text-lg">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-red-200/80 text-base">
                        {description}
                    </AlertDialogDescription>
                    <div className="mt-2 text-xs text-red-500/60 font-mono border border-red-500/20 p-2 rounded bg-black/20">
                        This incident has been logged and flagged for the interviewer.
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        onClick={onContinue}
                        className="bg-red-600 hover:bg-red-700 text-white border-0 font-bold"
                    >
                        I Understand, Continue Interview
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
