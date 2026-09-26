import { useEffect, useState } from "react";
import { getPublicAdminContact } from "../services/api";

function Contact() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPublicAdminContact()
            .then(setAdmin)
            .catch(() => setAdmin(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="section">
            <div className="container">
                <div className="section-title">
                    <h2>Contact Us</h2>
                    <p>Have a question, found an issue, or need help with a claim? Here's how to reach us.</p>
                </div>

                <div className="hero-card" style={{ maxWidth: "500px", margin: "0 auto" }}>
                    <div className="icon">📬</div>
                    <h2>Get in Touch</h2>
                    <p style={{ marginBottom: "20px" }}>
                        Reach the ReClaim admin team directly using the details below.
                    </p>

                    {loading && <p>Loading contact details...</p>}

                    {!loading && admin && (
                        <div className="admin-info-card" style={{ textAlign: "left" }}>
                            <div className="admin-info-row"><span>Admin Name</span><span>{admin.name}</span></div>
                            <div className="admin-info-row"><span>Email</span><span>{admin.email}</span></div>
                            <div className="admin-info-row"><span>Office</span><span>{admin.office}</span></div>
                            <div className="admin-info-row"><span>Location</span><span>{admin.officeLocation}</span></div>
                            <div className="admin-info-row"><span>Contact</span><span>{admin.phone}</span></div>
                            <div className="admin-info-row"><span>Office Hours</span><span>{admin.officeHours}</span></div>
                        </div>
                    )}

                    {!loading && !admin && (
                        <p>No admin is registered yet. Please check back later.</p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Contact;
