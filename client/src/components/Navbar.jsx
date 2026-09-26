import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { isLoggedIn, user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    // Where "Dashboard" should point to, based on the logged-in role
    let dashboardLink = user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    Re<span>Claim</span>
                </Link>

                <div className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <Link to="/">Home</Link>
                    <Link to="/found-items">Found Items</Link>
                    <Link to="/about">About</Link>
                    {isLoggedIn && (
                        <Link to={dashboardLink}>Dashboard</Link>
                    )}
                </div>

                <div className="nav-buttons">
                    {isLoggedIn ? (
                        <>
                            <span className="welcome-text">Hi, {user?.name} 👋</span>
                            <a href="#" className="btn outline" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                Logout
                            </a>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn outline">Login</Link>
                            <Link to="/register" className="btn">Register</Link>
                        </>
                    )}
                    <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
