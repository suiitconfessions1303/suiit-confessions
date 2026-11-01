
import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    metadata: {
      userAgent: { type: String, default: "" },
      browserName: { type: String, default: "" },
      browserVersion: { type: String, default: "" },
      osName: { type: String, default: "" },
      osVersion: { type: String, default: "" },
      deviceType: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Confession", confessionSchema);
