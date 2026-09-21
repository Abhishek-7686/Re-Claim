import { useEffect, useState } from "react";
import { getMyReportedItems, getMyClaims } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { statusBadgeClass, statusLabel } from "../utils";

function StudentDashboard() {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getMyReportedItems(token), getMyClaims(token)])
            .then(([itemsData, claimsData]) => {
                setItems(itemsData);
                setClaims(claimsData);
            })
            .catch((error) => alert("Could not load your dashboard: " + error.message))
            .finally(() => setLoading(false));
    }, [token]);

    let approvedCount = items.filter((i) => i.status === "available" || i.status === "claimed").length;
    let resolvedCount = items.filter((i) => i.status === "claimed").length;

    return (
        <DashboardLayout
            title="Student Dashboard"
            subtitle="Track items you've reported, browse found items, and manage your claims."
        >
            <div className="section-title dash-title">
                <h2>Overview</h2>
                <p>A quick summary of your ReClaim activity.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h2>{items.length}</h2>
                    <p>Items Reported</p>
                </div>
                <div className="stat-card">
                    <h2>{approvedCount}</h2>
                    <p>Approved Items</p>
                </div>
                <div className="stat-card">
                    <h2>{claims.length}</h2>
                    <p>Claims Submitted</p>
                </div>
                <div className="stat-card">
                    <h2>{resolvedCount}</h2>
                    <p>Items Resolved</p>
                </div>
            </div>

            <div className="section-title dash-title" style={{ marginTop: "40px" }}>
                <h2>Recent Activity</h2>
                <p>Your latest reports and claims.</p>
            </div>

            <div className="activity-list">
                {loading && <p>Loading...</p>}

                {!loading && items.length === 0 && claims.length === 0 && (
                    <p>No activity yet. Report or browse an item to get started!</p>
                )}

                {items.slice(0, 3).map((item) => (
                    <div className="activity-row" key={item._id}>
                        <span>You reported <strong>{item.itemName}</strong></span>
                        <span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
                    </div>
                ))}

                {claims.slice(0, 3).map((claim) => (
                    <div className="activity-row" key={claim._id}>
                        <span>You claimed <strong>{claim.item ? claim.item.itemName : "an item"}</strong></span>
                        <span className={statusBadgeClass(claim.status)}>{statusLabel(claim.status)}</span>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;
