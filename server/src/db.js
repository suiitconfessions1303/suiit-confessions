import mongoose from "mongoose";

import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
