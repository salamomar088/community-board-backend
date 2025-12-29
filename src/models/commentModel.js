import db from "../config/dataBase.js";

export const getCommentsByPostId = async (postId) => {
  const [rows] = await db.query(
    `
    SELECT 
      comments.id,
      comments.content,
      comments.created_at,
      comments.post_id,
      comments.user_id,
      users.fullname,
      users.email
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
    `,
    [postId]
  );

  return rows;
};

export const createComment = async (postId, userId, content) => {
  const [result] = await db.query(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
    [postId, userId, content]
  );
  return result.insertId;
};
