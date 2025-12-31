import db from "../config/dataBase.js";

const parseTags = (value) => {
  try {
    if (!value) return [];

    if (Buffer.isBuffer(value)) {
      return JSON.parse(value.toString("utf8"));
    }

    if (typeof value === "string") {
      return JSON.parse(value);
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  } catch {
    return [];
  }
};

export const getAllPostsWithUser = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.content,
      p.created_at,
      p.user_id,
      ANY_VALUE(p.tags) AS tags,
      u.fullname,
      u.username,
      u.profile_picture,
      COUNT(l.id) AS votes
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return rows.map((row) => {
    row.tags = parseTags(row.tags);

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
      ANY_VALUE(p.tags) AS tags,
      u.fullname,
      u.username,
      u.profile_picture,
      COUNT(l.id) AS votes
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN likes l ON l.post_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
    `,
    [postId]
  );

  if (!row) return null;

  row.tags = parseTags(row.tags);

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
  imageBuffer = null,
  tagsJson = "[]"
) => {
  const [result] = await db.query(
    "INSERT INTO posts (user_id, title, content, image, tags) VALUES (?, ?, ?, ?, ?)",
    [userId, title, content, imageBuffer, tagsJson]
  );
  return result.insertId;
};

export const updatePostById = async (postId, title, content) => {
  const [result] = await db.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, postId]
  );
  return result.affectedRows;
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
