import "dotenv/config";
import { createApp } from "./src/app";
import { connectDB } from "./src/database/db";

const PORT = Number(process.env.PORT) || 4000;

async function main() {
  await connectDB();
  createApp().listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
