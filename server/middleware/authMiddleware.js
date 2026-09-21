// This middleware checks that a valid login token (JWT) was sent with the
// request. If it's valid, we attach the user's info to req.user so that
// the next function (the controller) knows who is making the request.

const jwt = require("jsonwebtoken");

function protect(req, res, next) {
    let authHeader = req.headers.authorization; // looks like: "Bearer eyJhbGciOi..."

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Please login." });
    }

    let token = authHeader.split(" ")[1];

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded contains whatever we put in when we signed the token
        req.user = decoded; // { id, role, name }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token. Please login again." });
    }
}

module.exports = protect;
