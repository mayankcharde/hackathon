# 🔍 FoundIt

<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-3FA037?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Lost%20%26%20Found-Platform-blue?style=for-the-badge"/>
</p>

<p align="center">
A modern Lost & Found management platform built using the MERN Stack. FoundIt enables users to report lost items, post found items, search listings, and reconnect owners with their belongings through a secure and user-friendly web application.
</p>

---

Live Link: https://found-it-jet.vercel.app/


# 📖 Overview

FoundIt is a full-stack Lost & Found platform designed to simplify the process of reporting and recovering lost belongings. Users can create listings for lost or found items, browse available posts, communicate securely, and manage their reports through a personalized dashboard.

The application is built using **MongoDB, Express.js, React, and Node.js (MERN Stack)** with a fast React + Vite frontend and a scalable Express backend.

---

# ✨ Features

## 👤 User Features

* User Registration & Login
* Secure JWT Authentication
* User Dashboard
* Report Lost Items
* Report Found Items
* Browse Item Listings
* Search Items
* View Item Details
* Manage Personal Listings
* Responsive User Interface

---

## 📦 Item Management

* Create Lost Item Posts
* Create Found Item Posts
* Edit Existing Listings
* Delete Listings
* Item Categories
* Upload Item Information
* Track Item Status

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Protected Routes
* Authentication Middleware
* Secure API Access

---

# 🛠 Tech Stack

### Frontend

* React.js
* Vite
* CSS3
* JavaScript (ES6+)
* Axios
* React Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

---

# 📂 Project Structure

```text
FoundIt/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/mayankcharde/FoundIt.git

cd FoundIt
```

---

## Backend Setup

```bash
cd Backend

npm install
```

Create a `.env` file inside the **Backend** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start
```

or

```bash
node server.js
```

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔑 Environment Variables

| Variable   | Description               |
| ---------- | ------------------------- |
| PORT       | Backend Server Port       |
| MONGO_URI  | MongoDB Connection String |
| JWT_SECRET | JWT Secret Key            |

---

# 📦 Core Modules

* User Authentication
* Lost Item Management
* Found Item Management
* Search & Filtering
* User Dashboard
* Profile Management

---

# 🎨 Frontend Highlights

* Responsive Design
* React Context API
* Fast React + Vite
* Reusable Components
* Clean & Modern UI
* Optimized Performance

---

# ⚡ Performance

* Fast API Responses
* Optimized MongoDB Queries
* Lightweight React Application
* Efficient State Management
* Scalable Backend Architecture

---

# 🚀 Future Enhancements

* Image Upload Support
* AI-Based Item Matching
* Location-Based Search
* Real-Time Notifications
* In-App Messaging
* Email Notifications
* Advanced Filters
* Admin Dashboard
* Dark Mode
* Mobile Application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.

2. Create a new branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to your branch.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

# 📄 License

This project is developed for educational and learning purposes.

---

# 👨‍💻 Author

**Mayank Charde**

* GitHub: https://github.com/mayankcharde

If you found this project useful, don't forget to ⭐ the repository!
