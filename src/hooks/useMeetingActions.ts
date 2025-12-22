import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const { user } = useUser();
  const createInterview = useMutation(api.interviews.createInterview);

  const createInstantMeeting = async (customData?: {
    customQuestions?: any[];
    customCodingChallenges?: any[];
    language?: string;
  }) => {
    if (!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
      });

      await createInterview({
        title: "Instant Meeting",
        startTime: Date.now(),
        status: "active",
        streamCallId: id,
        interviewerIds: user?.id ? [user.id] : [],
        customQuestions: customData?.customQuestions,
        customCodingChallenges: customData?.customCodingChallenges,
        language: customData?.language,
      });

      router.push(`/panel/meeting/${call.id}`);
      toast.success("Meeting Created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create meeting");
    }
  };

  const joinMeeting = (callId: string) => {
    if (!client) return toast.error("Failed to join meeting. Please try again.");
    router.push(`/panel/meeting/${callId}`);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
