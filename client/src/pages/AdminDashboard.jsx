import { useEffect, useState } from "react";
import { getAdminStats, getPendingItems, getApprovedItems, getAllClaims, getAllUsers } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import ItemCard from "../components/ItemCard";
import { formatDate } from "../utils";

function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [pendingPreview, setPendingPreview] = useState([]);
    const [claimsPreview, setClaimsPreview] = useState([]);
    const [approvedItems, setApprovedItems] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAdminStats(token),
            getPendingItems(token),
            getAllClaims(token),
            getApprovedItems(token),
            getAllUsers(token),
        ])
            .then(([statsData, pendingData, claimsData, approvedData, usersData]) => {
                setStats(statsData);
                setPendingPreview(pendingData);
                setClaimsPreview(claimsData);
                setApprovedItems(approvedData);
                setUsers(usersData);
            })
            .catch((error) => alert("Could not load the admin dashboard: " + error.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <DashboardLayout
            title="Admin Dashboard"
            subtitle="Review reported items, approve listings, and verify ownership claims."
        >
            <div className="section-title dash-title">
                <h2>Overview</h2>
                <p>Snapshot of Lost &amp; Found activity across campus.</p>
            </div>

            {loading && <p>Loading...</p>}

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h2>{stats.pendingReports}</h2>
                        <p>Pending Review</p>
                    </div>
                    <div className="stat-card">
                        <h2>{stats.availableItems + stats.claimedItems}</h2>
                        <p>Approved Items</p>
                    </div>
                    <div className="stat-card">
                        <h2>{stats.pendingClaims}</h2>
                        <p>Claim Requests</p>
                    </div>
                    <div className="stat-card">
                        <h2>{stats.totalUsers}</h2>
                        <p>Registered Users</p>
                    </div>
                </div>
            )}

            <div className="section-title dash-title" style={{ marginTop: "40px" }}>
                <h2>Recent Activity</h2>
                <p>Latest reports and claim requests needing attention.</p>
            </div>

            <div className="activity-list">
                {!loading && pendingPreview.length === 0 && claimsPreview.length === 0 && (
                    <p>No recent activity.</p>
                )}

                {pendingPreview.slice(0, 2).map((item) => (
                    <div className="activity-row" key={item._id}>
                        <span>
                            <strong>{item.reportedBy ? item.reportedBy.name : "A student"}</strong> reported "{item.itemName}"
                        </span>
                        <span className="badge badge-pending">Needs Review</span>
                    </div>
                ))}

                {claimsPreview.slice(0, 2).map((claim) => (
                    <div className="activity-row" key={claim._id}>
                        <span>
                            <strong>{claim.student ? claim.student.name : "A student"}</strong> requested to claim "
                            {claim.item ? claim.item.itemName : "an item"}"
                        </span>
                        <span className="badge badge-pending">Needs Verification</span>
                    </div>
                ))}
            </div>

            <div className="section-title dash-title" style={{ marginTop: "40px" }}>
                <h2>Approved Items</h2>
                <p>Items currently visible to students on the Found Items page.</p>
            </div>

            <div className="item-grid">
                {approvedItems.length === 0 && !loading && <p>No approved items yet.</p>}
                {approvedItems.map((item) => (
                    <ItemCard key={item._id} item={item} />
                ))}
            </div>

            <div className="section-title dash-title" style={{ marginTop: "40px" }}>
                <h2>Registered Users</h2>
                <p>Students and admins currently registered on ReClaim.</p>
            </div>

            <div className="table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td><span className="badge">{u.role === "admin" ? "Admin" : "Student"}</span></td>
                                <td>{u.email}</td>
                                <td>{formatDate(u.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;
