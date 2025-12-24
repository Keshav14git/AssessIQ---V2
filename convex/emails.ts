"use node";
import nodemailer from "nodemailer";
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
        console.log("✅ ACTION STARTED: sendCandidateInvite");
        console.log("Args:", args);

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_PASS;

        if (!user || !pass) {
            console.log("⚠️ Missing Env Vars (GMAIL_USER or GMAIL_PASS)");
            return { success: false, error: "Missing Env Vars" };
        }

        try {
            console.log("📧 Attempting to import/use nodemailer...");
            // TEST: Only Create Transport, don't send yet
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user, pass },
            });
            console.log("✅ Transporter created.");

            // Verify connection configuration
            await new Promise((resolve, reject) => {
                transporter.verify(function (error, success) {
                    if (error) {
                        console.error("❌ Transporter connection failed:", error);
                        reject(error);
                    } else {
                        console.log("✅ Server is ready to take our messages");
                        resolve(success);
                    }
                });
            });

            // ... (rest of logic commented out for a split second test, or we proceed)

            // Safely get base URL
            let baseUrl = "https://snipp.com";
            try {
                baseUrl = new URL(args.interviewLink).origin;
            } catch (e) {
                console.warn("Invalid interviewLink, defaulting base URL", e);
            }

            const mailOptions = {
                from: `"Snipp Interview" <${user}>`,
                to: args.email,
                subject: "Interview Invitation & Credentials",
                html: `<h1>Test Email</h1><p>If you see this, nodemailer works.</p>`
                // Simplified HTML for testing
            };

            console.log("🚀 Sending mail now...");
            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Email sent:", info.messageId);
            return { success: true, messageId: info.messageId };

        } catch (error: any) {
            console.error("❌ CRASHED:", error);
            throw new Error(`Failed to send email: ${error.message || error}`);
        }
    },
});
