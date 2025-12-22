import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteUser = internalMutation({
    handler: async (ctx) => {
        const id = "jd73m5008xfhw5gps06wct6hmd7xkfhp" as any;
        const user = await ctx.db.get(id);
        if (!user) return "User already gone";
        await ctx.db.delete(id);
        return `Deleted user ${user.name} (${id})`;
    },
});
