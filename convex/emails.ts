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
    },
    handler: async (ctx, args) => {
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_PASS;

        if (!user || !pass) {
            console.log("---------------------------------------------------");
            console.log("📧 [MOCK EMAIL] WOULD SEND TO:", args.email);
            console.log("Subject: You're invited to an interview!");
            console.log(`Hi ${args.name},`);
            console.log(`You have an interview scheduled on ${args.date} at ${args.time}.`);
            console.log(`Your Login Credentials:`);
            console.log(`Username: ${args.email.split("@")[0]}`);
            console.log(`Password: ${args.password}`);
            console.log("---------------------------------------------------");
            return { success: true, mock: true };
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user, // assessiqinterview@gmail.com
                    pass, // App Password
                },
            });

            const mailOptions = {
                from: `"AssessIQ Interview" <${user}>`,
                to: args.email,
                subject: "Interview Invitation & Credentials",
                html: `
          <h1>Interview Invitation</h1>
          <p>Hi ${args.name},</p>
          <p>You have been invited to a technical interview on AssessIQ.</p>
          <p><strong>Date:</strong> ${args.date}</p>
          <p><strong>Time:</strong> ${args.time}</p>
          <hr />
          <h3>Your Login Credentials</h3>
          <p>Please use these to log in (or create your account):</p>
          <p><strong>Email:</strong> ${args.email}</p>
          <p><strong>Temporary Password:</strong> ${args.password}</p>
          <br />
          <a href="https://assessiq-demo.vercel.app/sign-in" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Log In Now
          </a>
        `,
            };

            const info = await transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };

        } catch (error) {
            console.error("Failed to send email:", error);
            throw new Error("Failed to send email invite via Gmail");
        }
    },
});
