import { Button } from "./ui/button";
import { CheckCircleIcon, HomeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MeetingEndScreenProps {
    isTerminated?: boolean;
}

export default function MeetingEndScreen({ isTerminated = false }: MeetingEndScreenProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-full z-50 bg-black text-white p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className={`p-4 rounded-full ${isTerminated ? "bg-red-500/10" : "bg-green-500/10"}`}>
                {isTerminated ? (
                    <div className="text-red-500 text-5xl">⚠️</div>
                ) : (
                    <CheckCircleIcon className="size-16 text-green-500" />
                )}
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    {isTerminated ? "Interview Terminated" : "Interview Completed"}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    {isTerminated
                        ? "Multiple proctoring violations were detected. The system has automatically ended your session."
                        : "Thank you for completing the interview. Your responses have been recorded."}
                </p>
            </div>

            <Button
                className="mt-6 bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                size="lg"
                onClick={() => router.push("/panel")}
            >
                <HomeIcon className="mr-2 size-4" />
                Return to Panel
            </Button>
        </div>
    );
}
