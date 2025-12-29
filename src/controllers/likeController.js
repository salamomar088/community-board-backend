import AppError from "../services/AppError.js";
import {
  likeExists,
  addLike,
  removeLike,
  countLikesByPostId,
} from "../models/likeModel.js";

export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    if (!postId) return next(new AppError("postId is required", 400));

    const pid = Number(postId);
    const uid = req.user.id;

    const exists = await likeExists(uid, pid);

    if (exists) {
      await removeLike(uid, pid);
    } else {
      await addLike(uid, pid);
    }

    const total = await countLikesByPostId(pid);

    res.json({
      status: "success",
      liked: !exists,
      likes: total,
    });
  } catch (err) {
    next(err);
  }
};
