// ===== Only students should be able to report items =====
let currentUser = requireRole("student");

// Show the student's name in the navbar, and wire up logout
if (currentUser) {
    document.getElementById("welcomeText").textContent = "Hi, " + currentUser.name + " 👋";
}

let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = function (event) {
        event.preventDefault();
        logout();
    };
}

// ===== Handle form submit =====
let reportForm = document.getElementById("reportForm");

if (reportForm) {
    reportForm.onsubmit = function (event) {
        event.preventDefault();

        let submitBtn = document.getElementById("submitReportBtn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        // We use FormData here (instead of JSON) because we are also
        // sending an image file along with the text fields.
        let formData = new FormData();
        formData.append("itemName", document.getElementById("itemName").value);
        formData.append("category", document.getElementById("category").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("color", document.getElementById("color").value);
        formData.append("locationFound", document.getElementById("locationFound").value);
        formData.append("dateFound", document.getElementById("dateFound").value);
        formData.append("additionalDetails", document.getElementById("additionalDetails").value);
        formData.append("image", document.getElementById("itemImage").files[0]);

        apiRequest("/items", {
            method: "POST",
            body: formData,
        })
            .then(function (data) {
                showAdminInfo(data.admin);
            })
            .catch(function (error) {
                alert(error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Report";
            });
    };
}

// ===== Swap the form out for the "hand over to this admin" card =====
function showAdminInfo(admin) {
    document.getElementById("reportFormCard").classList.add("hidden");

    let box = document.getElementById("adminInfoBox");

    if (admin) {
        box.innerHTML = `
            <h3>Hand the item to:</h3>
            <div class="admin-info-row"><span>Admin Name</span><span>${admin.name}</span></div>
            <div class="admin-info-row"><span>Office</span><span>${admin.office}</span></div>
            <div class="admin-info-row"><span>Location</span><span>${admin.officeLocation}</span></div>
            <div class="admin-info-row"><span>Contact</span><span>${admin.phone}</span></div>
            <div class="admin-info-row"><span>Office Hours</span><span>${admin.officeHours}</span></div>
        `;
    } else {
        box.innerHTML = `<p>No admin is registered yet. Please check back later or visit the Student Affairs Office directly.</p>`;
    }

    document.getElementById("successCard").classList.remove("hidden");
}
