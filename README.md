Community Board Backend

Backend service for the Community Board application, built with Node.js, Express, and MySQL.
This API handles authentication, posts, tags, likes, comments, and user profiles.

🚀 Features

JWT Authentication (Register / Login)

Create, read, update, delete posts

Post tags (stored as JSON)

Like system

Comments system

User profiles with profile images

Secure protected routes

MySQL database integration

🛠 Tech Stack

Node.js

Express

MySQL

JWT (JSON Web Tokens)

Multer (file uploads)

mysql2

Cors

📁 Project Structure
src/
├── config/
│   └── dataBase.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── server.js

⚙️ Environment Variables

Create a .env file in the root of the backend project:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=community_board
DB_PORT=3306
JWT_SECRET=your_secret_key
NODE_ENV=development

▶️ Run Locally

Install dependencies:

npm install


Start development server:

npm start

Backend will run at:

http://localhost:5000

🌐 API Endpoints
Authentication
POST   /api/auth/register
POST   /api/auth/login

Posts
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts        (protected)
PUT    /api/posts/:id    (protected)
DELETE /api/posts/:id    (protected)

Likes
POST   /api/likes        (protected)

Comments
GET    /api/comments/:postId
POST   /api/comments     (protected)

Profile
GET    /api/profile/:id
PUT    /api/profile/image (protected)

🏷 Tags System

Tags are stored as JSON strings in the database

Parsed safely when fetched

Returned to frontend as arrays

Used for filtering posts dynamically

🔐 Authentication

Uses JWT

Token must be sent in header:

Authorization: Bearer <token>


Protected routes require a valid token.

📦 Deployment

Backend can be deployed on Render


Frontend communicates via REST API

👨‍💻 Author

Omar Salam
Computer Science
Lebanese International University (LIU)
