
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email, token) {
  // Extra safety: never send verification links to other domains.
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@suiit\.ac\.in$/.test(normalizedEmail)) {
    throw new Error("Only @suiit.ac.in emails are allowed.");
  }

  const verificationUrl =
    `${process.env.API_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;

  return transporter.sendMail({
    from: `SUIIT Confessions <${process.env.GMAIL_USER}>`,
    to: normalizedEmail,
    subject: "Verify your email",
    text: `Click this link to verify your email:\n${verificationUrl}\n\nThis link expires in 5 minutes. If you did not request it, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px">
        <h2>SUIIT Confessions</h2>
        <p>Click the button below to verify you are a student of SUIIT.</p>
        <a href="${verificationUrl}"
           style="display:inline-block;padding:12px 20px;background:#6d28d9;color:#fff;text-decoration:none;border-radius:8px">
          Verify Email
        </a>
        <p>This link expires in 5 minutes.</p>
        <p>If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(confession) {
  return transporter.sendMail({
    from: `SUIIT Confessions <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New confession received",
    text: [
      `Verified email: ${confession.email}`,
      `Submitted at: ${confession.submittedAt.toISOString()}`,
      "",
      "Confession:",
      confession.message,
      "",
      `Browser: ${confession.metadata?.browserName || "Unknown"}`,
      `OS: ${confession.metadata?.osName || "Unknown"}`,
      `Device: ${confession.metadata?.deviceType || "Unknown"}`,
      `Confession ID: ${confession._id}`,
    ].join("\n"),
  });
}
