import logger from "../services/logger.js";
import AppError from "../services/AppError.js";
import {
  getAllPostsWithUser,
  getPostByIdWithUser, // ✅ NEW
  createPost as createPostModel,
  findPostOwner,
  deletePostById,
  updatePostById,
} from "../models/postModel.js";

export const getPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsWithUser();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};
export const getPostById = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    if (Number.isNaN(postId)) {
      return next(new AppError("Invalid post ID", 400));
    }

    const post = await getPostByIdWithUser(postId);

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    // ✅ FIX: safely stringify tags
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

    const imageBuffer = req.file ? req.file.buffer : null;

    await createPostModel(req.user.id, title, content, imageBuffer, tagsJson);

    logger.info(`Post created by user ${req.user.id}`);

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);
    const { title, content } = req.body;

    if (!title || !content) {
      return next(new AppError("Title and content are required", 400));
    }

    const owner = await findPostOwner(postId);
    if (!owner) {
      return next(new AppError("Post not found", 404));
    }

    if (owner.user_id !== req.user.id) {
      return next(new AppError("Unauthorized action", 403));
    }

    await updatePostById(postId, title, content);

    res.json({ status: "success", message: "Post updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.id);

    const owner = await findPostOwner(postId);
    if (!owner) {
      return next(new AppError("Post not found", 404));
    }

    if (owner.user_id !== req.user.id) {
      return next(new AppError("Unauthorized action", 403));
    }

    await deletePostById(postId);

    logger.info(`Post ${postId} deleted by user ${req.user.id}`);

    res.json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
