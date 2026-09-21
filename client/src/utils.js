// Small helper functions used across several pages/components

export function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
}

export function statusBadgeClass(status) {
    if (status === "available" || status === "approved") return "badge badge-approved";
    if (status === "pending") return "badge badge-pending";
    if (status === "claimed") return "badge badge-claimed";
    if (status === "rejected") return "badge badge-pending";
    return "badge";
}

export function statusLabel(status) {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1);
}
