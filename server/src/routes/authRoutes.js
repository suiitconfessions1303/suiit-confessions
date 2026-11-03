import { Router } from "express";
import { createHash, randomBytes } from "node:crypto";
import rateLimit from "express-rate-limit";

import EmailVerification from "../../models/EmailVerification.js";
import SubmissionSession from "../../models/SubmissionSession.js";
import { sendVerificationEmail } from "../services/emailService.js";

const router = Router();

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

router.post("/request-verification", requestLimiter, async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    // Only allow institutional email addresses.
    const allowedEmail = /^[^\s@]+@suiit\.ac\.in$/;

    if (email.length > 254 || !allowedEmail.test(email)) {
      return res.status(400).json({
        message: "Only valid @suiit.ac.in email addresses are allowed.",
      });
    }

    // Invalidate previous unused verification links for this email.
    await EmailVerification.deleteMany({
      email,
      usedAt: null,
    });

    const rawToken = randomBytes(32).toString("hex");

    await EmailVerification.create({
      email,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    try {
      await sendVerificationEmail(email, rawToken);
    } catch (error) {
      await EmailVerification.deleteOne({
        tokenHash: hashToken(rawToken),
      });

      throw error;
    }

    return res.status(200).json({
      message:
        "If the address can receive verification mail, a link will be sent.",
    });
  } catch (error) {
    console.error("Verification request failed:", error.message);

    return res.status(500).json({
      message: "Unable to send verification email right now.",
    });
  }
});

router.get("/verify", async (req, res) => {
  const frontendUrl = process.env.APP_URL.replace(/\/+$/, "");

  // Send the user back to the start page with a reason. The frontend
  // clears its "pending" state and shows the email form again.
  const backToStart = (reason) =>
    res.redirect(`${frontendUrl}/?verification=${reason}`);

  try {
    const token =
      typeof req.query.token === "string" ? req.query.token : "";

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return backToStart("invalid");
    }

    // Atomically consume the verification token.
    const verification = await EmailVerification.findOneAndUpdate(
      {
        tokenHash: hashToken(token),
        usedAt: null,
        expiresAt: { $gt: new Date() },
      },
      {
        $set: { usedAt: new Date() },
      },
      {
        returnDocument: "after",
      }
    );

    if (!verification) {
      // Not found: expired (the TTL index may already have removed it),
      // already used, or never existed.
      return backToStart("expired");
    }

    const rawSessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 120 * 1000);

    await SubmissionSession.create({
      email: verification.email,
      tokenHash: hashToken(rawSessionToken),
      expiresAt,
    });

    res.cookie("submission_session", rawSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 120 * 1000,
      path: "/",
    });

    return res.redirect(
      `${frontendUrl}/confess#session=${encodeURIComponent(rawSessionToken)}`
    );
  } catch (error) {
    console.error("Email verification failed:", error.message);

    return backToStart("error");
  }
});

export default router;