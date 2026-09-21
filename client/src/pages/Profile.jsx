import { useEffect, useState } from "react";
import { getMyProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";

function Profile() {
    const { token, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyProfile(token)
            .then(setProfile)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <DashboardLayout
            title={user?.role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
            subtitle="Your account details."
        >
            <div className="section-title dash-title">
                <h2>My Profile</h2>
                <p>Your account details.</p>
            </div>

            {loading && <p>Loading...</p>}

            {!loading && profile && (
                <div className="auth-card dash-profile-card">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={profile.name || ""} disabled />
                    </div>

                    {profile.role === "student" ? (
                        <>
                            <div className="form-group">
                                <label>Student ID</label>
                                <input type="text" value={profile.studentId || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" value={profile.email || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Department / Year</label>
                                <input
                                    type="text"
                                    value={`${profile.department || ""}${profile.year ? " - Year " + profile.year : ""}`}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" value={profile.phone || ""} disabled />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Staff ID</label>
                                <input type="text" value={profile.staffId || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" value={profile.email || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input type="text" value={profile.department || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" value={profile.phone || ""} disabled />
                            </div>
                            <div className="form-group">
                                <label>Office</label>
                                <input type="text" value={profile.office || ""} disabled />
                            </div>
                        </>
                    )}

                    <button className="btn full-width" disabled>Edit Profile (Coming Soon)</button>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Profile;
