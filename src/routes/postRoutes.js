import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getPosts,
  getPostById, // ✅ NEW
  createPost,
  deletePost,
  updatePost,
} from "../controllers/postController.js";

const router = express.Router();

// Public
router.get("/", getPosts);
router.get("/:id", getPostById); // ✅ FIX

// Protected
router.post("/", authMiddleware, createPost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);
export default router;
