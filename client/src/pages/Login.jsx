import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [role, setRole] = useState("student"); // "student" or "admin"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);

        login(email, password, role)
            .then((user) => {
                navigate(user.role === "student" ? "/dashboard" : "/admin-dashboard");
            })
            .catch((error) => {
                alert(error.message);
                setLoading(false);
            });
    }

    return (
        <section className="auth-section">
            <div className="container">
                <div className="auth-card">
                    <h2>Login to ReClaim</h2>
                    <p className="auth-subtitle">Access your student or admin account.</p>

                    <div className="role-toggle">
                        <button
                            type="button"
                            className={`role-btn ${role === "student" ? "active" : ""}`}
                            onClick={() => setRole("student")}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === "admin" ? "active" : ""}`}
                            onClick={() => setRole("admin")}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn full-width" disabled={loading}>
                            {loading ? "Logging in..." : `Login as ${role === "admin" ? "Admin" : "Student"}`}
                        </button>
                    </form>

                    <p className="auth-footer">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </p>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;
