import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// A shared sidebar + page shell, reused by every dashboard-style page
// (for both students and admins). Keeps the sidebar navigation the
// same on every page instead of copy-pasting it everywhere.
//
// Props: title, subtitle, children

const studentLinks = [
    { to: "/dashboard", label: "Overview", icon: "📊", end: true },
    { to: "/my-reports", label: "My Reported Items", icon: "📦" },
    { to: "/found-items", label: "Browse Items", icon: "🔍" },
    { to: "/my-claims", label: "My Claims", icon: "✅" },
    { to: "/profile", label: "Profile", icon: "👤" },
];

const adminLinks = [
    { to: "/admin-dashboard", label: "Overview", icon: "📊", end: true },
    { to: "/admin/pending-items", label: "Pending Items", icon: "📦" },
    { to: "/admin/manage-claims", label: "Manage Claims", icon: "✅" },
    { to: "/profile", label: "Profile", icon: "👤" },
];

function DashboardLayout({ title, subtitle, children }) {
    const { user } = useAuth();
    const links = user?.role === "admin" ? adminLinks : studentLinks;

    return (
        <>
            <section className="dash-hero">
                <div className="container">
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                </div>
            </section>

            <section className="section dash-section">
                <div className="container dash-layout">
                    <aside className="dash-sidebar">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) => "dash-nav-btn" + (isActive ? " active" : "")}
                            >
                                <span className="dash-icon">{link.icon}</span> {link.label}
                            </NavLink>
                        ))}

                        {user?.role === "student" && (
                            <Link to="/report-item" className="btn full-width dash-report-btn">
                                + Report Found Item
                            </Link>
                        )}
                    </aside>

                    <div className="dash-content">{children}</div>
                </div>
            </section>
        </>
    );
}

export default DashboardLayout;
