import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";

const ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();

  app.use(cors({ origin: ORIGINS, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api", apiRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = Number(err?.status) || 500;
    // Client errors carry messages meant for the caller; 5xx messages can leak
    // collection names, index names and field paths, so they are not forwarded.
    console.error(err);
    res.status(status).json({
      error: status < 500 ? err?.message || "Request error" : "Server error",
    });
  });

  return app;
}
