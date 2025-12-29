import AppError from "../services/AppError.js";
import { updateUserProfileImage } from "../models/userModel.js";

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError("Image file required", 400));
    }

    const affected = await updateUserProfileImage(req.user.id, req.file.buffer);

    if (!affected) {
      return next(new AppError("User not found", 404));
    }

    res.json({ status: "success", message: "Profile image updated" });
  } catch (err) {
    next(err);
  }
};
