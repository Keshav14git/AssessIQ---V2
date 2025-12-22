import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { CalendarIcon, CheckCircle2Icon, Trash2Icon, XCircleIcon, EyeIcon, ChartBarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import InterviewerReport from "./InterviewerReport";
import CandidateInsights from "./CandidateInsights";

type Interview = Doc<"interviews">;

function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const { isInterviewer, isCandidate } = useUserRole();
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);
  const deleteInterview = useMutation(api.interviews.deleteInterview);

  const [showReport, setShowReport] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const status = getMeetingStatus(interview);
  const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a");

  const handleStatusUpdate = async (status: string, result?: "pass" | "fail") => {
    try {
      await updateStatus({
        id: interview._id,
        status,
        ...(result && { result }),
      });
      toast.success(result ? `Interview marked as ${result}` : `Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this interview?")) return;
    try {
      await deleteInterview({ id: interview._id });
      toast.success("Interview deleted");
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              {formattedDate}
            </div>

            <div className="flex items-center gap-2">
              {isInterviewer && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              )}

              <Badge
                variant={
                  status === "live"
                    ? "default"
                    : status === "upcoming"
                      ? "secondary"
                      : interview.result === "pass"
                        ? "default"
                        : interview.result === "fail"
                          ? "destructive"
                          : "outline"
                }
              >
                {status === "live"
                  ? "Live Now"
                  : status === "upcoming"
                    ? "Upcoming"
                    : interview.result === "pass"
                      ? "Passed"
                      : interview.result === "fail"
                        ? "Failed"
                        : "Completed"}
              </Badge>
            </div>
          </div>

          <CardTitle>{interview.title}</CardTitle>

          {interview.description && (
            <CardDescription className="line-clamp-2">{interview.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="flex-grow space-y-4">
          {status === "live" && (
            <Button className="w-full" onClick={() => joinMeeting(interview.streamCallId)}>
              Join Meeting
            </Button>
          )}

          {status === "upcoming" && (
            <Button variant="outline" className="w-full" disabled>
              Waiting to Start
            </Button>
          )}

          {/* REPORTING BUTTONS (For Completed or Past Interviews) */}
          {status !== 'upcoming' && (
            <div className="flex flex-col gap-2 w-full">
              {isInterviewer && (
                <Button
                  variant="outline"
                  className="w-full border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => setShowReport(true)}
                >
                  <EyeIcon className="size-4 mr-2" /> View Report
                </Button>
              )}

              {isCandidate && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowInsights(true)}
                >
                  <ChartBarIcon className="size-4 mr-2" /> View Insights
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* INTERVIEWER ACTIONS */}
        {isInterviewer && status === "completed" && !interview.result && (
          <CardFooter className="gap-2 mt-auto">
            <Button
              className="flex-1"
              onClick={() => handleStatusUpdate("completed", "pass")}
            >
              <CheckCircle2Icon className="h-4 w-4 mr-2" />
              Pass
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleStatusUpdate("completed", "fail")}
            >
              <XCircleIcon className="h-4 w-4 mr-2" />
              Fail
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* DIALOGS */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full Proctoring Report</DialogTitle>
          </DialogHeader>
          <InterviewerReport interviewId={interview._id} />
        </DialogContent>
      </Dialog>

      <Dialog open={showInsights} onOpenChange={setShowInsights}>
        <DialogContent className="max-w-lg">
          <CandidateInsights interviewId={interview._id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export default MeetingCard;
