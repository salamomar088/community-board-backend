import db from "../config/dataBase.js";

export const getAllPostsWithUser = async () => {
  const [rows] = await db.query(`
    SELECT 
      posts.id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.user_id,
      users.fullname,
      users.email
    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY posts.created_at DESC
  `);
  return rows;
};
export const getPostByIdWithUser = async (postId) => {
  const [rows] = await db.query(
    `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.created_at,
      u.id AS user_id,
      u.username,
      u.email
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
    `,
    [postId]
  );

  return rows[0] || null;
};

export const createPost = async (
  userId,
  title,
  content,
  imageBuffer = null
) => {
  const [result] = await db.query(
    "INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)",
    [userId, title, content, imageBuffer]
  );
  return result.insertId;
};

export const findPostOwner = async (postId) => {
  const [[row]] = await db.query("SELECT user_id FROM posts WHERE id = ?", [
    postId,
  ]);
  return row || null;
};

export const deletePostById = async (postId) => {
  const [result] = await db.query("DELETE FROM posts WHERE id = ?", [postId]);
  return result.affectedRows;
};
