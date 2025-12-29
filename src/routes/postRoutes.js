import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getPosts,
  createPost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

// Public
router.get("/", getPosts);

// Protected
router.post("/", authMiddleware, createPost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
