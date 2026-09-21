import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerStudent, registerAdmin } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyStudent = {
    name: "",
    email: "",
    studentId: "",
    department: "",
    year: "",
    phone: "",
    password: "",
    confirmPassword: "",
};

const emptyAdmin = {
    name: "",
    email: "",
    staffId: "",
    department: "",
    phone: "",
    adminKey: "",
    password: "",
    confirmPassword: "",
};

function Register() {
    const [role, setRole] = useState("student");
    const [studentData, setStudentData] = useState(emptyStudent);
    const [adminData, setAdminData] = useState(emptyAdmin);
    const [loading, setLoading] = useState(false);

    const { loginWithSession } = useAuth();
    const navigate = useNavigate();

    function updateStudentField(field, value) {
        setStudentData({ ...studentData, [field]: value });
    }

    function updateAdminField(field, value) {
        setAdminData({ ...adminData, [field]: value });
    }

    function handleStudentSubmit(event) {
        event.preventDefault();

        if (studentData.password !== studentData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        registerStudent(studentData)
            .then((data) => {
                loginWithSession(data.token, data.user);
                alert("Account created! Welcome to ReClaim.");
                navigate("/dashboard");
            })
            .catch((error) => {
                alert(error.message);
                setLoading(false);
            });
    }

    function handleAdminSubmit(event) {
        event.preventDefault();

        if (adminData.password !== adminData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        registerAdmin(adminData)
            .then((data) => {
                loginWithSession(data.token, data.user);
                alert("Admin account created!");
                navigate("/admin-dashboard");
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
                    <h2>Create an Account</h2>
                    <p className="auth-subtitle">Join ReClaim to report and claim items.</p>

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

                    {role === "student" ? (
                        <form onSubmit={handleStudentSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={studentData.name}
                                    onChange={(e) => updateStudentField("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>College Email</label>
                                <input
                                    type="email"
                                    placeholder="you@college.edu"
                                    value={studentData.email}
                                    onChange={(e) => updateStudentField("email", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Student ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 23CSE1045"
                                    value={studentData.studentId}
                                    onChange={(e) => updateStudentField("studentId", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CSE"
                                    value={studentData.department}
                                    onChange={(e) => updateStudentField("department", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    placeholder="e.g. 3"
                                    value={studentData.year}
                                    onChange={(e) => updateStudentField("year", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Your phone number"
                                    value={studentData.phone}
                                    onChange={(e) => updateStudentField("phone", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={studentData.password}
                                    onChange={(e) => updateStudentField("password", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={studentData.confirmPassword}
                                    onChange={(e) => updateStudentField("confirmPassword", e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn full-width" disabled={loading}>
                                {loading ? "Creating account..." : "Register as Student"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={adminData.name}
                                    onChange={(e) => updateAdminField("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Official Email</label>
                                <input
                                    type="email"
                                    placeholder="you@college.edu"
                                    value={adminData.email}
                                    onChange={(e) => updateAdminField("email", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Staff ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g. STAFF001"
                                    value={adminData.staffId}
                                    onChange={(e) => updateAdminField("staffId", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Administration"
                                    value={adminData.department}
                                    onChange={(e) => updateAdminField("department", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Your phone number"
                                    value={adminData.phone}
                                    onChange={(e) => updateAdminField("phone", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Admin Registration Key</label>
                                <input
                                    type="text"
                                    placeholder="Provided by college"
                                    value={adminData.adminKey}
                                    onChange={(e) => updateAdminField("adminKey", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={adminData.password}
                                    onChange={(e) => updateAdminField("password", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={adminData.confirmPassword}
                                    onChange={(e) => updateAdminField("confirmPassword", e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn full-width" disabled={loading}>
                                {loading ? "Creating account..." : "Register as Admin"}
                            </button>
                        </form>
                    )}

                    <p className="auth-footer">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Register;
