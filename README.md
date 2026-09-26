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

Open `.env` and set:
- `MONGODB_URI` – your MongoDB connection string (local Mongo or MongoDB Atlas)
- `JWT_SECRET` – any long random string
- `ADMIN_REGISTRATION_KEY` – a secret word admins must type in to register (share this only with real college staff)
- `PORT` – defaults to 5000

Then run:

```
npm start
```

You should see `MongoDB connected successfully` and `ReClaim server running on http://localhost:5000`.

### 2. Start the React frontend

Open a **second terminal** (keep the backend running in the first one):

```
cd client
npm install
npm run dev
```

Vite will print a local address, usually `http://localhost:5173`. Open
that in your browser.

> The frontend calls the backend at `http://localhost:5000/api` — this is
> set at the top of `client/src/services/api.js` if you ever need to change it.

## Using the app

1. Go to **Register**, pick the **Admin** tab, and create at least one
   admin account first (you'll need the `ADMIN_REGISTRATION_KEY` from your
   `.env` file). This is who students will be shown to hand items over to.
2. Register a **Student** account.
3. As a student: **Report Found Item** → fill the form → upload a photo →
   submit. You'll be shown the admin's contact details.
4. Log in as the admin → **Pending Items** → **Approve** (this means
   "I physically received the item"). The item now shows on the public
   **Found Items** page as *Available*.
5. As a student, browse **Found Items** (or the sidebar on the dashboard)
   and open an item to **Submit Claim**, describing why it's theirs.
6. As admin → **Manage Claims** → **Approve**. The item status becomes
   *Claimed*.

## Pages (matches the original spec's recommended structure)

| Page | Route | Who can access it |
|---|---|---|
| Home | `/` | Everyone |
| Login | `/login` | Everyone |
| Register | `/register` | Everyone |
| Forgot Password | `/forgot-password` | Everyone |
| About | `/about` | Everyone |
| Found Items | `/found-items` | Everyone |
| Item Details | `/item/:id` | Any logged-in user |
| Profile | `/profile` | Any logged-in user |
| Student Dashboard | `/dashboard` | Students |
| Report Found Item | `/report-item` | Students |
| My Reports | `/my-reports` | Students |
| My Claims | `/my-claims` | Students |
| Admin Dashboard | `/admin-dashboard` | Admins |
| Pending Items | `/admin/pending-items` | Admins |
| Manage Claims | `/admin/manage-claims` | Admins |

## Linting

Both `client` and `server` use [oxlint](https://oxc.rs/docs/guide/usage/linter.html)
(a fast Rust-based linter) with a config file (`.oxlintrc.json`) in each folder.

```
cd client && npm run lint
cd server && npm run lint
```

## Forgot Password

Since this project doesn't send emails (see Project Scope in the original
spec), password reset works by verifying identity instead of an email
link: the person enters their email, role, and Student ID / Staff ID.
If those three match an existing account, they can set a new password
right away. This is intentionally simple for a first version — a real
email-based reset flow is listed under Future Enhancements.

## Notes / simplifications

- Only `.jpg`, `.jpeg`, `.png`, and `.webp` images are accepted for
  uploads, matching the security requirements.
- "Reject" on a pending item deletes that report (the simplest way to
  handle "the item was never actually handed over").
- The Admin Registration Key is required so random students can't create
  admin accounts.
- "Approved Items" and "Registered Users" live inside the Admin Dashboard
  overview page rather than as separate routes, to keep the sidebar short.
- Things intentionally left out for a first version (per the project
  scope): email/SMS notifications, AI-based image matching, GPS
  tracking, and payments.
