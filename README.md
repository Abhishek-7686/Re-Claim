# ReClaim - College Lost & Found Management System

ReClaim is a web app where students can report items they've found on
campus, hand them over to an admin, and other students can browse and
claim approved items.

Workflow: **Report → Hand Over → Verify → Approve → Display → Claim**

## Tech used

- Frontend: React.js (Vite) + React Router
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt password hashing
- Image uploads: Multer (saved to `server/uploads`)

## Project structure

```
Re-Claim/
├── client/                      <- React frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/          <- Navbar, Footer, ItemCard, ProtectedRoute, DashboardLayout
│       ├── pages/                <- one file per page (Home, Login, Register, ...)
│       ├── services/api.js      <- every backend call lives here
│       ├── context/AuthContext.jsx  <- who's logged in, across the whole app
│       ├── utils.js
│       ├── App.jsx               <- all routes
│       ├── main.jsx              <- React entry point
│       └── index.css
│
└── server/                      <- Express backend (unchanged)
    ├── server.js
    ├── config/db.js
    ├── models/ (User, Item, Claim)
    ├── controllers/
    ├── routes/
    ├── middleware/ (auth, role check, image upload)
    └── uploads/                 <- uploaded item images get saved here
```

## How to run it

### 1. Start the backend

```
cd server
npm install
cp .env.example .env
```
