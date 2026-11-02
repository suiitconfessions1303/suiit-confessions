import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import Confession from "../../models/Confession.js";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_session;

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({ message: "Please log in." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    next();
  } catch {
    return res.status(401).json({
      message: "Your session expired. Please log in again.",
    });
  }
}

// Admin login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (
      !process.env.ADMIN_USERNAME ||
      !process.env.ADMIN_PASSWORD_HASH ||
      !process.env.JWT_SECRET
    ) {
      return res.status(500).json({
        message: "Admin authentication is not configured.",
      });
    }

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.length > 100 ||
      password.length > 200
    ) {
      return res.status(400).json({
        message: "Invalid username or password.",
      });
    }

    const usernameMatches = username === process.env.ADMIN_USERNAME;

    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password.",
      });
    }

    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("admin_session", token, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({ message: "Login successful." });
  } catch (error) {
    console.error("Admin login failed:", error.message);
    return res.status(500).json({ message: "Login failed." });
  }
});

// Admin logout
router.post("/logout", (req, res) => {
  res.clearCookie("admin_session", cookieOptions);
  return res.json({ message: "Logged out." });
});

// View all confessions (protected)
router.get("/confessions", requireAdmin, async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ submittedAt: -1 })
      .lean();

    return res.json({ confessions });
  } catch (error) {
    console.error("Unable to load confessions:", error.message);
    return res.status(500).json({
      message: "Unable to load confessions.",
    });
  }
});

// Delete one confession (protected)
router.delete("/confessions/:id", requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid confession ID.",
      });
    }

    const deleted = await Confession.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Confession not found.",
      });
    }

    return res.json({ message: "Confession deleted." });
  } catch (error) {
    console.error("Delete failed:", error.message);
    return res.status(500).json({
      message: "Unable to delete confession.",
    });
  }
});

export default router;
