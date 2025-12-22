"use client";

import LogoLoader from "@/components/ui/LogoLoader";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const router = useRouter();

  const { isInterviewer, isLoading } = useUserRole();

  if (isLoading) return <LogoLoader />;
  if (!isInterviewer) return router.push("/panel");

  return <InterviewScheduleUI />;
}
export default SchedulePage;
