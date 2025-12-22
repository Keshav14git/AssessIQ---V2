import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery, useConvex, useAction } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/UserInfo";
import { Loader2Icon, XIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TIME_SLOTS } from "@/constants";
import MeetingCard from "@/components/MeetingCard";


function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
  });

  const convex = useConvex();
  const searchCandidate = useMutation(api.users.getOrCreateUserByEmail);
  const sendInvite = useAction(api.emails.sendCandidateInvite);

  const [openAddCandidate, setOpenAddCandidate] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ email: "", name: "" });

  const handleAddCandidate = async () => {
    if (!newCandidate.email) return toast.error("Email is required");
    try {
      const user = await searchCandidate({
        email: newCandidate.email,
        name: newCandidate.name
      });
      if (!user) throw new Error("Could not create user");
      setFormData({ ...formData, candidateId: user.clerkId });
      setOpenAddCandidate(false);
      setNewCandidate({ email: "", name: "" });
      toast.success(`Selected ${user.name}`);
    } catch (e) {
      toast.error("Failed to add candidate");
    }
  };

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }

    setIsCreating(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } = formData;
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);
      const startTime = meetingDate.getTime();

      // 1. Conflict Detection
      const isBusy = await convex.query(api.interviews.checkAvailability, {
        startTime,
        userIds: [...interviewerIds, candidateId]
      });

      if (isBusy) {
        const confirm = window.confirm("⚠️ Conflict Warning: One or more participants have a meeting at this time.\n\nDo you want to proceed anyway?");
        if (!confirm) {
          setIsCreating(false);
          return;
        }
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await createInterview({
        title,
        description,
        startTime,
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
      });

      // 2. Send Invitation Email
      const candidateUser = users?.find((u) => u.clerkId === candidateId);
      if (candidateUser && candidateUser.email) {
        const tempPassword = Math.random().toString(36).slice(-8);
        await sendInvite({
          email: candidateUser.email,
          name: candidateUser.name || "Candidate",
          date: meetingDate.toLocaleDateString(),
          time: time,
          password: tempPassword
        });
        toast.success("Invitation email sent!");
      }

      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId)
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId)
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        {/* HEADER INFO */}
        <div>
          <h1 className="text-3xl font-bold">Interviews</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage interviews</p>
        </div>

        {/* DIALOG */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-zinc-900 border-zinc-800">
            {/* NO DEFAULT HEADER - CUSTOM HEADER */}
            <div className="grid grid-cols-1 md:grid-cols-5 h-[80vh] md:h-[600px] overflow-hidden">

              {/* LEFT COLUMN: MEETING DETAILS (3/5 width) */}
              <div className="md:col-span-3 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar border-r border-zinc-800 bg-zinc-950/50">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">Meeting Details</h2>
                  <p className="text-sm text-zinc-400">Configure the interview specifics</p>
                </div>

                {/* TITLE */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Title</label>
                  <Input
                    placeholder="e.g. Senior React Developer Interview"
                    className="bg-zinc-900 border-zinc-700 focus:ring-green-500/20"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Description</label>
                  <Textarea
                    placeholder="Meeting agenda and instructions..."
                    className="bg-zinc-900 border-zinc-700 focus:ring-green-500/20 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* CANDIDATE */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex justify-between items-center">
                    Candidate
                    <button className="text-green-400 hover:text-green-300 transition-colors text-xs normal-case" onClick={() => setOpenAddCandidate(!openAddCandidate)}>
                      {openAddCandidate ? "Cancel" : "+ Add External"}
                    </button>
                  </label>

                  {openAddCandidate ? (
                    <div className="space-y-3 p-4 border border-zinc-800 rounded-lg bg-zinc-900/50 animate-in fade-in slide-in-from-top-2">
                      <Input
                        placeholder="Candidate Email"
                        className="bg-zinc-950 border-zinc-800"
                        value={newCandidate.email}
                        onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                      />
                      <Input
                        placeholder="Candidate Name"
                        className="bg-zinc-950 border-zinc-800"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      />
                      <Button size="sm" onClick={handleAddCandidate} className="w-full">Confirm Add</Button>
                    </div>
                  ) : (
                    <Select
                      value={formData.candidateId}
                      onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                    >
                      <SelectTrigger className="bg-zinc-900 border-zinc-700">
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        {candidates.map((candidate) => (
                          <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                            <UserInfo user={candidate} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* INTERVIEWERS */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Interviewers</label>
                  <div className="min-h-[42px] p-2 border border-zinc-700 rounded-md bg-zinc-900 flex flex-wrap gap-2">
                    {selectedInterviewers.map((interviewer) => (
                      <div
                        key={interviewer.clerkId}
                        className="inline-flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded-md text-sm border border-zinc-700"
                      >
                        <UserInfo user={interviewer} />
                        {interviewer.clerkId !== user?.id && (
                          <button
                            onClick={() => removeInterviewer(interviewer.clerkId)}
                            className="text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}

                    {availableInterviewers.length > 0 && (
                      <Select onValueChange={addInterviewer}>
                        <SelectTrigger className="w-[30px] h-[24px] p-0 border-none bg-transparent hover:bg-zinc-800 transition-colors rounded">
                          <span className="text-zinc-400 text-lg leading-none flex justify-center w-full">+</span>
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          {availableInterviewers.map((interviewer) => (
                            <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                              <UserInfo user={interviewer} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: SCHEDULING (2/5 width) */}
              <div className="md:col-span-2 bg-white/5 p-6 md:p-8 flex flex-col h-full border-l border-white/5 overflow-y-auto custom-scrollbar">

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">Date & Time</h2>
                  <p className="text-sm text-zinc-400">Select slot</p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* CALENDAR */}
                  <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      className="rounded-md"
                      classNames={{
                        day_selected: "bg-green-500 text-white hover:bg-green-600 focus:bg-green-600",
                        day_today: "bg-zinc-800 text-zinc-100",
                      }}
                    />
                  </div>

                  {/* TIME SELECTION */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <ClockIcon className="w-3 h-3" /> Start Time
                    </label>
                    <div className="relative">
                      <Input
                        type="time"
                        className="bg-zinc-900 border-zinc-700 focus:ring-green-500/20 p-3 h-12 text-lg font-medium"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTIONS */}
                <div className="pt-6 mt-6 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Selected:</span>
                    <span className="text-white font-medium">{formData.date.toLocaleDateString()} at {formData.time}</span>
                  </div>
                  <Button
                    onClick={scheduleMeeting}
                    disabled={isCreating}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-6"
                  >
                    {isCreating ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Confirm & Schedule"
                    )}
                  </Button>
                </div>

              </div>

            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LOADING STATE & MEETING CARDS */}
      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : interviews.length > 0 ? (
        <div className="spacey-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview) => (
              <MeetingCard key={interview._id} interview={interview} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No interviews scheduled</div>
      )}
    </div>
  );
}
export default InterviewScheduleUI;
