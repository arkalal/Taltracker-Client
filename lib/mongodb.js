import mongoose from "mongoose";

// Ensure we're using the correct MongoDB URI with database name
const MONGODB_URI = process.env.MONGODB_URI;

// Debug output for troubleshooting
console.log("MONGODB_URI:", MONGODB_URI ? "defined" : "undefined");
if (MONGODB_URI) {
  // Don't log the full URI with credentials in production
  if (process.env.NODE_ENV !== "production") {
    // Log a sanitized version for debugging
    const sanitizedUri = MONGODB_URI.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      "mongodb+srv://[username]:[password]@"
    );
    console.log("MONGODB_URI format:", sanitizedUri);
  }
}

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable. " +
      "Make sure it's correctly set in your .env.local file and includes the database name."
  );
}

// Use cached connection for better performance
const cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Give server 10 seconds to respond
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    try {
      // Ensure URI includes the database name
      let uri = MONGODB_URI;
      if (!uri.endsWith("/taltracker") && !uri.endsWith("/taltracker?")) {
        // Append database name if missing
        uri = uri.endsWith("/") ? `${uri}taltracker` : `${uri}/taltracker`;
      }

      cached.promise = mongoose.connect(uri, opts);
      console.log("MongoDB connection initiated");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw new Error(`Error connecting to MongoDB: ${error.message}`);
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error);
    throw error;
  }

  return cached.conn;
}
