import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const interviews = await ctx.db.query("interviews").collect();

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    // If an interviewer, only show interviews they are involved in
    if (user.role === "interviewer") {
      return interviews.filter((i) => i.interviewerIds.includes(identity.subject));
    }

    // Admins or Candidates (via specific query) might see others, but strictly:
    // This query seems to be "All Interviews" context. 
    // If Candidate, they use getMyInterviews usually. 
    // But if they call this, let's restrict or allow? 
    // Assuming this is the "Interviewer Dashboard" query, return all for now if not interviewer?
    // Or return filtered too? 
    // Let's assume strict privacy:
    return interviews.filter((i) => i.interviewerIds.includes(identity.subject) || i.candidateId === identity.subject);
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
      .collect();

    return interviews!;
  },
});

export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
      .first();
  },
});

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.optional(v.string()),
    interviewerIds: v.array(v.string()),
    customQuestions: v.optional(v.array(v.any())),
    customCodingChallenges: v.optional(v.array(v.any())),
    language: v.optional(v.string()), // <--- Added this
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
    result: v.optional(v.union(v.literal("pass"), v.literal("fail"))), // Optional result
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // If attempting to set a result (pass/fail), ensure user is an interviewer
    if (args.result) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (!user || user.role !== "interviewer") {
        throw new Error("Only interviewers can set the pass/fail result.");
      }
    }

    return await ctx.db.patch(args.id, {
      status: args.status,
      // Only update result if provided
      ...(args.result ? { result: args.result } : {}),
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });
  },
});

export const deleteInterview = mutation({
  args: {
    id: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "interviewer") {
      throw new Error("Only interviewers can delete interviews");
    }

    await ctx.db.delete(args.id);
  },
});

export const updateInterviewQuestion = mutation({
  args: {
    id: v.id("interviews"),
    questionId: v.string(),
    code: v.string(), // Starter code for the question
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user || user.role !== "interviewer") {
      throw new Error("Only interviewers can set the question");
    }

    await ctx.db.patch(args.id, {
      currentQuestionId: args.questionId,
      code: args.code, // Reset code to starter code
    });
  },
});

export const updateInterviewLanguage = mutation({
  args: {
    id: v.id("interviews"),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      language: args.language,
    });
  },
});

export const updateCode = mutation({
  args: {
    id: v.id("interviews"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      code: args.code,
    });
  },
});

export const checkAvailability = query({
  args: { startTime: v.number(), userIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    // 30 min buffer before/after
    const startWindow = args.startTime - 30 * 60 * 1000;
    const endWindow = args.startTime + 90 * 60 * 1000; // 1h meeting + 30m buffer

    const interviews = await ctx.db
      .query("interviews")
      .filter((q) =>
        q.and(
          q.gte(q.field("startTime"), startWindow),
          q.lte(q.field("startTime"), endWindow)
        )
      )
      .collect();

    // Check if any provided user is in these interviews
    const conflictingInterviews = interviews.filter((i) => {
      const participants = [...i.interviewerIds, i.candidateId];
      return args.userIds.some((uid) => participants.includes(uid));
    });

    return conflictingInterviews.length > 0;
  },
});

export const logIncident = mutation({
  args: {
    interviewId: v.id("interviews"),
    type: v.string(),
    severity: v.string(),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.insert("interview_incidents", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getIncidents = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db
      .query("interview_incidents")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .collect();
  },
});
