import AppError from "../services/AppError.js";
import { updateUserProfileImage, findUserById } from "../models/userModel.js";

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

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Convert BLOB → base64
    if (user.profile_picture) {
      user.profile_picture = `data:image/png;base64,${user.profile_picture.toString(
        "base64"
      )}`;
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
