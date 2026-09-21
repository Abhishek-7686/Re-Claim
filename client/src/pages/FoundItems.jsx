import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getFoundItems } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ItemCard from "../components/ItemCard";

function FoundItems() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getFoundItems()
            .then(setItems)
            .catch((error) => console.log(error.message))
            .finally(() => setLoading(false));
    }, []);

    let filtered = items.filter((item) => {
        let matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
        let matchesCategory = category === "" || item.category === category;
        return matchesSearch && matchesCategory;
    });

    // Clicking "View / Claim" on a card just takes the person to the
    // item's details page. If they're not logged in yet, ItemDetails
    // itself is a protected route, so they'll be sent to Login first.
    function handleCardClick(item) {
        if (!isLoggedIn) {
            if (confirm("You need to be logged in to claim an item. Go to login page?")) {
                navigate("/login");
            }
            return;
        }
        navigate(`/item/${item._id}`);
    }

    return (
        <>
            <section className="dash-hero">
                <div className="container">
                    <h1>Found Items</h1>
                    <p>Browse items reported and approved by the ReClaim team. Found something of yours? Log in to claim it.</p>
                </div>
            </section>

            <section className="section dash-section">
                <div className="container">
                    <div className="found-filters">
                        <input
                            type="text"
                            placeholder="Search by item name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            <option value="Bags">Bags</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Books">Books</option>
                            <option value="Documents">Documents</option>
                            <option value="Wallet">Wallet</option>
                            <option value="Keys">Keys</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <p className="results-count">{loading ? "Loading..." : `${filtered.length} item(s) found`}</p>

                    <div className="item-grid">
                        {filtered.map((item) => (
                            <ItemCard
                                key={item._id}
                                item={item}
                                actions={
                                    item.status === "available" && (
                                        <button className="btn full-width" onClick={() => handleCardClick(item)}>
                                            {isLoggedIn && user?.role === "student" ? "View / Claim" : "View Details"}
                                        </button>
                                    )
                                }
                            />
                        ))}
                    </div>

                    {!loading && filtered.length === 0 && <p>No items match your search.</p>}
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <h2>Found Something on Campus?</h2>
                    <p>Help a fellow student get their belongings back — report it in a few minutes.</p>
                    <Link to="/report-item" className="btn white">Report Found Item</Link>
                </div>
            </section>
        </>
    );
}

export default FoundItems;
