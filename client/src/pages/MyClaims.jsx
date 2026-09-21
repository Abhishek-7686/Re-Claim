import { useEffect, useState } from "react";
import { getMyClaims } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { formatDate, statusBadgeClass, statusLabel } from "../utils";

function MyClaims() {
    const { token } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyClaims(token)
            .then(setClaims)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <DashboardLayout title="Student Dashboard" subtitle="Items you've requested to claim, and their status.">
            <div className="section-title dash-title">
                <h2>My Claims</h2>
                <p>Items you've requested to claim, and their status.</p>
            </div>

            {loading && <p>Loading...</p>}
            {!loading && claims.length === 0 && <p>You haven't claimed any items yet.</p>}

            <div className="item-grid">
                {claims.map((claim) => (
                    <div className="dash-card" key={claim._id}>
                        <div className="dash-card-top">
                            <h3>{claim.item ? claim.item.itemName : "Item"}</h3>
                            <span className={statusBadgeClass(claim.status)}>{statusLabel(claim.status)}</span>
                        </div>
                        <p>📅 Requested on {formatDate(claim.createdAt)}</p>
                        <p>📝 {claim.claimDetails}</p>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default MyClaims;
