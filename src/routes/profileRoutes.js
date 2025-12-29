import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadProfileImage } from "../controllers/profileController.js";

const router = express.Router();

// Protected
router.put("/image", authMiddleware, uploadProfileImage);

export default router;
