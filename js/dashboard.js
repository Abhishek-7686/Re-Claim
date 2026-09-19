// ===== Only logged-in students can see this page =====
let currentUser = requireRole("student");

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

// Data we load from the backend, kept here so search/filter can reuse it
let myReportedItems = [];
let myClaims = [];
let browseItems = [];

// ===== Tab Switching =====
function showTab(tabName) {
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

// ===== Status Badge Helper =====
function statusBadgeClass(status) {
    if (status === "available") return "badge badge-approved";
    if (status === "pending") return "badge badge-pending";
    if (status === "claimed") return "badge badge-claimed";
    if (status === "approved") return "badge badge-approved";
    if (status === "rejected") return "badge badge-pending";
    return "badge";
}

function statusLabel(status) {
    // Turns "available" into "Available", etc.
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(dateString) {
    let d = new Date(dateString);
    return d.toLocaleDateString();
}

// ===== Render Overview Stats =====
function renderOverview() {
    document.getElementById("statReported").textContent = myReportedItems.length;
    document.getElementById("statApproved").textContent =
        myReportedItems.filter(i => i.status === "available" || i.status === "claimed").length;
    document.getElementById("statClaims").textContent = myClaims.length;
    document.getElementById("statResolved").textContent =
        myReportedItems.filter(i => i.status === "claimed").length;

    let activityList = document.getElementById("recentActivityList");
    let activityHTML = "";

    myReportedItems.slice(0, 2).forEach(item => {
        activityHTML += `
            <div class="activity-row">
                <span>You reported <strong>${item.itemName}</strong></span>
                <span class="${statusBadgeClass(item.status)}">${statusLabel(item.status)}</span>
            </div>`;
    });

    myClaims.slice(0, 2).forEach(claim => {
        activityHTML += `
            <div class="activity-row">
                <span>You claimed <strong>${claim.item ? claim.item.itemName : "an item"}</strong></span>
                <span class="${statusBadgeClass(claim.status)}">${statusLabel(claim.status)}</span>
            </div>`;
    });

    activityList.innerHTML = activityHTML || "<p>No activity yet. Report or browse an item to get started!</p>";
}

// ===== Render Reported Items =====
function renderReportedItems() {
    let list = document.getElementById("reportedItemsList");

    let html = "";
    myReportedItems.forEach(item => {
        html += `
            <div class="dash-card">
                <img class="item-image-preview" src="${imageUrl(item.image)}" alt="${item.itemName}">
                <div class="dash-card-top">
                    <h3>${item.itemName}</h3>
                    <span class="${statusBadgeClass(item.status)}">${statusLabel(item.status)}</span>
                </div>
                <p>📍 ${item.locationFound}</p>
                <p>📅 Reported on ${formatDate(item.createdAt)}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>You haven't reported any items yet.</p>";
}

// ===== Render Browse Items (with search) =====
function renderBrowseItems(filter = "") {
    let list = document.getElementById("browseItemsList");

    let filtered = browseItems.filter(item =>
        item.itemName.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
    );

    let html = "";
    filtered.forEach(item => {
        html += `
            <div class="dash-card">
                <img class="item-image-preview" src="${imageUrl(item.image)}" alt="${item.itemName}">
                <div class="dash-card-top">
                    <h3>${item.itemName}</h3>
                    <span class="badge">${item.category}</span>
                </div>
                <p>📍 ${item.locationFound}</p>
                <p>📅 Found on ${formatDate(item.dateFound)}</p>
                <span class="${statusBadgeClass(item.status)}">${statusLabel(item.status)}</span>
                ${item.status === "available"
                    ? `<button class="btn full-width" onclick="claimItem('${item._id}', '${item.itemName.replace(/'/g, "")}')">Claim This Item</button>`
                    : ""}
            </div>`;
    });

    list.innerHTML = html || "<p>No items match your search.</p>";
}

// ===== Render My Claims =====
function renderClaims() {
    let list = document.getElementById("claimsList");

    let html = "";
    myClaims.forEach(claim => {
        let itemName = claim.item ? claim.item.itemName : "Item";
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${itemName}</h3>
                    <span class="${statusBadgeClass(claim.status)}">${statusLabel(claim.status)}</span>
                </div>
                <p>📅 Requested on ${formatDate(claim.createdAt)}</p>
                <p>📝 ${claim.claimDetails}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>You haven't claimed any items yet.</p>";
}

// ===== Fill in the Profile tab with the real logged-in user's info =====
function renderProfile(user) {
    document.getElementById("profileName").value = user.name || "";
    document.getElementById("profileStudentId").value = user.studentId || "";
    document.getElementById("profileEmail").value = user.email || "";
    document.getElementById("profileDeptYear").value =
        (user.department || "") + (user.year ? " - Year " + user.year : "");
    document.getElementById("profilePhone").value = user.phone || "";
}

// ===== Claim an item =====
function claimItem(itemId, itemName) {
    let details = prompt(`Tell the admin why "${itemName}" belongs to you (e.g. a unique mark, what's inside it):`);
    if (!details) return; // student cancelled

    apiRequest("/claims", {
        method: "POST",
        body: JSON.stringify({ itemId, claimDetails: details }),
    })
        .then(function (data) {
            alert(data.message);
            loadDashboardData(); // refresh everything
        })
        .catch(function (error) {
            alert(error.message);
        });
}

// ===== Search Handler =====
let browseSearch = document.getElementById("browseSearch");
if (browseSearch) {
    browseSearch.addEventListener("input", function () {
        renderBrowseItems(browseSearch.value);
    });
}

// ===== Load everything from the backend, then render it =====
function loadDashboardData() {
    Promise.all([
        apiRequest("/items/mine"),
        apiRequest("/claims/mine"),
        apiRequest("/items/found"),
        apiRequest("/auth/me"),
    ])
        .then(function (results) {
            myReportedItems = results[0];
            myClaims = results[1];
            browseItems = results[2];
            let profile = results[3];

            renderOverview();
            renderReportedItems();
            renderBrowseItems();
            renderClaims();
            renderProfile(profile);
        })
        .catch(function (error) {
            alert("Could not load your dashboard: " + error.message);
        });
}

// ===== Init =====
loadDashboardData();
