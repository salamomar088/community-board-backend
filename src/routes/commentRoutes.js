import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCommentsByPost,
  createComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Public
router.get("/:postId", getCommentsByPost);

// Protected
router.post("/", authMiddleware, createComment);

export default router;
