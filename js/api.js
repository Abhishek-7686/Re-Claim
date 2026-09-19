// ===== Shared helper for talking to our backend =====
// Every other .js file uses these small functions instead of repeating
// fetch() code everywhere. Keep this file loaded BEFORE the other scripts.

// Change this if your backend runs on a different address
const API_BASE = "http://localhost:5000/api";

// ----- Saving / reading the logged-in user's info -----
function saveSession(token, user) {
    localStorage.setItem("reclaimToken", token);
    localStorage.setItem("reclaimUser", JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem("reclaimToken");
}

function getUser() {
    let userText = localStorage.getItem("reclaimUser");
    return userText ? JSON.parse(userText) : null;
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem("reclaimToken");
    localStorage.removeItem("reclaimUser");
    window.location.href = "login.html";
}

// ----- Redirect helpers used at the top of protected pages -----
// If nobody is logged in, or the wrong role opens this page, send them away.
function requireRole(expectedRole) {
    let user = getUser();
    if (!isLoggedIn() || !user) {
        window.location.href = "login.html";
        return null;
    }
    if (user.role !== expectedRole) {
        // A student trying to open the admin dashboard (or vice versa)
        window.location.href = user.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
        return null;
    }
    return user;
}

// ----- Turns a stored image filename into a full URL the browser can load -----
function imageUrl(fileName) {
    return "http://localhost:5000/uploads/" + fileName;
}

// ----- A small wrapper around fetch() that adds the login token and -----
// ----- turns error responses into a normal JavaScript Error. -----
async function apiRequest(path, options = {}) {
    let headers = options.headers || {};

    // Only set JSON content-type when we are NOT sending a file (FormData
    // sets its own content-type automatically with the correct boundary)
    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    let token = getToken();
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    let response = await fetch(API_BASE + path, {
        method: options.method || "GET",
        headers: headers,
        body: options.body,
    });

    let data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}

// ----- Updates the navbar login/register buttons if user is already logged in -----
function updateNavForLoginState() {
    let navButtons = document.querySelector(".nav-buttons");
    if (!navButtons) return;

    let loginBtn = navButtons.querySelector('a[href="login.html"]');
    let registerBtn = navButtons.querySelector('a[href="register.html"]');
    let user = getUser();

    // Only touch navbars that still show the plain Login/Register buttons
    // (dashboard pages already have their own welcome text + logout button)
    if (isLoggedIn() && user && loginBtn && registerBtn) {
        let dashboardPage = user.role === "admin" ? "admin-dashboard.html" : "dashboard.html";
        loginBtn.textContent = "Dashboard";
        loginBtn.href = dashboardPage;
        registerBtn.textContent = "Logout";
        registerBtn.href = "#";
        registerBtn.onclick = function (event) {
            event.preventDefault();
            logout();
        };
    }
}

document.addEventListener("DOMContentLoaded", updateNavForLoginState);
