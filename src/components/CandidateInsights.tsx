import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BrainIcon, CalendarIcon, EyeIcon } from "lucide-react";
import LogoLoader from "./ui/LogoLoader";

interface CandidateInsightsProps {
    interviewId: string; // Id<"interviews">
}

export default function CandidateInsights({ interviewId }: CandidateInsightsProps) {
    const incidents = useQuery(api.interviews.getIncidents, {
        interviewId: interviewId as Id<"interviews">,
    });

    if (!incidents) return <div className="h-40 flex items-center justify-center"><LogoLoader /></div>;

    if (incidents.length === 0) {
        return (
            <div className="text-center p-8 space-y-4">
                <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <BrainIcon className="size-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Excellent Focus!</h3>
                <p className="text-muted-foreground">No violations recorded. Your proctoring score remains 100%.</p>
            </div>
        );
    }

    const focusIssues = incidents.filter(i => i.type === "looking_away").length;
    const noFace = incidents.filter(i => i.type === "no_face").length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Your Interview Insights</h2>
                <p className="text-sm text-muted-foreground">Feedback from the automated proctoring system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Trust Score Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-500">
                            {Math.max(0, 100 - (incidents.length * 5))}%
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Based on {incidents.length} recorded events.</p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Focus Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-1 text-sm text-zinc-300">
                            {focusIssues > 0 && (
                                <li className="flex items-center gap-2">
                                    <EyeIcon className="size-4 text-orange-400" />
                                    <span>{focusIssues} focus interruptions detected</span>
                                </li>
                            )}
                            {noFace > 0 && (
                                <li className="flex items-center gap-2">
                                    <span className="text-red-400 text-xs">⚠️</span>
                                    <span>{noFace} times face not visible</span>
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg text-xs text-yellow-200/80">
                <strong>Note:</strong> This data is available to the interviewer. Consistent violations may impact the final decision.
            </div>
        </div>
    );
}
