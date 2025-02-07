import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

export const connectDB = async () => {
  if (mongoose.connections[0].readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI).then(() => {});
  } catch (error) {
    throw new Error("Failed to connect to database");
  }
};
