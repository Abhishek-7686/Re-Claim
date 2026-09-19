// ===== Only logged-in admins can see this page =====
let currentAdmin = requireRole("admin");

if (currentAdmin) {
    document.getElementById("welcomeText").textContent = "Admin: " + currentAdmin.name + " 👋";
}

let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = function (event) {
        event.preventDefault();
        logout();
    };
}

// Data loaded from the backend
let pendingItems = [];
let approvedItems = [];
let claimRequests = [];
let registeredUsers = [];

// ===== Tab Switching =====
function showAdminTab(tabName) {
    const tabs = document.querySelectorAll(".dash-tab");
    tabs.forEach(tab => tab.classList.add("hidden"));

    const buttons = document.querySelectorAll(".dash-nav-btn");
    buttons.forEach(btn => btn.classList.remove("active"));

    let targetTab = document.getElementById("tab-" + tabName);
    if (targetTab) {
        targetTab.classList.remove("hidden");
    }

    let targetBtn = document.getElementById(
        "tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1) + "Btn"
    );
    if (targetBtn) {
        targetBtn.classList.add("active");
    }
}

function formatDate(dateString) {
    let d = new Date(dateString);
    return d.toLocaleDateString();
}

// ===== Render Overview =====
function renderAdminOverview(stats) {
    document.getElementById("statPending").textContent = stats.pendingReports;
    document.getElementById("statApprovedTotal").textContent = stats.availableItems + stats.claimedItems;
    document.getElementById("statClaimRequests").textContent = stats.pendingClaims;
    document.getElementById("statUsers").textContent = stats.totalUsers;

    let activityList = document.getElementById("adminRecentActivity");
    let html = "";

    pendingItems.slice(0, 2).forEach(item => {
        html += `
            <div class="activity-row">
                <span><strong>${item.reportedBy ? item.reportedBy.name : "A student"}</strong> reported "${item.itemName}"</span>
                <span class="badge badge-pending">Needs Review</span>
            </div>`;
    });

    claimRequests.slice(0, 2).forEach(claim => {
        html += `
            <div class="activity-row">
                <span><strong>${claim.student ? claim.student.name : "A student"}</strong> requested to claim "${claim.item ? claim.item.itemName : "an item"}"</span>
                <span class="badge badge-pending">Needs Verification</span>
            </div>`;
    });

    activityList.innerHTML = html || "<p>No recent activity.</p>";
}

// ===== Render Pending Items (with Approve / Reject) =====
function renderPendingItems() {
    let list = document.getElementById("pendingItemsList");

    let html = "";
    pendingItems.forEach(item => {
        html += `
            <div class="dash-card">
                <img class="item-image-preview" src="${imageUrl(item.image)}" alt="${item.itemName}">
                <div class="dash-card-top">
                    <h3>${item.itemName}</h3>
                    <span class="badge badge-pending">Pending</span>
                </div>
                <p>👤 Reported by ${item.reportedBy ? item.reportedBy.name : "Unknown"}</p>
                <p>📍 ${item.locationFound}</p>
                <p>📅 ${formatDate(item.dateFound)}</p>
                <p>📝 ${item.description}</p>
                <div class="dash-card-actions">
                    <button class="btn" onclick="approveItem('${item._id}')">Approve (Item Received)</button>
                    <button class="btn outline" onclick="rejectItem('${item._id}')">Reject</button>
                </div>
            </div>`;
    });

    list.innerHTML = html || "<p>No items awaiting review.</p>";
}

// ===== Render Approved Items =====
function renderApprovedItems() {
    let list = document.getElementById("approvedItemsList");

    let html = "";
    approvedItems.forEach(item => {
        html += `
            <div class="dash-card">
                <img class="item-image-preview" src="${imageUrl(item.image)}" alt="${item.itemName}">
                <div class="dash-card-top">
                    <h3>${item.itemName}</h3>
                    <span class="badge ${item.status === 'claimed' ? 'badge-claimed' : 'badge-approved'}">
                        ${item.status === 'claimed' ? 'Claimed' : 'Available'}
                    </span>
                </div>
                <p>📍 ${item.locationFound}</p>
                <p>📅 ${formatDate(item.dateFound)}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>No approved items yet.</p>";
}

// ===== Render Claim Requests (with Approve / Reject) =====
function renderClaimRequests() {
    let list = document.getElementById("claimRequestsList");

    let html = "";
    claimRequests.forEach(claim => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${claim.item ? claim.item.itemName : "Item"}</h3>
                    <span class="badge badge-pending">Pending</span>
                </div>
                <p>👤 Claimed by ${claim.student ? claim.student.name : "Unknown"}</p>
                <p>📅 Requested on ${formatDate(claim.createdAt)}</p>
                <p>📝 "${claim.claimDetails}"</p>
                <div class="dash-card-actions">
                    <button class="btn" onclick="approveClaim('${claim._id}')">Approve</button>
                    <button class="btn outline" onclick="rejectClaim('${claim._id}')">Reject</button>
                </div>
            </div>`;
    });

    list.innerHTML = html || "<p>No claim requests right now.</p>";
}

// ===== Render Registered Users Table =====
function renderUsersTable() {
    let tbody = document.getElementById("usersTableBody");

    let html = "";
    registeredUsers.forEach(user => {
        html += `
            <tr>
                <td>${user.name}</td>
                <td><span class="badge">${user.role === "admin" ? "Admin" : "Student"}</span></td>
                <td>${user.email}</td>
                <td>${formatDate(user.createdAt)}</td>
            </tr>`;
    });

    tbody.innerHTML = html;
}

// ===== Actions =====
function approveItem(id) {
    apiRequest("/admin/items/" + id + "/approve", { method: "PUT" })
        .then(function (data) {
            alert(data.message);
            loadAdminData();
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function rejectItem(id) {
    if (!confirm("Reject this report? This will remove it permanently.")) return;

    apiRequest("/admin/items/" + id + "/reject", { method: "PUT" })
        .then(function (data) {
            alert(data.message);
            loadAdminData();
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function approveClaim(id) {
    apiRequest("/admin/claims/" + id + "/approve", { method: "PUT" })
        .then(function (data) {
            alert(data.message);
            loadAdminData();
        })
        .catch(function (error) {
            alert(error.message);
        });
}

function rejectClaim(id) {
    apiRequest("/admin/claims/" + id + "/reject", { method: "PUT" })
        .then(function (data) {
            alert(data.message);
            loadAdminData();
        })
        .catch(function (error) {
            alert(error.message);
        });
}

// ===== Load everything from the backend, then render it =====
function loadAdminData() {
    Promise.all([
        apiRequest("/admin/items/pending"),
        apiRequest("/admin/items/approved"),
        apiRequest("/admin/claims"),
        apiRequest("/admin/users"),
        apiRequest("/admin/stats"),
    ])
        .then(function (results) {
            pendingItems = results[0];
            approvedItems = results[1];
            claimRequests = results[2];
            registeredUsers = results[3];
            let stats = results[4];

            renderAdminOverview(stats);
            renderPendingItems();
            renderApprovedItems();
            renderClaimRequests();
            renderUsersTable();
        })
        .catch(function (error) {
            alert("Could not load the admin dashboard: " + error.message);
        });
}

// ===== Init =====
loadAdminData();
