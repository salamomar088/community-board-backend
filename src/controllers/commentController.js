import AppError from "../services/AppError.js";
import {
  getCommentsByPostId,
  createComment as createCommentModel,
} from "../models/commentModel.js";

export const getCommentsByPost = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    const comments = await getCommentsByPostId(postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    if (!postId) return next(new AppError("postId is required", 400));
    if (!content) return next(new AppError("Comment content is required", 400));

    await createCommentModel(Number(postId), req.user.id, content);

    res.status(201).json({ status: "success", message: "Comment added" });
  } catch (err) {
    next(err);
  }
};
