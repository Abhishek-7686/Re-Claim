// ===== Placeholder Data (will come from backend later) =====
let pendingItems = [
    { id: 1, name: "Red Backpack", reportedBy: "Aarav Sharma", location: "Main Gate", date: "2026-09-01" },
    { id: 2, name: "Wired Earphones", reportedBy: "Simran Kaur", location: "Canteen", date: "2026-09-02" },
    { id: 3, name: "Physics Notebook", reportedBy: "Rohan Mehta", location: "Room 204", date: "2026-09-03" },
];

let approvedItems = [
    { id: 4, name: "Grey Backpack", location: "Main Gate", date: "2026-08-27" },
    { id: 5, name: "Scientific Calculator", location: "Exam Hall B", date: "2026-08-26" },
    { id: 6, name: "Silver Wristwatch", location: "Sports Ground", date: "2026-08-24" },
];

let claimRequests = [
    { id: 1, item: "USB Drive (16GB)", claimant: "Aarav Sharma", date: "2026-08-29" },
    { id: 2, item: "ID Card Holder", claimant: "Neha Gupta", date: "2026-08-30" },
];

const registeredUsers = [
    { name: "Aarav Sharma", role: "Student", email: "aarav.sharma@college.edu", joined: "2026-07-10" },
    { name: "Simran Kaur", role: "Student", email: "simran.kaur@college.edu", joined: "2026-07-15" },
    { name: "Rohan Mehta", role: "Student", email: "rohan.mehta@college.edu", joined: "2026-07-18" },
    { name: "Priya Verma", role: "Admin", email: "priya.verma@college.edu", joined: "2026-06-01" },
];

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

// ===== Render Overview =====
function renderAdminOverview() {
    let statPending = document.getElementById("statPending");
    if (!statPending) return;

    document.getElementById("statPending").textContent = pendingItems.length;
    document.getElementById("statApprovedTotal").textContent = approvedItems.length;
    document.getElementById("statClaimRequests").textContent = claimRequests.length;
    document.getElementById("statUsers").textContent = registeredUsers.length;

    let activityList = document.getElementById("adminRecentActivity");
    let html = "";

    pendingItems.slice(0, 2).forEach(item => {
        html += `
            <div class="activity-row">
                <span><strong>${item.reportedBy}</strong> reported "${item.name}"</span>
                <span class="badge badge-pending">Needs Review</span>
            </div>`;
    });

    claimRequests.slice(0, 2).forEach(claim => {
        html += `
            <div class="activity-row">
                <span><strong>${claim.claimant}</strong> requested to claim "${claim.item}"</span>
                <span class="badge badge-pending">Needs Verification</span>
            </div>`;
    });

    activityList.innerHTML = html || "<p>No recent activity.</p>";
}

// ===== Render Pending Items (with Approve / Reject) =====
function renderPendingItems() {
    let list = document.getElementById("pendingItemsList");
    if (!list) return;

    let html = "";
    pendingItems.forEach(item => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${item.name}</h3>
                    <span class="badge badge-pending">Pending</span>
                </div>
                <p>👤 Reported by ${item.reportedBy}</p>
                <p>📍 ${item.location}</p>
                <p>📅 ${item.date}</p>
                <div class="dash-card-actions">
                    <button class="btn" onclick="approveItem(${item.id})">Approve</button>
                    <button class="btn outline" onclick="rejectItem(${item.id})">Reject</button>
                </div>
            </div>`;
    });

    list.innerHTML = html || "<p>No items awaiting review.</p>";
}

// ===== Render Approved Items =====
function renderApprovedItems() {
    let list = document.getElementById("approvedItemsList");
    if (!list) return;

    let html = "";
    approvedItems.forEach(item => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${item.name}</h3>
                    <span class="badge badge-approved">Approved</span>
                </div>
                <p>📍 ${item.location}</p>
                <p>📅 ${item.date}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>No approved items yet.</p>";
}

// ===== Render Claim Requests (with Approve / Reject) =====
function renderClaimRequests() {
    let list = document.getElementById("claimRequestsList");
    if (!list) return;

    let html = "";
    claimRequests.forEach(claim => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${claim.item}</h3>
                    <span class="badge badge-pending">Pending</span>
                </div>
                <p>👤 Claimed by ${claim.claimant}</p>
                <p>📅 Requested on ${claim.date}</p>
                <div class="dash-card-actions">
                    <button class="btn" onclick="approveClaim(${claim.id})">Approve</button>
                    <button class="btn outline" onclick="rejectClaim(${claim.id})">Reject</button>
                </div>
            </div>`;
    });

    list.innerHTML = html || "<p>No claim requests right now.</p>";
}

// ===== Render Registered Users Table =====
function renderUsersTable() {
    let tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    let html = "";
    registeredUsers.forEach(user => {
        html += `
            <tr>
                <td>${user.name}</td>
                <td><span class="badge">${user.role}</span></td>
                <td>${user.email}</td>
                <td>${user.joined}</td>
            </tr>`;
    });

    tbody.innerHTML = html;
}

// ===== Actions (placeholder until backend exists) =====
function approveItem(id) {
    let item = pendingItems.find(i => i.id === id);
    if (!item) return;

    alert(`"${item.name}" approved! (Backend not connected yet)`);
    pendingItems = pendingItems.filter(i => i.id !== id);
    approvedItems.push({ id: item.id, name: item.name, location: item.location, date: item.date });

    renderPendingItems();
    renderApprovedItems();
    renderAdminOverview();
}

function rejectItem(id) {
    let item = pendingItems.find(i => i.id === id);
    if (!item) return;

    alert(`"${item.name}" rejected. (Backend not connected yet)`);
    pendingItems = pendingItems.filter(i => i.id !== id);

    renderPendingItems();
    renderAdminOverview();
}

function approveClaim(id) {
    let claim = claimRequests.find(c => c.id === id);
    if (!claim) return;

    alert(`Claim for "${claim.item}" approved! (Backend not connected yet)`);
    claimRequests = claimRequests.filter(c => c.id !== id);

    renderClaimRequests();
    renderAdminOverview();
}

function rejectClaim(id) {
    let claim = claimRequests.find(c => c.id === id);
    if (!claim) return;

    alert(`Claim for "${claim.item}" rejected. (Backend not connected yet)`);
    claimRequests = claimRequests.filter(c => c.id !== id);

    renderClaimRequests();
    renderAdminOverview();
}

// ===== Init =====
renderAdminOverview();
renderPendingItems();
renderApprovedItems();
renderClaimRequests();
renderUsersTable();
