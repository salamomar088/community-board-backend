import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { likePost } from "../controllers/likeController.js";

const router = express.Router();

// Protected (toggle like)
router.post("/", authMiddleware, likePost);

export default router;
