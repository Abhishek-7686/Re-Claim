// This middleware handles saving an uploaded item image to the
// "uploads" folder, and makes sure only real image files are accepted.

const multer = require("multer");
const path = require("path");

// Where to save the file, and what to name it
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: function (req, file, cb) {
        // Create a unique, safe file name so two uploads never overwrite each other
        // Example: item_1699999999999.jpg
        let uniqueName = "item_" + Date.now() + path.extname(file.originalname).toLowerCase();
        cb(null, uniqueName);
    },
});

// Only allow these image types (matches the project requirements)
const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];

function fileFilter(req, file, cb) {
    let ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, .png and .webp images are allowed"));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
