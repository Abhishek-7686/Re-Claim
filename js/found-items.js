// ===== Placeholder Data (will come from backend later) =====
const foundItemsData = [
    { name: "Grey Backpack", category: "Bags", location: "Main Gate", date: "2026-08-27" },
    { name: "Scientific Calculator", category: "Electronics", location: "Exam Hall B", date: "2026-08-26" },
    { name: "Silver Wristwatch", category: "Accessories", location: "Sports Ground", date: "2026-08-24" },
    { name: "Chemistry Textbook", category: "Books", location: "Library, 1st Floor", date: "2026-08-22" },
    { name: "Black Wired Earphones", category: "Electronics", location: "Canteen", date: "2026-08-30" },
    { name: "Student ID Card", category: "Documents", location: "Admin Block", date: "2026-08-29" },
    { name: "Blue Water Bottle", category: "Other", location: "Library, 2nd Floor", date: "2026-08-20" },
    { name: "Leather Wallet", category: "Accessories", location: "Parking Area", date: "2026-08-19" },
];

// ===== Render Items =====
function renderFoundItems() {
    let searchValue = document.getElementById("foundSearch").value.toLowerCase();
    let categoryValue = document.getElementById("categoryFilter").value;

    let filtered = foundItemsData.filter(item => {
        let matchesSearch = item.name.toLowerCase().includes(searchValue);
        let matchesCategory = categoryValue === "" || item.category === categoryValue;
        return matchesSearch && matchesCategory;
    });

    let list = document.getElementById("foundItemsList");
    let count = document.getElementById("resultsCount");

    count.textContent = filtered.length + " item(s) found";

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
                <button class="btn full-width" onclick="promptLoginToClaim()">Claim This Item</button>
            </div>`;
    });

    list.innerHTML = html || "<p>No items match your search.</p>";
}

// ===== Prompt login before claiming =====
function promptLoginToClaim() {
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

// ===== Init =====
renderFoundItems();
