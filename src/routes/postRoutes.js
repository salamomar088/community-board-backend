import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getPosts,
  getPostById, // ✅ NEW
  createPost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPostById); // ✅ FIX

// Protected
router.post("/", authMiddleware, createPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
