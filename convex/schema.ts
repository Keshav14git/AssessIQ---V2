import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    roleSelected: v.optional(v.boolean()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    result: v.optional(v.union(v.literal("pass"), v.literal("fail"))), // Pass/Fail decision
    streamCallId: v.string(),
    candidateId: v.optional(v.string()),
    interviewerIds: v.array(v.string()),
    // Coding State
    currentQuestionId: v.optional(v.string()),
    code: v.optional(v.string()),
    language: v.optional(v.string()),
    customQuestions: v.optional(v.array(v.any())), // Store generated questions
    customCodingChallenges: v.optional(v.array(v.any())), // Store generated code challenges
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    authorId: v.string(), // Renamed from interviewerId to support both roles
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  interview_templates: defineTable({
    role: v.string(),
    techStack: v.array(v.string()),
    questions: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        input: v.optional(v.string()),
        output: v.optional(v.string()),
        explanation: v.optional(v.string()),
      })
    ),
    codingChallenges: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        starterCode: v.object({
          javascript: v.string(),
          python: v.string(),
          java: v.string(),
        }),
        constraints: v.array(v.string()),
        examples: v.array(
          v.object({
            input: v.string(),
            output: v.string(),
            explanation: v.optional(v.string()),
          })
        ),
      })
    ),
  }).index("by_role", ["role"]),

  interview_incidents: defineTable({
    interviewId: v.id("interviews"),
    type: v.string(), // "looking_away", "no_face", "multiple_faces"
    timestamp: v.number(),
    severity: v.string(), // "warning", "critical"
    comment: v.optional(v.string()),
  }).index("by_interview_id", ["interviewId"]),
});
