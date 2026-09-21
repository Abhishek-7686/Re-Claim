// This middleware makes sure only users with the right role can continue.
// Use it like: adminOnly  OR  studentOnly
// Must be used AFTER authMiddleware, because it needs req.user to exist.

function adminOnly(req, res, next) {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
}

function studentOnly(req, res, next) {
    if (req.user && req.user.role === "student") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Students only." });
    }
}

module.exports = { adminOnly, studentOnly };
