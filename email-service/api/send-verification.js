import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  const expectedSecret = process.env.EMAIL_API_SECRET;
  const suppliedSecret = req.headers.authorization;

  if (!expectedSecret || suppliedSecret !== `Bearer ${expectedSecret}`) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const { email, token } = req.body || {};
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  // Exact domain match: subdomains and lookalike domains are rejected.
  if (!/^[^\s@]+@suiit\.ac\.in$/.test(normalizedEmail)) {
    return res.status(400).json({
      message: "Only @suiit.ac.in email addresses are allowed.",
    });
  }

  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) {
    return res.status(400).json({ message: "Invalid verification token." });
  }

  const verificationBaseUrl = process.env.VERIFICATION_BASE_URL;

  if (!verificationBaseUrl) {
    return res.status(500).json({
      message: "Verification URL is not configured.",
    });
  }

  let verificationUrl;
  try {
    const parsedUrl = new URL(verificationBaseUrl);

    if (parsedUrl.protocol !== "https:") {
      throw new Error("HTTPS is required.");
    }

    verificationUrl = `${parsedUrl.toString()}${parsedUrl.search ? "&" : "?"}token=${encodeURIComponent(token)}`;
  } catch {
    return res.status(500).json({
      message: "Verification URL configuration is invalid.",
    });
  }

  try {
    await transporter.sendMail({
      from: `SUIIT Confessions <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Verify your SUIIT Confessions email",
      text: [
        "Verify your SUIIT student email using this link:",
        verificationUrl,
        "",
        "This link expires in 5 minutes.",
        "If you did not request this email, you can ignore it.",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px">
          <h2>SUIIT Confessions</h2>
          <p>Verify your student email to continue.</p>
          <a href="${verificationUrl}"
             style="display:inline-block;background:#6d28d9;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px">
            Verify Email
          </a>
          <p>This link expires in 5 minutes.</p>
          <p>If you did not request this email, you can safely ignore it.</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Verification email sent." });
  } catch (error) {
    // Do not log the token, recipient, SMTP credentials, or full message.
    console.error("Verification email failed:", error.message);
    return res.status(502).json({
      message: "Unable to send verification email.",
    });
  }
}
