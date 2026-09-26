import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordResetOtp, verifyOtpAndResetPassword } from "../services/api";

function ForgotPassword() {
    const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
    const [role, setRole] = useState("student"); // "student" or "admin"
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ===== Step 1: Send the OTP =====
    function handleRequestOtp(event) {
        event.preventDefault();
        setLoading(true);

        requestPasswordResetOtp({ email, role })
            .then((data) => {
                alert(data.message);
                setStep(2);
            })
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }

    // ===== Step 2: Verify the OTP and set a new password =====
    function handleResetPassword(event) {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);

        verifyOtpAndResetPassword({ email, role, otp, newPassword, confirmNewPassword })
            .then((data) => {
                alert(data.message);
                navigate("/login");
            })
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }

    return (
        <section className="auth-section">
            <div className="container">
                <div className="auth-card">
                    {step === 1 ? (
                        <>
                            <h2>Forgot Password</h2>
                            <p className="auth-subtitle">
                                Enter your email and we'll send a one-time code (OTP) to reset your password.
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

                            <form onSubmit={handleRequestOtp}>
                                <div className="form-group">
                                    <label>{role === "admin" ? "Official Email" : "College Email"}</label>
                                    <input
                                        type="email"
                                        placeholder="you@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn full-width" disabled={loading}>
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2>Enter OTP</h2>
                            <p className="auth-subtitle">
                                We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
                            </p>

                            <form onSubmit={handleResetPassword}>
                                <div className="form-group">
                                    <label>OTP Code</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="6"
                                        placeholder="6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Create a new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Re-enter your new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn full-width" disabled={loading}>
                                    {loading ? "Verifying..." : "Reset Password"}
                                </button>
                            </form>

                            <p className="auth-footer">
                                <a href="#" onClick={(e) => { e.preventDefault(); setStep(1); }}>
                                    Didn't get a code? Try a different email
                                </a>
                            </p>
                        </>
                    )}

                    <p className="auth-footer">
                        Remembered your password? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ForgotPassword;
