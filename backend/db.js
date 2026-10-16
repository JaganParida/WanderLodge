const mongoose = require("mongoose");

// Serverless Mongoose connection caching for Vercel
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const dbUrl = process.env.ATLASDB_URL;
  if (!dbUrl) {
    throw new Error("ATLASDB_URL environment variable is not defined in environment.");
  }

  // Re-use active connection if ready
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10, // Lean connection pool tailored for Vercel serverless & Atlas free tier
    };

    cached.promise = mongoose.connect(dbUrl, opts).then((mongooseInstance) => {
      console.log("✅ Successfully connected to MongoDB Database!");
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error("❌ MongoDB connection error:", err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

module.exports = connectDB;
