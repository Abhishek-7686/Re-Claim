import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFoundItems } from "../services/api";

function Home() {
    const [stats, setStats] = useState({ total: 0, available: 0, claimed: 0 });

    useEffect(() => {
        getFoundItems()
            .then((items) => {
                setStats({
                    total: items.length,
                    available: items.filter((i) => i.status === "available").length,
                    claimed: items.filter((i) => i.status === "claimed").length,
                });
            })
            .catch(() => {
                // Backend probably isn't running yet - just keep the stats at 0
                setStats({ total: 0, available: 0, claimed: 0 });
            });
    }, []);

    return (
        <>
            <section className="hero">
                <div className="container hero-content">
                    <div>
                        <h1>
                            Lost Something?
                            <br />
                            <span>Find It Here.</span>
                        </h1>
                        <p>
                            ReClaim is a simple college Lost & Found system. Report found
                            items and help students recover their belongings.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/report-item" className="btn">Report Found Item</Link>
                            <Link to="/found-items" className="btn outline">Browse Items</Link>
                        </div>

                        <div className="stats">
                            <div>
                                <h2>{stats.total}</h2>
                                <p>Items Found</p>
                            </div>
                            <div>
                                <h2>{stats.available}</h2>
                                <p>Available</p>
                            </div>
                            <div>
                                <h2>{stats.claimed}</h2>
                                <p>Claimed</p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-card">
                        <div className="icon">📦</div>
                        <h2>Lost & Found Made Easy</h2>
                        <p>Report. Hand Over. Approve. Claim.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>How ReClaim Works</h2>
                        <p>A simple process for managing lost and found items.</p>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <h3>1. Report</h3>
                            <p>Report a found item with its details and image.</p>
                        </div>
                        <div className="card">
                            <h3>2. Hand Over</h3>
                            <p>Hand the item over to the college administrator.</p>
                        </div>
                        <div className="card">
                            <h3>3. Approve</h3>
                            <p>The administrator verifies and approves the item.</p>
                        </div>
                        <div className="card">
                            <h3>4. Claim</h3>
                            <p>The owner can claim the item after verification.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <h2>Help Someone Find Their Lost Item</h2>
                    <p>Report a found item and make your campus more organized.</p>
                    <Link to="/report-item" className="btn white">Report Found Item</Link>
                </div>
            </section>
        </>
    );
}

export default Home;
