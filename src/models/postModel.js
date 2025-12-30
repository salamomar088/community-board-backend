import db from "../config/dataBase.js";

export const getAllPostsWithUser = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.content,
      p.created_at,
      p.user_id,

      u.fullname,
      u.username,
      u.profile_picture
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `);

  // normalize avatar field
  return rows.map((row) => {
    if (row.profile_picture) {
      row.profile_image = `data:image/png;base64,${row.profile_picture.toString(
        "base64"
      )}`;
      delete row.profile_picture;
    }
    return row;
  });
};

export const getPostByIdWithUser = async (postId) => {
  const [[row]] = await db.query(
    `
    SELECT 
      p.id,
      p.title,
      p.content,
      p.created_at,
      p.user_id,

      u.fullname,
      u.username,
      u.profile_picture
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
    `,
    [postId]
  );

  if (!row) return null;

  if (row.profile_picture) {
    row.profile_image = `data:image/png;base64,${row.profile_picture.toString(
      "base64"
    )}`;
    delete row.profile_picture;
  }

  return row;
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
