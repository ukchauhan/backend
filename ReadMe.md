# Learning Backend || 
A scalable Node.js backend built with Express.js and MongoDB that provides user authentication, profile management, media upload, and channel subscription features.

This project follows a clean architecture using controllers, models, middleware, and utilities for maintainability and scalability.
📌 Features :

🔐 Authentication & Security:
   1) User registration with avatar & cover image upload
   2) Login using email or username
   3) JWT-based authentication
   4) Access & refresh token system
   5) Secure HTTP-only cookies
   6) Logout & token invalidation

👤 User Management:
   1) Get current user profile
   2) Update account details
   3) Change password
   4) Update avatar & cover image

📺 Channel & Subscription System
   1) View channel profile
   2) Subscriber & subscription count
   3) Subscription status check

☁️ Media Upload:
  1) Upload images using Mulitpart form data
  2) Cloud storage integration via Cloudinary
  3) Automatic cleanup of temporary files

🛡 Middleware & Utilities:
  1) JWT authentication middlewar
  2) Multer file upload middleware
  3) Centralized error handling
  4) Standard API response structure
  5) Async error wrapper

🛠 Tech Stack :
  - Node.js
  - Express.js
  - MongoDB & Mongoose
  - JWT Authentication
  - Cloudinary (media storage)
  - Multer (file uploads)
  - bcrypt (password hashing)
  - cookie-parser
  - dotenv

📁 Project Structure:
src/
│
├── controllers/
│   └── user.controller.js
│
├── DB/
│   └── databaseConnect.js
│
├── middlewares/
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── video.model.js
│   └── subscription.js
│
├── routes/
│   └── user.routes.js
│
├── utils/
│   ├── asyncHandler.js
│   ├── apiErrorHandler.js
│   ├── apiResponse.js
│   └── cloudinary.js
│
├── app.js
└── index.js

🔑 API Endpoints:

| Method | Endpoint                    | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/user/register`            | Register new user    |
| POST   | `/user/login`               | Login user           |
| POST   | `/user/logout`              | Logout user          |
| POST   | `/user/refresh-Accesstoken` | Refresh access token |

👤 User:

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/user/current-user`    | Get logged-in user |
| PATCH  | `/user/update-account`  | Update profile     |
| POST   | `/user/change-password` | Change password    |


