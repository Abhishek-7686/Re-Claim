// ===== Mobile Menu =====
let menuBtn = document.getElementById("menuBtn");
let navLinks = document.getElementById("navLinks");

if (menuBtn) {
    menuBtn.onclick = function () {
        navLinks.classList.toggle("active");
    };
}
// ===== Home Page Stats =====
let totalItems = document.getElementById("totalItems");
if (totalItems) {
    document.getElementById("totalItems").textContent = 0;
    document.getElementById("availableItems").textContent = 0;
    document.getElementById("claimedItems").textContent = 0;
}
// ===== Student / Admin Toggle (Login & Register pages) =====
let studentBtn = document.getElementById("studentBtn");
let adminBtn = document.getElementById("adminBtn");

if (studentBtn && adminBtn) {
    studentBtn.onclick = function () {
        showStudent();
    };

    adminBtn.onclick = function () {
        showAdmin();
    };
}
function showStudent() {
    studentBtn.classList.add("active");
    adminBtn.classList.remove("active");

    // Register page
    let studentForm = document.getElementById("studentForm");
    let adminForm = document.getElementById("adminForm");
    if (studentForm && adminForm) {
        studentForm.classList.remove("hidden");
        adminForm.classList.add("hidden");
    }

    // Login page
    let loginRole = document.getElementById("loginRole");
    let loginBtn = document.getElementById("loginBtn");
    if (loginRole && loginBtn) {
        loginRole.value = "student";
        loginBtn.textContent = "Login as Student";
    }
}
function showAdmin() {
    adminBtn.classList.add("active");
    studentBtn.classList.remove("active");

    // Register page
    let studentForm = document.getElementById("studentForm");
    let adminForm = document.getElementById("adminForm");
    if (studentForm && adminForm) {
        adminForm.classList.remove("hidden");
        studentForm.classList.add("hidden");
    }

    // Login page
    let loginRole = document.getElementById("loginRole");
    let loginBtn = document.getElementById("loginBtn");
    if (loginRole && loginBtn) {
        loginRole.value = "admin";
        loginBtn.textContent = "Login as Admin";
    }
}
// ===== Login Form =====
let loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.onsubmit = function (event) {
        event.preventDefault(); // stop page from refreshing

        let role = document.getElementById("loginRole").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        console.log("Role:", role);
        console.log("Email:", email);
        console.log("Password:", password);

        alert("Login clicked as " + role + "! (Backend not connected yet)");

        if (role === "student") {
            window.location.href = "dashboard.html";
        } else if (role === "admin") {
            window.location.href = "admin-dashboard.html";
        }
    };
}
// ===== Student Register Form =====
let studentForm = document.getElementById("studentForm");

if (studentForm) {
    studentForm.onsubmit = function (event) {
        event.preventDefault(); // stop page from refreshing

        let password = document.getElementById("studentPassword").value;
        let confirmPassword = document.getElementById("studentConfirmPassword").value;

        // check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let name = document.getElementById("studentName").value;
        console.log("Student Name:", name);
        alert("Student registered! (Backend not connected yet)");
    };
}
// ===== Admin Register Form =====
let adminForm = document.getElementById("adminForm");

if (adminForm) {
    adminForm.onsubmit = function (event) {
        event.preventDefault(); // stop page from refreshing

        let password = document.getElementById("adminPassword").value;
        let confirmPassword = document.getElementById("adminConfirmPassword").value;

        // check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        let name = document.getElementById("adminName").value;
        console.log("Admin Name:", name);
        alert("Admin registered! (Backend not connected yet)");
    };
}
// ===== Contact Form =====
let contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.onsubmit = function (event) {
        event.preventDefault(); // stop page from refreshing

        let name = document.getElementById("contactName").value;
        let email = document.getElementById("contactEmail").value;
        let subject = document.getElementById("contactSubject").value;
        let message = document.getElementById("contactMessage").value;

        console.log("Contact Name:", name);
        console.log("Contact Email:", email);
        console.log("Contact Subject:", subject);
        console.log("Contact Message:", message);

        alert("Message sent! (Backend not connected yet)");
        contactForm.reset();
    };
}