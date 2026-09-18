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
    // Same envelope shape every route already answers with ({ code, message }
    // -- see user.routes.ts), so the client's single `data?.message` read
    // gets a real message on both paths instead of the generic fallback on
    // whichever one this handler used to answer differently.
    res.status(status).json(
      status < 500
        ? { code: err?.code || "REQUEST_ERROR", message: err?.message || "Request error" }
        : { code: "SERVER_ERROR", message: "Server error" }
    );
  });

  return app;
}
