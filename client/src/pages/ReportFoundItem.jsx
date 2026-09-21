import { useState } from "react";
import { Link } from "react-router-dom";
import { reportFoundItem } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
    itemName: "",
    category: "",
    description: "",
    color: "",
    locationFound: "",
    dateFound: "",
    additionalDetails: "",
};

function ReportFoundItem() {
    const { token } = useAuth();
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null); // set after a successful submit

    function updateField(field, value) {
        setForm({ ...form, [field]: value });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!imageFile) {
            alert("Please upload an image of the item");
            return;
        }

        setSubmitting(true);

        // We use FormData here (instead of JSON) because we are also
        // sending an image file along with the text fields.
        let formData = new FormData();
        Object.keys(form).forEach((key) => formData.append(key, form[key]));
        formData.append("image", imageFile);

        reportFoundItem(formData, token)
            .then((data) => {
                setAdminInfo(data.admin);
            })
            .catch((error) => {
                alert(error.message);
                setSubmitting(false);
            });
    }

    return (
        <>
            <section className="dash-hero">
                <div className="container">
                    <h1>Report a Found Item</h1>
                    <p>Fill in the details below. Once submitted, you'll be shown which admin to hand the item over to.</p>
                </div>
            </section>

            <section className="section dash-section">
                <div className="container">
                    {!adminInfo ? (
                        <div className="auth-card" style={{ maxWidth: "650px", margin: "0 auto" }}>
                            <h2>Item Details</h2>
                            <p className="auth-subtitle">All fields marked * are required.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Item Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Black Wallet"
                                        value={form.itemName}
                                        onChange={(e) => updateField("itemName", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => updateField("category", e.target.value)}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Books">Books</option>
                                        <option value="Documents">Documents</option>
                                        <option value="Wallet">Wallet</option>
                                        <option value="Keys">Keys</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Describe the item in a few sentences"
                                        value={form.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Color (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Black"
                                        value={form.color}
                                        onChange={(e) => updateField("color", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location Found *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. College Library"
                                        value={form.locationFound}
                                        onChange={(e) => updateField("locationFound", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date Found *</label>
                                    <input
                                        type="date"
                                        value={form.dateFound}
                                        onChange={(e) => updateField("dateFound", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Item Image *</label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Additional Details (optional)</label>
                                    <textarea
                                        rows="2"
                                        placeholder="Anything else that might help identify the owner"
                                        value={form.additionalDetails}
                                        onChange={(e) => updateField("additionalDetails", e.target.value)}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn full-width" disabled={submitting}>
                                    {submitting ? "Submitting..." : "Submit Report"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="auth-card" style={{ maxWidth: "650px", margin: "0 auto" }}>
                            <h2>✅ Report Submitted Successfully</h2>
                            <p className="auth-subtitle">Please hand over the found item to the administrator below.</p>

                            <div className="admin-info-card">
                                {adminInfo.name ? (
                                    <>
                                        <h3>Hand the item to:</h3>
                                        <div className="admin-info-row"><span>Admin Name</span><span>{adminInfo.name}</span></div>
                                        <div className="admin-info-row"><span>Office</span><span>{adminInfo.office}</span></div>
                                        <div className="admin-info-row"><span>Location</span><span>{adminInfo.officeLocation}</span></div>
                                        <div className="admin-info-row"><span>Contact</span><span>{adminInfo.phone}</span></div>
                                        <div className="admin-info-row"><span>Office Hours</span><span>{adminInfo.officeHours}</span></div>
                                    </>
                                ) : (
                                    <p>No admin is registered yet. Please check back later or visit the Student Affairs Office directly.</p>
                                )}
                            </div>

                            <Link to="/dashboard" className="btn full-width" style={{ marginTop: "20px" }}>
                                Go to My Dashboard
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default ReportFoundItem;
