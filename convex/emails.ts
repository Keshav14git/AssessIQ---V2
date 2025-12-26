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
      console.log("⚠️ Missing Env Vars (GMAIL_USER or GMAIL_PASS) - Returning Error");
      throw new Error("Missing GMAIL_USER or GMAIL_PASS environment variables in Convex Dashboard.");
    }

    try {
      console.log("📧 Creating Nodemailer Transporter...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user, // assessiqinterview@gmail.com
          pass, // App Password
        },
      });

      // Safely get base URL
      let baseUrl = "https://assessiq.com";
      try {
        baseUrl = new URL(args.interviewLink).origin;
      } catch (e) {
        console.warn("Invalid interviewLink, defaulting base URL", e);
      }

      const mailOptions = {
        from: `"AssessIQ Interview" <${user}>`,
        to: args.email,
        subject: "Interview Invitation & Credentials",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Scheduled</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  
  <!-- OUTER CONTAINER -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; color: #ffffff;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
      
        <!-- MAIN CARD -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; background-color: rgba(20, 20, 20, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);">
          
          <!-- HEADER SECTION -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <!-- LOGO -->
              <img src="${baseUrl}/1.png" alt="AssessIQ" width="120" style="display: block; width: 120px; height: auto; margin-bottom: 24px;">
              
              <!-- HEADING -->
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Interview Scheduled</h1>
              <div style="width: 60px; height: 4px; background-color: #00bf63; margin-top: 16px; border-radius: 2px;"></div>
            </td>
          </tr>

          <!-- BODY SECTION -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e5e5e5;">
                Hello <span style="color: #ffffff; font-weight: 600;">${args.name}</span>,
              </p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                We are pleased to inform you that your technical interview has been <span style="color: #00bf63; font-weight: 600;">successfully scheduled</span>. Please find the details below and prepare accordingly.
              </p>

              <!-- DETAILS CARD -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 24px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 16px; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Role</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 24px; color: #ffffff; font-size: 18px; font-weight: 500; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">${args.title}</td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 0 0;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="padding-bottom: 8px; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Date & Time</td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 24px; color: #ffffff; font-size: 16px;">${args.date} · ${args.time} (${args.timeZone})</td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 8px; color: #888888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Mode</td>
                            </tr>
                            <tr>
                              <td style="color: #ffffff; font-size: 16px;">Remote (Video & Code)</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CREDENTIALS SECTION (Essential functionality) -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <tr>
                   <td style="padding-bottom: 10px; color: #00bf63; font-size: 14px; font-weight: 600;">LOG IN CREDENTIALS</td>
                </tr>
                <tr>
                   <td style="color: #cccccc; font-size: 14px; line-height: 1.6;">
                      Email: <strong style="color: #fff;">${args.email}</strong><br>
                      Password: <strong style="color: #fff;">${args.password}</strong>
                   </td>
                </tr>
              </table>

              <!-- CTA BUTTON -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${args.interviewLink}" style="display: inline-block; background: linear-gradient(135deg, #00bf63 0%, #00a055 100%); background-color: #00bf63; color: #000000; font-size: 16px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 50px; text-align: center; box-shadow: 0 4px 15px rgba(0, 191, 99, 0.3);">
                      Join Interview
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                 Use the credentials above to log in if you haven't already.
              </p>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} AssessIQ · Secure & Fair Interviews<br>
                For support, contact <a href="mailto:support@assessiq.com" style="color: #666666; text-decoration: underline;">support@assessiq.com</a>
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
            `,
      };

      console.log("🚀 Sending real email now...");
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.messageId);
      return { success: true, messageId: info.messageId };

    } catch (error: any) {
      console.error("❌ CRASHED:", error);
      throw new Error(`Failed to send email: ${error.message || error}`);
    }
  },
});
