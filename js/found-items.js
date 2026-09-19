// ===== Items loaded from the backend =====
let foundItemsData = [];

function formatDate(dateString) {
    let d = new Date(dateString);
    return d.toLocaleDateString();
}

// ===== Render Items =====
function renderFoundItems() {
    let searchValue = document.getElementById("foundSearch").value.toLowerCase();
    let categoryValue = document.getElementById("categoryFilter").value;

    let filtered = foundItemsData.filter(item => {
        let matchesSearch = item.itemName.toLowerCase().includes(searchValue);
        let matchesCategory = categoryValue === "" || item.category === categoryValue;
        return matchesSearch && matchesCategory;
    });

    let list = document.getElementById("foundItemsList");
    let count = document.getElementById("resultsCount");

    count.textContent = filtered.length + " item(s) found";

    let html = "";
    filtered.forEach(item => {
        let isClaimed = item.status === "claimed";
        html += `
            <div class="dash-card">
                <img class="item-image-preview" src="${imageUrl(item.image)}" alt="${item.itemName}">
                <div class="dash-card-top">
                    <h3>${item.itemName}</h3>
                    <span class="badge">${item.category}</span>
                </div>
                <p>📍 ${item.locationFound}</p>
                <p>📅 Found on ${formatDate(item.dateFound)}</p>
                <span class="badge ${isClaimed ? 'badge-claimed' : 'badge-approved'}">
                    ${isClaimed ? 'Claimed' : 'Available'}
                </span>
                ${isClaimed
                    ? ""
                    : `<button class="btn full-width" onclick="promptLoginToClaim()">Claim This Item</button>`}
            </div>`;
    });

    list.innerHTML = html || "<p>No items match your search.</p>";
}

// ===== Prompt login before claiming =====
function promptLoginToClaim() {
    if (isLoggedIn()) {
        // Already logged in - send them to their dashboard to claim from there
        let user = getUser();
        window.location.href = user.role === "student" ? "dashboard.html" : "admin-dashboard.html";
        return;
    }

    if (confirm("You need to be logged in to claim an item. Go to login page?")) {
        window.location.href = "login.html";
    }
}

// ===== Event Listeners =====
let foundSearch = document.getElementById("foundSearch");
let categoryFilter = document.getElementById("categoryFilter");

if (foundSearch && categoryFilter) {
    foundSearch.addEventListener("input", renderFoundItems);
    categoryFilter.addEventListener("change", renderFoundItems);
}

// ===== Init: load real items from the backend =====
apiRequest("/items/found")
    .then(function (items) {
        foundItemsData = items;
        renderFoundItems();
    })
    .catch(function (error) {
        document.getElementById("foundItemsList").innerHTML =
            "<p>Could not load items. Is the backend server running?</p>";
        console.log(error.message);
    });
