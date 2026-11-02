
import { Router } from "express";
import { createHash } from "node:crypto";
import rateLimit from "express-rate-limit";
import { UAParser } from "ua-parser-js";

import SubmissionSession from "../../models/SubmissionSession.js";
import Confession from "../../models/Confession.js";

const router = Router();

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

function clearSubmissionCookie(res) {
  res.clearCookie("submission_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

function getDeviceMetadata(req) {
  const userAgent = req.get("user-agent") || "";
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    userAgent: userAgent.slice(0, 1000),
    browserName: result.browser.name || "Unknown",
    browserVersion: result.browser.version || "Unknown",
    osName: result.os.name || "Unknown",
    osVersion: result.os.version || "Unknown",
    deviceType:
      result.device.type ||
      (result.os.name ? "Desktop/unspecified" : "Unknown"),
  };
}

// Confirm that the temporary submission session is still usable without consuming it.
router.get("/session", async (req, res) => {
  const rawToken = req.cookies?.submission_session;

  if (!rawToken || !/^[a-f0-9]{64}$/.test(rawToken)) {
    return res.status(200).json({ active: false });
  }

  const session = await SubmissionSession.findOne({
    tokenHash: hashToken(rawToken),
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    clearSubmissionCookie(res);
    return res.status(200).json({ active: false });
  }

  return res.status(200).json({ active: true });
});

// Submit exactly one confession using a valid 2-minute session.
router.post("/", submissionLimiter, async (req, res) => {
  const rawToken = req.cookies?.submission_session;

  if (!rawToken || !/^[a-f0-9]{64}$/.test(rawToken)) {
    clearSubmissionCookie(res);
    return res.status(401).json({
      message: "Your session is missing. Please verify your email again.",
    });
  }

  const message =
    typeof req.body.message === "string" ? req.body.message.trim() : "";

  if (!message || message.length > 5000) {
    return res.status(400).json({
      message: "Your confession must contain 1–5000 characters.",
    });
  }

  try {
    const tokenHash = hashToken(rawToken);
    const now = new Date();

    // Atomically consume the session before saving.
    // Concurrent requests cannot both use the same session.
    const session = await SubmissionSession.findOneAndUpdate(
      {
        tokenHash,
        consumedAt: null,
        expiresAt: { $gt: now },
      },
      { $set: { consumedAt: now } },
      { returnDocument: "after" }
    );

    if (!session) {
      clearSubmissionCookie(res);

      return res.status(401).json({
        message:
          "Your session has expired or has already been used. Please verify your email again.",
      });
    }

    let confession;

    try {
      confession = await Confession.create({
        email: session.email,
        message,
        submittedAt: now,
        metadata: getDeviceMetadata(req),
      });
    } catch (saveError) {
      // Do not make a consumed session reusable after an uncertain save.
      clearSubmissionCookie(res);
      throw saveError;
    }

    clearSubmissionCookie(res);

    // Notification failure must not undo a successful submission.
    try {
      await sendAdminNotification(confession);
    } catch (emailError) {
      console.error(
        "Confession saved, but admin notification failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      message: "Your confession has been submitted successfully.",
    });
  } catch (error) {
    console.error("Confession submission failed:", error.message);

    return res.status(500).json({
      message:
        "We could not complete the submission. Please verify your email again before retrying.",
    });
  }
});

// Explicitly invalidate the temporary session when the user exits.
router.post("/finish", async (req, res) => {
  try {
    const rawToken = req.cookies?.submission_session;

    if (rawToken && /^[a-f0-9]{64}$/.test(rawToken)) {
      await SubmissionSession.updateOne(
        {
          tokenHash: hashToken(rawToken),
          consumedAt: null,
        },
        { $set: { consumedAt: new Date() } }
      );
    }

    clearSubmissionCookie(res);

    return res.status(200).json({
      message: "Session closed.",
    });
  } catch (error) {
    console.error("Session cleanup failed:", error.message);
    clearSubmissionCookie(res);

    return res.status(500).json({
      message: "Unable to close the session cleanly.",
    });
  }
});

export default router;
