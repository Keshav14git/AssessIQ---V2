import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getTemplateByRole = internalQuery({
    args: { role: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("interview_templates")
            .withIndex("by_role", (q) => q.eq("role", args.role))
            .first();
    },
});

export const saveTemplate = internalMutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("interview_templates", args);
    },
});
