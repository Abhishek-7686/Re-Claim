import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, submitClaim, approveItem, rejectItem, imageUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDate, statusBadgeClass, statusLabel } from "../utils";

function ItemDetails() {
    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claimDetails, setClaimDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function loadItem() {
        getItemById(id, token)
            .then(setItem)
            .catch((error) => alert(error.message))
            .finally(() => setLoading(false));
    }

    useEffect(loadItem, [id]);

    function handleClaimSubmit(event) {
        event.preventDefault();
        if (!claimDetails.trim()) {
            alert("Please describe why this item belongs to you.");
            return;
        }

        setSubmitting(true);
        submitClaim(id, claimDetails, token)
            .then((data) => {
                alert(data.message);
                navigate("/my-claims");
            })
            .catch((error) => {
                alert(error.message);
                setSubmitting(false);
            });
    }

    function handleApprove() {
        approveItem(id, token)
            .then((data) => {
                alert(data.message);
                loadItem();
            })
            .catch((error) => alert(error.message));
    }

    function handleReject() {
        if (!confirm("Reject this report? This will remove it permanently.")) return;
        rejectItem(id, token)
            .then((data) => {
                alert(data.message);
                navigate("/admin/pending-items");
            })
            .catch((error) => alert(error.message));
    }

    if (loading) {
        return (
            <section className="section dash-section">
                <div className="container"><p>Loading item...</p></div>
            </section>
        );
    }

    if (!item) {
        return (
            <section className="section dash-section">
                <div className="container"><p>Item not found.</p></div>
            </section>
        );
    }

    return (
        <section className="section dash-section">
            <div className="container">
                <div className="auth-card" style={{ maxWidth: "650px", margin: "0 auto" }}>
                    <img
                        className="item-image-preview"
                        style={{ maxHeight: "260px" }}
                        src={imageUrl(item.image)}
                        alt={item.itemName}
                    />

                    <div className="dash-card-top">
                        <h2>{item.itemName}</h2>
                        <span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
                    </div>

                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                    {item.color && <p><strong>Color:</strong> {item.color}</p>}
                    <p><strong>Location Found:</strong> {item.locationFound}</p>
                    <p><strong>Date Found:</strong> {formatDate(item.dateFound)}</p>
                    {item.additionalDetails && (
                        <p><strong>Additional Details:</strong> {item.additionalDetails}</p>
                    )}
                    {item.reportedBy?.name && (
                        <p><strong>Reported By:</strong> {item.reportedBy.name}</p>
                    )}

                    {/* ===== Student: claim form, only if item is available ===== */}
                    {user?.role === "student" && item.status === "available" && (
                        <form onSubmit={handleClaimSubmit} style={{ marginTop: "20px" }}>
                            <div className="form-group">
                                <label>Why does this item belong to you?</label>
                                <textarea
                                    rows="3"
                                    placeholder="e.g. It's my black wallet, it has my college ID inside"
                                    value={claimDetails}
                                    onChange={(e) => setClaimDetails(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn full-width" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Claim"}
                            </button>
                        </form>
                    )}

                    {/* ===== Admin: approve / reject, only if item is pending ===== */}
                    {user?.role === "admin" && item.status === "pending" && (
                        <div className="dash-card-actions" style={{ marginTop: "20px" }}>
                            <button className="btn" onClick={handleApprove}>Approve (Item Received)</button>
                            <button className="btn outline" onClick={handleReject}>Reject</button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ItemDetails;
