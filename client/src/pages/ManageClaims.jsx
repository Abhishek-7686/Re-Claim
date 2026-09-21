import { useEffect, useState } from "react";
import { getAllClaims, approveClaim, rejectClaim } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { formatDate } from "../utils";

function ManageClaims() {
    const { token } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    function loadClaims() {
        setLoading(true);
        getAllClaims(token)
            .then(setClaims)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }

    useEffect(loadClaims, [token]);

    function handleApprove(id) {
        approveClaim(id, token)
            .then((data) => {
                alert(data.message);
                loadClaims();
            })
            .catch((error) => alert(error.message));
    }

    function handleReject(id) {
        rejectClaim(id, token)
            .then((data) => {
                alert(data.message);
                loadClaims();
            })
            .catch((error) => alert(error.message));
    }

    return (
        <DashboardLayout
            title="Admin Dashboard"
            subtitle="Students who have requested to claim an item. Verify before approving."
        >
            <div className="section-title dash-title">
                <h2>Claim Requests</h2>
                <p>Students who have requested to claim an item. Verify before approving.</p>
            </div>

            {loading && <p>Loading...</p>}
            {!loading && claims.length === 0 && <p>No claim requests right now.</p>}

            <div className="item-grid">
                {claims.map((claim) => (
                    <div className="dash-card" key={claim._id}>
                        <div className="dash-card-top">
                            <h3>{claim.item ? claim.item.itemName : "Item"}</h3>
                            <span className="badge badge-pending">Pending</span>
                        </div>
                        <p>👤 Claimed by {claim.student ? claim.student.name : "Unknown"}</p>
                        <p>📅 Requested on {formatDate(claim.createdAt)}</p>
                        <p>📝 "{claim.claimDetails}"</p>
                        <div className="dash-card-actions">
                            <button className="btn" onClick={() => handleApprove(claim._id)}>Approve</button>
                            <button className="btn outline" onClick={() => handleReject(claim._id)}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default ManageClaims;
