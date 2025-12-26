"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Briefcase } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RoleSelectionDialog({ isOpen }: { isOpen: boolean }) {
    const setUserRole = useMutation(api.users.setUserRole);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleRoleSelection = async (role: "candidate" | "interviewer") => {
        setIsUpdating(true);
        try {
            await setUserRole({ role });
            toast.success(`Welcome! Your role is set to ${role}.`);
            // The parent component or Convex query will naturally re-render and close the modal
            // once roleSelected becomes true.
        } catch (error) {
            console.error(error);
            toast.error("Failed to set role. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            {/* Empty onOpenChange prevents closing by clicking outside/Escape */}
            <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center">Choose Your Role</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        Select how you would like to use AssessIQ today.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-4">
                    {/* Candidate Card */}
                    <div
                        className="cursor-pointer group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg bg-card/50 hover:bg-card"
                        onClick={() => handleRoleSelection("candidate")}
                    >
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Candidate</h3>
                        <p className="text-muted-foreground text-center">
                            I want to practice interviews and improve my skills with AI.
                        </p>
                    </div>

                    {/* Interviewer Card */}
                    <div
                        className="cursor-pointer group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg bg-card/50 hover:bg-card"
                        onClick={() => handleRoleSelection("interviewer")}
                    >
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Briefcase className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">Interviewer</h3>
                        <p className="text-muted-foreground text-center">
                            I want to conduct interviews and assess candidates.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
