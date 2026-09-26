import { Link } from "react-router-dom";

function About() {
    return (
        <>
            <section className="hero">
                <div className="container hero-content">
                    <div>
                        <h1>About<br /><span>ReClaim</span></h1>
                        <p>
                            ReClaim is a simple, student-built Lost &amp; Found system designed to help
                            our college community reconnect people with their belongings faster and
                            more reliably than a noisy notice board or a scattered WhatsApp group.
                        </p>
                    </div>

                    <div className="hero-card">
                        <div className="icon">🎓</div>
                        <h2>Built for Our Campus</h2>
                        <p>A student project solving a real, everyday problem.</p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Why We Built This</h2>
                        <p>Lost items on campus usually end up in a drawer, a WhatsApp group, or nowhere at all.</p>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <h3>The Problem</h3>
                            <p>Found items rarely reach their owners because there's no central, organized place to report or search for them.</p>
                        </div>

                        <div className="card">
                            <h3>Our Solution</h3>
                            <p>A single portal where anyone can report a found item, and owners can browse and claim what's theirs.</p>
                        </div>

                        <div className="card">
                            <h3>Verified Handovers</h3>
                            <p>Admins verify every item before it's listed, so claims are checked and genuine.</p>
                        </div>

                        <div className="card">
                            <h3>Open to Everyone</h3>
                            <p>Any student or staff member on campus can use ReClaim to report or recover items.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ background: "white" }}>
                <div className="container">
                    <div className="section-title">
                        <h2>How It Works</h2>
                        <p>The same simple flow, every time.</p>
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
                    <h2>Have Something to Report?</h2>
                    <p>Help a fellow student get their belongings back.</p>
                    <Link to="/report-item" className="btn white">Report Found Item</Link>
                </div>
            </section>
        </>
    );
}

export default About;
