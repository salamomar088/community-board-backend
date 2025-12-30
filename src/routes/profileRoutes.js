import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadProfileImage,
  getUserProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Protected
router.put("/image", authMiddleware, uploadProfileImage);
router.get("/:id", getUserProfile);

export default router;
