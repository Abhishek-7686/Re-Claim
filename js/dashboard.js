// ===== Placeholder Data (will come from backend later) =====
const reportedItems = [
    { name: "Blue Water Bottle", location: "Library, 2nd Floor", date: "2026-08-20", status: "Approved" },
    { name: "Black Umbrella", location: "Canteen", date: "2026-08-25", status: "Pending" },
    { name: "USB Drive (16GB)", location: "Computer Lab 3", date: "2026-08-28", status: "Claimed" },
];

const browseItems = [
    { name: "Grey Backpack", category: "Bags", location: "Main Gate", date: "2026-08-27" },
    { name: "Scientific Calculator", category: "Electronics", location: "Exam Hall B", date: "2026-08-26" },
    { name: "Silver Wristwatch", category: "Accessories", location: "Sports Ground", date: "2026-08-24" },
    { name: "Chemistry Textbook", category: "Books", location: "Library, 1st Floor", date: "2026-08-22" },
];

const myClaims = [
    { name: "USB Drive (16GB)", claimedOn: "2026-08-29", status: "Approved" },
    { name: "ID Card Holder", claimedOn: "2026-08-30", status: "Pending Review" },
];

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
    if (status === "Approved") return "badge badge-approved";
    if (status === "Pending" || status === "Pending Review") return "badge badge-pending";
    if (status === "Claimed") return "badge badge-claimed";
    return "badge";
}

// ===== Render Overview Stats =====
function renderOverview() {
    let statReported = document.getElementById("statReported");
    if (!statReported) return;

    document.getElementById("statReported").textContent = reportedItems.length;
    document.getElementById("statApproved").textContent =
        reportedItems.filter(i => i.status === "Approved" || i.status === "Claimed").length;
    document.getElementById("statClaims").textContent = myClaims.length;
    document.getElementById("statResolved").textContent =
        reportedItems.filter(i => i.status === "Claimed").length;

    let activityList = document.getElementById("recentActivityList");
    let activityHTML = "";

    reportedItems.slice(0, 2).forEach(item => {
        activityHTML += `
            <div class="activity-row">
                <span>You reported <strong>${item.name}</strong></span>
                <span class="${statusBadgeClass(item.status)}">${item.status}</span>
            </div>`;
    });

    myClaims.slice(0, 2).forEach(claim => {
        activityHTML += `
            <div class="activity-row">
                <span>You claimed <strong>${claim.name}</strong></span>
                <span class="${statusBadgeClass(claim.status)}">${claim.status}</span>
            </div>`;
    });

    activityList.innerHTML = activityHTML;
}

// ===== Render Reported Items =====
function renderReportedItems() {
    let list = document.getElementById("reportedItemsList");
    if (!list) return;

    let html = "";
    reportedItems.forEach(item => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${item.name}</h3>
                    <span class="${statusBadgeClass(item.status)}">${item.status}</span>
                </div>
                <p>📍 ${item.location}</p>
                <p>📅 Reported on ${item.date}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>You haven't reported any items yet.</p>";
}

// ===== Render Browse Items (with search) =====
function renderBrowseItems(filter = "") {
    let list = document.getElementById("browseItemsList");
    if (!list) return;

    let filtered = browseItems.filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
    );

    let html = "";
    filtered.forEach(item => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${item.name}</h3>
                    <span class="badge">${item.category}</span>
                </div>
                <p>📍 ${item.location}</p>
                <p>📅 Found on ${item.date}</p>
                <button class="btn full-width" onclick="alert('Claim request sent for ${item.name}! (Backend not connected yet)')">Claim This Item</button>
            </div>`;
    });

    list.innerHTML = html || "<p>No items match your search.</p>";
}

// ===== Render My Claims =====
function renderClaims() {
    let list = document.getElementById("claimsList");
    if (!list) return;

    let html = "";
    myClaims.forEach(claim => {
        html += `
            <div class="dash-card">
                <div class="dash-card-top">
                    <h3>${claim.name}</h3>
                    <span class="${statusBadgeClass(claim.status)}">${claim.status}</span>
                </div>
                <p>📅 Claimed on ${claim.claimedOn}</p>
            </div>`;
    });

    list.innerHTML = html || "<p>You haven't claimed any items yet.</p>";
}

// ===== Search Handler =====
let browseSearch = document.getElementById("browseSearch");
if (browseSearch) {
    browseSearch.addEventListener("input", function () {
        renderBrowseItems(browseSearch.value);
    });
}

// ===== Init =====
renderOverview();
renderReportedItems();
renderBrowseItems();
renderClaims();
