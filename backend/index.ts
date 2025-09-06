import express, { Request, Response, NextFunction } from "express";
import apiRouter from "./src/routes";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

// Mount all API routes under /api
app.use("/api", apiRouter);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
