
DROP DATABASE IF EXISTS community_board;
CREATE DATABASE community_board
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE community_board;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Tables
-- --------------------------------------------------------

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_picture LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Posts
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shared_post_id INT DEFAULT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  image LONGBLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_posts_shared
    FOREIGN KEY (shared_post_id) REFERENCES posts(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Comments
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Likes
CREATE TABLE likes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  UNIQUE KEY uniq_user_post (user_id, post_id),
  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_likes_post
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Post Categories (pivot)
CREATE TABLE post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (post_id, category_id),
  CONSTRAINT fk_pc_post
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_pc_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Procedures (silent, Node-friendly)
-- --------------------------------------------------------

-- Register User (ignore duplicates)
CREATE PROCEDURE RegisterUser(
  IN p_fullname VARCHAR(100),
  IN p_username VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_password VARCHAR(255)
)
INSERT IGNORE INTO users (fullname, username, email, password)
VALUES (p_fullname, p_username, p_email, p_password);

-- Create Post
CREATE PROCEDURE CreatePost(
  IN p_user_id INT,
  IN p_title VARCHAR(255),
  IN p_content TEXT,
  IN p_image LONGBLOB
)
INSERT INTO posts (user_id, title, content, image)
VALUES (p_user_id, p_title, p_content, p_image);

-- Share Post
CREATE PROCEDURE SharePost(
  IN p_user_id INT,
  IN p_original_post_id INT
)
INSERT INTO posts (user_id, shared_post_id, content)
SELECT p_user_id, id, content
FROM posts
WHERE id = p_original_post_id;

-- Delete Post
CREATE PROCEDURE DeletePost(
  IN p_post_id INT
)
DELETE FROM posts WHERE id = p_post_id;

-- Add Comment
CREATE PROCEDURE AddComment(
  IN p_user_id INT,
  IN p_post_id INT,
  IN p_content TEXT
)
INSERT INTO comments (user_id, post_id, content)
VALUES (p_user_id, p_post_id, p_content);

-- Like Post
CREATE PROCEDURE LikePost(
  IN p_user_id INT,
  IN p_post_id INT
)
INSERT IGNORE INTO likes (user_id, post_id)
VALUES (p_user_id, p_post_id);

-- Unlike Post
CREATE PROCEDURE UnlikePost(
  IN p_user_id INT,
  IN p_post_id INT
)
DELETE FROM likes
WHERE user_id = p_user_id AND post_id = p_post_id;

-- --------------------------------------------------------
-- Triggers (safety net)
-- --------------------------------------------------------

-- Cleanup comments after post delete
CREATE TRIGGER after_post_delete_comments
AFTER DELETE ON posts
FOR EACH ROW
DELETE FROM comments WHERE post_id = OLD.id;

-- Cleanup likes after post delete
CREATE TRIGGER after_post_delete_likes
AFTER DELETE ON posts
FOR EACH ROW
DELETE FROM likes WHERE post_id = OLD.id;

--added tags column to posts table--
ALTER TABLE posts
ADD tags JSON NULL;