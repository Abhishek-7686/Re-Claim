// ===== Mobile Menu =====
let menuBtn = document.getElementById("menuBtn");
let navLinks = document.getElementById("navLinks");

if (menuBtn) {
    menuBtn.onclick = function () {
        navLinks.classList.toggle("active");
    };
}
// ===== Home Page Stats =====
// Pulls the real numbers from the backend instead of showing 0 always
let totalItems = document.getElementById("totalItems");
if (totalItems) {
    apiRequest("/items/found")
        .then(function (items) {
            let available = items.filter((i) => i.status === "available").length;
            let claimed = items.filter((i) => i.status === "claimed").length;
            document.getElementById("totalItems").textContent = items.length;
            document.getElementById("availableItems").textContent = available;
            document.getElementById("claimedItems").textContent = claimed;
        })
        .catch(function () {
            // If the backend isn't running yet, just leave the stats at 0
            document.getElementById("totalItems").textContent = 0;
            document.getElementById("availableItems").textContent = 0;
            document.getElementById("claimedItems").textContent = 0;
        });
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

        let submitBtn = document.getElementById("loginBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password, role }),
        })
            .then(function (data) {
                // Save the token + user info so other pages know who is logged in
                saveSession(data.token, data.user);

                if (data.user.role === "student") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "admin-dashboard.html";
                }
            })
            .catch(function (error) {
                alert(error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = role === "admin" ? "Login as Admin" : "Login as Student";
            });
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

        let studentData = {
            name: document.getElementById("studentName").value,
            email: document.getElementById("studentEmail").value,
            studentId: document.getElementById("studentId").value,
            department: document.getElementById("studentDept").value,
            year: document.getElementById("studentYear").value,
            phone: document.getElementById("studentPhone").value,
            password: password,
            confirmPassword: confirmPassword,
        };

        apiRequest("/auth/register/student", {
            method: "POST",
            body: JSON.stringify(studentData),
        })
            .then(function (data) {
                saveSession(data.token, data.user);
                alert("Account created! Welcome to ReClaim.");
                window.location.href = "dashboard.html";
            })
            .catch(function (error) {
                alert(error.message);
            });
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

        let adminData = {
            name: document.getElementById("adminName").value,
            email: document.getElementById("adminEmail").value,
            staffId: document.getElementById("staffId").value,
            department: document.getElementById("adminDept").value,
            phone: document.getElementById("adminPhone").value,
            adminKey: document.getElementById("adminKey").value,
            password: password,
            confirmPassword: confirmPassword,
        };

        apiRequest("/auth/register/admin", {
            method: "POST",
            body: JSON.stringify(adminData),
        })
            .then(function (data) {
                saveSession(data.token, data.user);
                alert("Admin account created!");
                window.location.href = "admin-dashboard.html";
            })
            .catch(function (error) {
                alert(error.message);
            });
    };
}
// ===== Contact Form =====
// Note: there is no backend route for this yet, so it just confirms
// to the user that the message was "sent". This can be connected to a
// real /api/contact route later if needed.
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

        alert("Message sent! We'll get back to you soon.");
        contactForm.reset();
    };
}
