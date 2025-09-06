import { Router } from "express";
import userRouter from "./user.routes";

const router = Router();

// quick health check
router.get("/health", (_req, res) => res.json({ ok: true }));

// users endpoints
router.use("/users", userRouter);

export default router;
