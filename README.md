# ReClaim - College Lost & Found Portal

ReClaim is a simple web portal that helps a college community reconnect
students and staff with items they've lost on campus. Anyone can report a
found item, an admin verifies it, and the rightful owner can browse and
claim it.

> **Status:** Front-end prototype. All forms and dashboards currently run
> on placeholder data in the browser — there is no backend or database
> connected yet (see [Current Limitations](#current-limitations) below).

---

## Features

- **Home page** — introduces ReClaim and the "Report → Hand Over → Approve → Claim" flow.
- **Login / Register** — separate flows for Student and Admin roles, with role-based fields (e.g. Admin Registration Key).
- **Student Dashboard** — overview stats, items you've reported, a searchable browse-and-claim view, your claim history, and a profile tab.
- **Admin Dashboard** — pending item review (approve/reject), approved items, claim request verification, and a registered users table.
- **Found Items page** — public, searchable/filterable list of approved items, open to anyone (no login required to browse).
- **About / Contact pages** — project info and a contact form.

## Project Structure

```
ReClaim/
├── index.html              Home page
├── login.html               Login (Student / Admin)
├── register.html             Register (Student / Admin)
├── dashboard.html            Student dashboard
├── admin-dashboard.html       Admin dashboard
├── found-items.html          Public found-items browse page
├── about.html                About page
├── contact.html                Contact page
├── css/
│   └── style.css             All site styling
└── js/
    ├── script.js              Shared logic: nav menu, login/register forms, contact form
    ├── dashboard.js            Student dashboard: tabs + placeholder data
    ├── admin-dashboard.js       Admin dashboard: tabs, approve/reject actions + placeholder data
    └── found-items.js           Found items search/filter logic
```

## How to Run

This is a static site — no build step or server required.

1. Download / clone the project folder.
2. Open `index.html` directly in a browser, **or** serve it locally:
   ```bash
   cd ReClaim
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000`.

## Tech Stack

- HTML5
- CSS3 (plain, no framework)
- Vanilla JavaScript (no build tools or dependencies)

## User Flows

**Student**
1. Register or log in as a Student.
2. Land on the Student Dashboard — see stats, report items, browse approved items, and track claims.
3. Claim an item found in the Browse tab; track its status under My Claims.

**Admin**
1. Register or log in as an Admin (requires an Admin Registration Key).
2. Land on the Admin Dashboard — review pending items, approve or reject them.
3. Verify and approve/reject student claim requests.
4. View all registered users.

## Current Limitations

Since there is no backend yet:
- All data (items, claims, users, stats) is **hardcoded placeholder data** in the `.js` files — nothing persists after a page refresh.
- Login and registration forms only validate input client-side and simulate success with `alert()` — there is no real authentication.
- Approve/reject and claim actions update in-memory JavaScript arrays only, not a real database.
- The Admin Registration Key is not actually validated anywhere (this must be done server-side once a backend exists, never in client-side JS).

## Planned Next Steps

- Build a backend (e.g. Node.js/Express or Django) exposing REST APIs for auth, items, and claims.
- Add a database (e.g. MySQL/PostgreSQL/MongoDB) with `Users`, `Items`, and `Claims` tables.
- Implement real authentication: password hashing (bcrypt), sessions or JWT, and role-based access control.
- Add image upload support for reported items.
- Build the `report-item` page for submitting new found items with details and photos.

## License

Student project — for academic/educational use.
