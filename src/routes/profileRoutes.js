import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  uploadProfileImage,
  getUserProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// PUBLIC
router.get("/:id", getUserProfile);

// PROTECTED (WITH MULTER)
router.put(
  "/image",
  authMiddleware,
  upload.single("image"), // 🔑 THIS MUST EXIST
  uploadProfileImage
);

export default router;
