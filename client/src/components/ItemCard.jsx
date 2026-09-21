import { Link } from "react-router-dom";
import { imageUrl } from "../services/api";
import { formatDate, statusBadgeClass, statusLabel } from "../utils";

// A single found-item card, reused on Found Items, My Reports,
// Pending Items and the dashboards.
//
// Props:
//   item          - the item object from the backend
//   linkToDetails - if true, the title links to /item/:id
//   actions       - optional JSX (buttons) rendered at the bottom, e.g. Approve/Reject

function ItemCard({ item, linkToDetails = false, actions = null }) {
    return (
        <div className="dash-card">
            <img className="item-image-preview" src={imageUrl(item.image)} alt={item.itemName} />

            <div className="dash-card-top">
                <h3>
                    {linkToDetails ? (
                        <Link to={`/item/${item._id}`}>{item.itemName}</Link>
                    ) : (
                        item.itemName
                    )}
                </h3>
                <span className={statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
            </div>

            <p>📍 {item.locationFound}</p>
            <p>📅 {formatDate(item.dateFound)}</p>

            {item.reportedBy?.name && <p>👤 Reported by {item.reportedBy.name}</p>}

            {actions && <div className="dash-card-actions">{actions}</div>}
        </div>
    );
}

export default ItemCard;
