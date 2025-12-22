import {
  CallControls,
  CallingState,
  CallParticipantsList,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import LogoLoader from "./ui/LogoLoader";
import { LayoutListIcon, LoaderIcon, UsersIcon, CopyIcon, CheckIcon, ShareIcon, ShieldAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import EndCallButton from "./EndCallButton";
import CodeEditor from "./CodeEditor";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useFaceMonitor } from "@/hooks/useFaceMonitor";
import ProctoringUI from "./ProctoringUI";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ViolationModal from "./ViolationModal";
import InterviewerReport from "./InterviewerReport";
import MeetingEndScreen from "./MeetingEndScreen";
import { playAlertSound, playTerminationSound } from "@/lib/sounds";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const { useCallCallingState, useLocalParticipant } = useCallStateHooks();
  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();

  const call = useCall();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { isCandidate } = useUserRole();

  // FETCH CONVEX INTERVIEW DATA
  const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
    streamCallId: call?.id || ""
  });

  // AI PROCTORING LOGIC
  // We only run this for candidates.
  // We assume 'localParticipant.videoStream' is the MediaStream.
  // Note: Stream SDK types might be tricky. If videoStream is missing, 
  // we might need to grab it from 'call.camera.state.mediaStream'.
  // However, localParticipant usually has 'videoStream' or similar. 
  // Let's assume we pass the stream if available.

  // Actually, robust way in Stream is: call?.camera?.state?.mediaStream (BehaviorSubject?)
  // Let's try simple prop passing first.

  // MODAL STATE
  const [violation, setViolation] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: string;
  }>({ isOpen: false, title: "", description: "", type: "" });

  const [warningCount, setWarningCount] = useState(0);
  const logIncident = useMutation(api.interviews.logIncident);
  const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);

  const [isTerminated, setIsTerminated] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true); // Default to true to prevent flash, effect will correct it

  // FULL SCREEN ENFORCEMENT (Candidate Only)
  useEffect(() => {
    if (!isCandidate) return;

    const handleFullScreenChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullScreen(isFs);
      if (!isFs) {
        toast.error("⚠️ Violation: You must stay in Full Screen mode!");
      }
    };

    // Initial check
    setIsFullScreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, [isCandidate]);

  const restoreFullScreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (e) {
      console.error("Failed to restore full screen", e);
    }
  };

  // LISTEN FOR EVENTS (INTERVIEWER SIDE)
  useEffect(() => {
    if (!call || isCandidate) return;

    const unsubscribe = call.on("custom", (event: any) => {
      console.log("Received custom event:", event); // DEBUG

      if (event.custom?.type === 'proctoring_alert') {
        playAlertSound();
        toast.error("🚨 CRITICAL PROCTORING ALERT: Candidate has multiple violations!", {
          duration: 5000,
          style: { border: '2px solid red', backgroundColor: '#fee2e2', color: '#b91c1c' }
        });
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
      }

      if (event.custom?.type === 'interview_terminated') {
        const reason = event.custom?.data?.reason || "Candidate exceeded maximum proctoring violation limit.";
        playTerminationSound();
        toast.error(`❌ Interview Terminated: ${reason}`, {
          duration: 8000,
          style: { border: '2px solid red', backgroundColor: '#fee2e2', color: '#b91c1c' }
        });

        const cleanupAndRedirect = async () => {
          try {
            await call.leave();
          } catch (e) {
            console.error("Failed to leave call on termination", e);
          }
          router.push("/panel");
        };

        setTimeout(cleanupAndRedirect, 2000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [call, isCandidate]);

  const { trustScore, status, debugInfo } = useFaceMonitor({
    stream: isCandidate && localParticipant?.videoStream ? localParticipant.videoStream : null,
    onViolation: async (type) => {
      if (isTerminated) return; // Stop if already terminated
      playAlertSound();

      let title = "Proctoring Alert";
      let description = "Suspicious behavior detected.";

      if (type === "looking_away") {
        title = "Look at the Screen";
        description = "You have been detected looking away for an extended period. Please stay focused on the screen.";
      } else if (type === "no_face") {
        title = "No Face Detected";
        description = "You are not visible in the camera frame. Please return to the view immediately.";
      } else if (type === "multiple_faces") {
        title = "Multiple People Detected";
        description = "Unauthorized person detected. Only the candidate is allowed during the interview.";
      }

      setViolation({ isOpen: true, title, description, type });

      // STRICT RULES LOGIC
      const newCount = warningCount + 1;
      setWarningCount(newCount);
      console.log("Violation Count:", newCount); // DEBUG

      // 4th Warning: Notify Interviewer
      if (newCount === 4) {
        try {
          console.log("Sending Proctoring Alert..."); // DEBUG
          await call?.sendCustomEvent({ type: 'proctoring_alert' });
          toast.error("Warning limit reached. Interviewer notified.");
        } catch (e) {
          console.error("Failed to send alert:", e);
        }
      }

      // 6th Warning: TERMINATE
      if (newCount >= 6) {
        console.log("Terminating Interview..."); // DEBUG
        playTerminationSound(); // PLAY SOUND
        setIsTerminated(true); // Switch to End Screen
        setViolation({ isOpen: false, title: "", description: "", type: "" }); // Close any modal


        const endStatus = "completed";
        // We set it to completed so it moves to past tab, but result=fail

        if (interview) {
          try {
            await updateInterviewStatus({
              id: interview._id,
              status: "completed",
              result: "fail"
            });
            console.log("Status updated to failed");
          } catch (e) {
            console.error("Failed to update status", e);
          }
        }

        // Send termination event to interviewer with reason
        await call?.sendCustomEvent({
          type: 'interview_terminated',
          data: {
            reason: `Candidate Exceeded Violation Limit (6). Last violation: ${type}`
          }
        });

        // Leave the call so video stops
        await call?.leave();
      }
    },
  });

  const handleViolationContinue = async () => {
    if (!violation.isOpen || !interview) return;

    try {
      await logIncident({
        interviewId: interview._id,
        type: violation.type,
        severity: "warning",
        comment: violation.description,
      });
      // toast.error("Incident logged."); // Optional toast
    } catch (error) {
      console.error("Failed to log incident:", error);
    } finally {
      setViolation(prev => ({ ...prev, isOpen: false }));
    }
  };


  if (callingState !== CallingState.JOINED && !isTerminated) {
    return (
      <div className="h-96 flex items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  if (isTerminated) {
    return <MeetingEndScreen isTerminated={true} />;
  }

  const meetingId = call?.id;
  const meetingLink = `${window.location.origin}/panel/meeting/${meetingId}`;

  const handleCopy = (text: string, type: "id" | "link") => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === "id" ? "Meeting ID" : "Link"} copied to clipboard`);
  };

  return (
    <div className="h-[calc(100vh-4rem-1px)] relative">
      {/* AI PROCTORING UI OVERLAY (Candidate Only) */}
      {isCandidate && (
        <>
          {/* FULL SCREEN ENFORCEMENT OVERLAY */}
          {!isFullScreen && !isTerminated && (
            <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-zinc-900 border-2 border-red-500 rounded-2xl p-10 shadow-2xl max-w-lg animate-in fade-in zoom-in duration-300">
                <ShieldAlertIcon className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-3xl font-bold text-white mb-4">Interview Paused</h2>
                <p className="text-lg text-zinc-400 mb-8">
                  You have exited Full Screen mode. This is a violation of the proctoring rules.
                  <br /><br />
                  Please return to Full Screen immediately to continue.
                </p>
                <Button
                  onClick={restoreFullScreen}
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg h-14"
                >
                  Return to Full Screen
                </Button>
              </div>
            </div>
          )}

          <ProctoringUI trustScore={trustScore} status={status} debugInfo={debugInfo} />
          <ViolationModal
            isOpen={violation.isOpen}
            title={violation.title}
            description={violation.description}
            onContinue={handleViolationContinue}
          />
        </>
      )}

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
          {/* VIDEO LAYOUT */}
          <div className="absolute inset-0">
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
              <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
              </div>
            )}
          </div>

          {/* VIDEO CONTROLS */}

          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                <CallControls onLeave={() => router.push("/panel")} />

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-10">
                        <LayoutListIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setLayout("grid")}>
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLayout("speaker")}>
                        Speaker View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setShowParticipants(!showParticipants)}
                  >
                    <UsersIcon className="size-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="size-10"
                    onClick={() => setIsInviteOpen(true)}
                  >
                    <ShareIcon className="size-4" />
                  </Button>

                  {/* REPORT BUTTON (Interviewer Only) */}
                  {!isCandidate && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-10 text-red-400 hover:text-red-500 hover:bg-red-500/10 border-red-500/20"
                      onClick={() => setIsReportOpen(true)}
                    >
                      <ShieldAlertIcon className="size-4" />
                    </Button>
                  )}

                  <EndCallButton />
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65} minSize={25}>
          <CodeEditor />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* INVITE DIALOG */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite People</DialogTitle>
            <DialogDescription>
              Share the meeting details with others to invite them.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting ID</label>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 w-0">
                  <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                    {meetingId}
                  </div>
                </div>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => handleCopy(meetingId || "", "id")}>
                  <CopyIcon className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Link</label>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 w-0">
                  <div className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                    {meetingLink}
                  </div>
                </div>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => handleCopy(meetingLink, "link")}>
                  <CopyIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* REPORT DIALOG (Interviewer Only) */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proctoring Report</DialogTitle>
          </DialogHeader>
          {interview && <InterviewerReport interviewId={interview._id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default MeetingRoom;
