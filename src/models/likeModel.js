import db from "../config/dataBase.js";

export const likeExists = async (userId, postId) => {
  const [[row]] = await db.query(
    "SELECT id FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId]
  );
  return !!row;
};

export const addLike = async (userId, postId) => {
  const [result] = await db.query(
    "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
    [userId, postId]
  );
  return result.insertId;
};

export const removeLike = async (userId, postId) => {
  const [result] = await db.query(
    "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
    [userId, postId]
  );
  return result.affectedRows;
};

export const countLikesByPostId = async (postId) => {
  const [[row]] = await db.query(
    "SELECT COUNT(*) AS total FROM likes WHERE post_id = ?",
    [postId]
  );
  return row?.total ?? 0;
};
