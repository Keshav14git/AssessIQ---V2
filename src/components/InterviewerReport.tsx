import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangleIcon, UserXIcon, UsersIcon, EyeOffIcon, ShieldAlertIcon } from "lucide-react";
import LogoLoader from "./ui/LogoLoader";

interface InterviewerReportProps {
    interviewId: string; // Id<"interviews">
}

export default function InterviewerReport({ interviewId }: InterviewerReportProps) {
    const incidents = useQuery(api.interviews.getIncidents, {
        interviewId: interviewId as Id<"interviews">,
    });

    if (!incidents) return <div className="h-40 flex items-center justify-center"><LogoLoader /></div>;

    if (incidents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                <ShieldAlertIcon className="w-12 h-12 mb-4 opacity-20" />
                <p>No incidents recorded for this session.</p>
            </div>
        );
    }

    // Calculate Breakdown
    const stats = {
        looking_away: incidents.filter(i => i.type === "looking_away").length,
        no_face: incidents.filter(i => i.type === "no_face").length,
        multiple_faces: incidents.filter(i => i.type === "multiple_faces").length,
    };

    const total = incidents.length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-red-950/20 border-red-500/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-500">Total Violations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{total}</div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <EyeOffIcon className="size-4" /> Looking Away
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.looking_away}</div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <UserXIcon className="size-4" /> No Face
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.no_face}</div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                            <UsersIcon className="size-4" /> Multiple Faces
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.multiple_faces}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Logs</h3>
                <div className="border border-white/5 rounded-lg divide-y divide-white/5 max-h-60 overflow-y-auto">
                    {incidents.slice().reverse().map((incident) => (
                        <div key={incident._id} className="p-3 text-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {incident.type === 'looking_away' && <EyeOffIcon className="text-yellow-500 size-4" />}
                                {incident.type === 'no_face' && <UserXIcon className="text-orange-500 size-4" />}
                                {incident.type === 'multiple_faces' && <UsersIcon className="text-red-500 size-4" />}
                                <span className="text-zinc-300">
                                    {incident.type === 'looking_away' ? "Looked away from screen" :
                                        incident.type === 'no_face' ? "Face not visible" :
                                            "Multiple people detected"}
                                </span>
                            </div>
                            <span className="text-zinc-500 text-xs font-mono">
                                {new Date(incident.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
