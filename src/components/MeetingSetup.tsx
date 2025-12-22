import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { CameraIcon, MicIcon, SettingsIcon, InfoIcon, ShieldAlertIcon, CheckCircle2Icon } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import toast from "react-hot-toast";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const call = useCall();
  const { isCandidate } = useUserRole();

  if (!call) return null;

  useEffect(() => {
    // Initial setup: ensure devices are in correct state based on default state
    if (isCameraDisabled) call?.camera.disable();
    if (isMicDisabled) call?.microphone.disable();

    // Cleanup on unmount
    return () => {
      // Optional: leave devices as is or disable? 
      // Best to leave them for the next screen (MeetingRoom).
    };
  }, [call]); // Only run once on mount

  const handleCameraToggle = async (checked: boolean) => {
    setIsCameraDisabled(!checked);
    if (!checked) {
      await call?.camera.disable();
    } else {
      try {
        await call?.camera.enable();
      } catch (err) {
        console.error("Error enabling camera:", err);
        toast.error("Camera failed! If using Brave, turn off Shields (Lion Icon). Also close Zoom/Teams.", {
          duration: 6000,
        });
        // Revert switch state if failed
        setIsCameraDisabled(true);
      }
    }
  };

  const handleMicToggle = async (checked: boolean) => {
    setIsMicDisabled(!checked);
    if (!checked) {
      await call?.microphone.disable();
    } else {
      try {
        await call?.microphone.enable();
      } catch (err) {
        console.error("Error enabling mic:", err);
        toast.error("Microphone failed to start.", { duration: 3000 });
        setIsMicDisabled(true);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] flex items-center justify-center p-6 bg-background overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-center">
          {/* VIDEO PREVIEW CONTAINER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col h-full md:h-[90%]">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div>
                <h1 className="text-xl font-bold">Camera Preview</h1>
                <p className="text-sm text-zinc-400">Make sure you look good!</p>
              </div>
              {/* Status Indicator */}
              <div className={`px-3 py-1 text-xs font-bold rounded-full border ${!isCameraDisabled ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {!isCameraDisabled ? "Camera On" : "Camera Off"}
              </div>
            </div>

            {/* ACTUAL PREVIEW */}
            {/* Added pb-12 to "lift" the centered content up by adding space at bottom */}
            <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-black/50 border border-zinc-800 relative shadow-inner flex items-center justify-center p-4 pb-12">
              {/* Removed border-white/5 and added overrides for VideoPreview */}
              <div className="w-full aspect-video relative rounded-lg overflow-hidden shadow-2xl bg-zinc-950">
                <VideoPreview
                  className="h-full w-full object-contain [&_video]:!border-0 [&_video]:!outline-none [&_video]:!shadow-none !border-0 !outline-none !shadow-none ring-0 focus:ring-0"
                  DisabledVideoPreview={() => (
                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-500">
                      Video is disabled
                    </div>
                  )}
                />

                {/* Overlay for disabled camera */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10">
                  <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 text-xs text-zinc-300 border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${!isMicDisabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    Microphone is {!isMicDisabled ? "On" : "Off"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS CONTAINER */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl flex flex-col justify-between h-full md:h-[90%] overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="mb-6 shrink-0">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Meeting Details
                </h2>
                <p className="text-sm text-zinc-400 font-mono mt-1 break-all bg-black/40 p-2 rounded border border-white/5 inline-block">
                  ID: {call.id}
                </p>
              </div>

              {/* Removed overflow-y-auto and custom-scrollbar to remove scrolling */}
              {/* Added justify-center to center controls vertically if there is extra space */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {/* CAM CONTROL */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${!isCameraDisabled ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      <CameraIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Camera</p>
                      <p className="text-xs text-zinc-400">
                        {isCameraDisabled ? "Video feed is hidden" : "Video feed is visible"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isCameraDisabled}
                    onCheckedChange={handleCameraToggle}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {/* MIC CONTROL */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${!isMicDisabled ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                      <MicIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Microphone</p>
                      <p className="text-xs text-zinc-400">
                        {isMicDisabled ? "Audio is muted" : "Audio is enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isMicDisabled}
                    onCheckedChange={handleMicToggle}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                {/* DEVICE SETTINGS */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <SettingsIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Settings</p>
                      <p className="text-xs text-zinc-400">Configure input devices</p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>

              {/* JOIN BTN */}
              <div className="mt-8 pt-6 border-t border-zinc-800 shrink-0">
                <Button
                  className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 text-black shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all"
                  size="lg"
                  onClick={handleJoin}
                >
                  Join Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANDIDATE INSTRUCTIONS DIALOG */}
      <Dialog open={isInstructionsOpen} onOpenChange={setIsInstructionsOpen}>
        <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <ShieldAlertIcon className="text-red-500 h-8 w-8" />
              Pre-Interview Instructions
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-400">
              Please review the following requirements carefully. Failure to comply may result in immediate termination of the interview.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-black/40 p-5 rounded-xl border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs">1</span>
                Environment & Setup
              </h3>
              <ul className="list-disc pl-8 space-y-2 text-zinc-300">
                <li>Ensure you are in a <strong>quiet, well-lit room</strong>.</li>
                <li>Your face must be clearly visible at all times.</li>
                <li>Close all unrelated browser tabs and applications.</li>
                <li><strong>No other people</strong> are allowed in the room.</li>
              </ul>
            </div>

            <div className="bg-red-500/5 p-5 rounded-xl border border-red-500/20">
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs">2</span>
                AI Proctoring Policy
              </h3>
              <p className="text-zinc-300 text-sm mb-3">
                This interview is monitored by an automated AI Sentinel. It tracks:
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm text-zinc-400">
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Gaze Detection (Looking Away)
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Face Visibility (Not detected)
                </div>
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  Multiple Faces
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-start gap-3">
                <ShieldAlertIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-200">
                  <strong>Strict Warning:</strong> After <strong>4 violations</strong>, the interviewer will be notified. After <strong>6 violations</strong>, the interview will automatically terminate.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex-col sm:justify-between gap-4 border-t border-zinc-800 pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={isAcknowledged}
                onCheckedChange={(checked) => setIsAcknowledged(checked as boolean)}
                className="mt-1 border-white/20 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300 cursor-pointer"
              >
                I understand strictly that my video and audio are being monitored, and violating the proctoring rules will lead to the termination of my candidacy.
              </label>
            </div>

            <Button
              onClick={confirmJoin}
              disabled={!isAcknowledged}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black font-bold h-12"
            >
              Start Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default MeetingSetup;
