import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

const emptyForm = {
    email: "",
    idNumber: "",
    newPassword: "",
    confirmNewPassword: "",
};

function ForgotPassword() {
    const [role, setRole] = useState("student"); // "student" or "admin"
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function updateField(field, value) {
        setForm({ ...form, [field]: value });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (form.newPassword !== form.confirmNewPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);

        forgotPassword({ ...form, role })
            .then((data) => {
                alert(data.message);
                navigate("/login");
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
                    <h2>Reset Your Password</h2>
                    <p className="auth-subtitle">
                        Since ReClaim doesn't send reset emails, verify your identity with your
                        {role === "student" ? " Student ID" : " Staff ID"} instead.
                    </p>

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
                            <label>{role === "admin" ? "Official Email" : "College Email"}</label>
                            <input
                                type="email"
                                placeholder="you@college.edu"
                                value={form.email}
                                onChange={(e) => updateField("email", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{role === "admin" ? "Staff ID" : "Student ID"}</label>
                            <input
                                type="text"
                                placeholder={role === "admin" ? "e.g. STAFF001" : "e.g. 23CSE1045"}
                                value={form.idNumber}
                                onChange={(e) => updateField("idNumber", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Create a new password"
                                value={form.newPassword}
                                onChange={(e) => updateField("newPassword", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter your new password"
                                value={form.confirmNewPassword}
                                onChange={(e) => updateField("confirmNewPassword", e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn full-width" disabled={loading}>
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Remembered your password? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
