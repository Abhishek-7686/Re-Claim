import { useEffect, useState } from "react";
import { getPendingItems, approveItem, rejectItem } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import ItemCard from "../components/ItemCard";

function PendingItems() {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    function loadItems() {
        setLoading(true);
        getPendingItems(token)
            .then(setItems)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }

    useEffect(loadItems, [token]);

    function handleApprove(id) {
        approveItem(id, token)
            .then((data) => {
                alert(data.message);
                loadItems();
            })
            .catch((error) => alert(error.message));
    }

    function handleReject(id) {
        if (!confirm("Reject this report? This will remove it permanently.")) return;
        rejectItem(id, token)
            .then((data) => {
                alert(data.message);
                loadItems();
            })
            .catch((error) => alert(error.message));
    }

    return (
        <DashboardLayout
            title="Admin Dashboard"
            subtitle="Newly reported items waiting for review before going public."
        >
            <div className="section-title dash-title">
                <h2>Pending Items</h2>
                <p>Newly reported items waiting for review before going public.</p>
            </div>

            {loading && <p>Loading...</p>}
            {!loading && items.length === 0 && <p>No items awaiting review.</p>}

            <div className="item-grid">
                {items.map((item) => (
                    <ItemCard
                        key={item._id}
                        item={item}
                        linkToDetails
                        actions={
                            <>
                                <button className="btn" onClick={() => handleApprove(item._id)}>
                                    Approve (Item Received)
                                </button>
                                <button className="btn outline" onClick={() => handleReject(item._id)}>
                                    Reject
                                </button>
                            </>
                        }
                    />
                ))}
            </div>
        </DashboardLayout>
    );
}

export default PendingItems;
