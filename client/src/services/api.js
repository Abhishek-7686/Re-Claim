// ===== This file is the ONLY place that talks to our backend. =====
// Every component imports functions from here instead of calling
// fetch() directly. Keeps all our API calls in one easy-to-find spot.

// Change this if your backend runs on a different address
export const API_BASE = "http://localhost:5000/api";
export const UPLOADS_BASE = "http://localhost:5000/uploads";

// Turns a stored image filename into a full URL the browser can load
export function imageUrl(fileName) {
    return `${UPLOADS_BASE}/${fileName}`;
}

// A small wrapper around fetch() that adds the login token, sends JSON
// (or FormData for image uploads), and turns error responses into a
// normal JavaScript Error so components can just use try/catch.
async function apiRequest(path, { method = "GET", body, token } = {}) {
    let headers = {};

    // Only set JSON content-type when we're NOT sending a file.
    // FormData sets its own content-type with the correct boundary.
    if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    let response = await fetch(API_BASE + path, {
        method,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    let data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;
}

// ===== Auth =====
export function registerStudent(formData) {
    return apiRequest("/auth/register/student", { method: "POST", body: formData });
}

export function registerAdmin(formData) {
    return apiRequest("/auth/register/admin", { method: "POST", body: formData });
}

export function loginRequest(credentials) {
    return apiRequest("/auth/login", { method: "POST", body: credentials });
}

export function getMyProfile(token) {
    return apiRequest("/auth/me", { token });
}

export function forgotPassword(data) {
    return apiRequest("/auth/forgot-password", { method: "POST", body: data });
}

// ===== Items (student side) =====
export function getFoundItems() {
    return apiRequest("/items/found");
}

export function getItemById(id, token) {
    return apiRequest("/items/" + id, { token });
}

export function getMyReportedItems(token) {
    return apiRequest("/items/mine", { token });
}

export function reportFoundItem(formData, token) {
    return apiRequest("/items", { method: "POST", body: formData, token });
}

// ===== Claims (student side) =====
export function submitClaim(itemId, claimDetails, token) {
    return apiRequest("/claims", { method: "POST", body: { itemId, claimDetails }, token });
}

export function getMyClaims(token) {
    return apiRequest("/claims/mine", { token });
}

// ===== Admin =====
export function getAdminStats(token) {
    return apiRequest("/admin/stats", { token });
}

export function getPendingItems(token) {
    return apiRequest("/admin/items/pending", { token });
}

export function getApprovedItems(token) {
    return apiRequest("/admin/items/approved", { token });
}

export function approveItem(id, token) {
    return apiRequest(`/admin/items/${id}/approve`, { method: "PUT", token });
}

export function rejectItem(id, token) {
    return apiRequest(`/admin/items/${id}/reject`, { method: "PUT", token });
}

export function getAllClaims(token) {
    return apiRequest("/admin/claims", { token });
}

export function approveClaim(id, token) {
    return apiRequest(`/admin/claims/${id}/approve`, { method: "PUT", token });
}

export function rejectClaim(id, token) {
    return apiRequest(`/admin/claims/${id}/reject`, { method: "PUT", token });
}

export function getAllUsers(token) {
    return apiRequest("/admin/users", { token });
}
