import { useEffect, useState } from "react";
import { getMyReportedItems } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import ItemCard from "../components/ItemCard";

function MyReports() {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyReportedItems(token)
            .then(setItems)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <DashboardLayout title="Student Dashboard" subtitle="Items you've reported as found.">
            <div className="section-title dash-title">
                <h2>My Reported Items</h2>
                <p>Items you've reported as found.</p>
            </div>

            {loading && <p>Loading...</p>}
            {!loading && items.length === 0 && <p>You haven't reported any items yet.</p>}

            <div className="item-grid">
                {items.map((item) => (
                    <ItemCard key={item._id} item={item} linkToDetails />
                ))}
            </div>
        </DashboardLayout>
    );
}

export default MyReports;
