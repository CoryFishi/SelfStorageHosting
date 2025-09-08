import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB || "myapp";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connecting) return (await connecting).connection;

  mongoose.set("strictQuery", true);

  connecting = mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });

  try {
    const conn = (await connecting).connection;
    console.log(`MongoDB connected: ${conn.name}`);
    return conn;
  } finally {
    connecting = null;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

// graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
