import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: "candidate",
      roleSelected: false,
    });
  },
});

export const setUserRole = mutation({
  args: { role: v.union(v.literal("candidate"), v.literal("interviewer")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    if (user.roleSelected) {
      throw new Error("Role already selected (immutable)");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      roleSelected: true,
    });

    console.log(`Role updated for user ${user._id} (${user.name}): ${args.role}`);

    return { success: true };
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

export const getOrCreateUserByEmail = mutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // 1. Check if user exists by email
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email)) // SCAN WARNING: Use index in prod
      .first();

    if (existingUser) {
      return existingUser;
    }

    // 2. Create "Shadow" Candidate
    const userId = await ctx.db.insert("users", {
      name: args.name || "Candidate",
      email: args.email,
      clerkId: `shadow_${Date.now()}`, // Placeholder until they claim the account
      role: "candidate",
      roleSelected: true,
      image: `https://ui-avatars.com/api/?name=${args.name || "C"}&background=random`,
    });

    return await ctx.db.get(userId);
  },
});
