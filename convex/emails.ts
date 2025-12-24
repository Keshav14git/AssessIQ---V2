"use node";
// import nodemailer from "nodemailer";
import { v } from "convex/values";
import { action } from "./_generated/server";

export const sendCandidateInvite = action({
    args: {
        email: v.string(),
        name: v.string(),
        date: v.string(),
        time: v.string(),
        password: v.string(), // Auto-generated password
        title: v.string(),
        interviewLink: v.string(),
        timeZone: v.string(),
    },
    handler: async (ctx, args) => {
        console.log("✅ ACTION STARTED (MOCK MODE): sendCandidateInvite");
        console.log("Args:", args);

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_PASS;

        if (!user || !pass) {
            console.log("⚠️ Missing Env Vars (GMAIL_USER or GMAIL_PASS) - but running in Mock Mode anyway");
        }

        // MOCK SUCCESS
        console.log("📧 [MOCK EMAIL] WOULD SEND TO:", args.email);
        console.log("Subject: Interview Invitation & Credentials");
        console.log("Link:", args.interviewLink);

        return { success: true, messageId: "mock-message-id-123", mock: true };
    },
});
