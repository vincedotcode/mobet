import mongoose, { Mongoose } from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Make sure this is called before using `process.env`

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  console.log("MONGODB_URL", MONGODB_URL);
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "mopet",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};