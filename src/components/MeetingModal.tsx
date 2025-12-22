import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useMeetingActions from "@/hooks/useMeetingActions";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { INTERVIEW_ROLES } from "@/constants";
import toast from "react-hot-toast";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [role, setRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { createInstantMeeting, joinMeeting } = useMeetingActions();
  const getOrGenerateInterview = useAction(api.ai.getOrGenerateInterview);

  const handleStart = async () => {
    if (isJoinMeeting) {
      const meetingId = meetingUrl.split("/panel/meeting/").pop();
      if (meetingId) joinMeeting(meetingId);
      onClose();
    } else {
      if (!role.trim()) {
        toast.error("Please specify a role (e.g. 'React Developer')");
        return;
      }

      setIsGenerating(true);
      try {
        const interviewData = await getOrGenerateInterview({ role });

        await createInstantMeeting({
          customQuestions: interviewData.questions,
          customCodingChallenges: interviewData.codingChallenges,
          language: interviewData.defaultLanguage,
        });

        setRole("");
        onClose();
      } catch (error) {
        console.error("Failed to generate:", error);
        toast.error("Failed to generate interview. Try again.");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {isJoinMeeting && (
            <Input
              placeholder="Paste meeting link here..."
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          )}

          {!isJoinMeeting && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Interview Role / Topic</label>
              <Select value={role} onValueChange={setRole} disabled={isGenerating}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Our AI will generate tailored questions for this role.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={isJoinMeeting && !meetingUrl.trim() || !isJoinMeeting && isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : isJoinMeeting ? (
                "Join Meeting"
              ) : (
                "Start Meeting"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default MeetingModal;
