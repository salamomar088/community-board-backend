import db from "../config/dataBase.js";

export const findUserByEmail = async (email) => {
  const [[user]] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return user || null;
};
export const findUserById = async (userId) => {
  const [[user]] = await db.query(
    `
    SELECT 
      id,
      fullname,
      username,
      email,
      profile_picture
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return user || null;
};

export const createUser = async (fullname, username, email, hashedPassword) => {
  const [result] = await db.query(
    "INSERT INTO users (fullname, username, email, password) VALUES (?, ?, ?, ?)",
    [fullname, username, email, hashedPassword]
  );
  return result.insertId;
};

export const updateUserProfileImage = async (userId, imageBuffer) => {
  const [result] = await db.query(
    "UPDATE users SET profile_picture = ? WHERE id = ?",
    [imageBuffer, userId]
  );
  return result.affectedRows;
};
