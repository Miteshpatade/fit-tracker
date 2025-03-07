const jwt = require('jsonwebtoken');

function checkAdminToken(req, res, next) {
    const adminAuthToken = req.cookies.adminAuthToken;

    if (!adminAuthToken) {
        return res.status(401).json({ message: 'Admin authentication failed: No adminAuthToken provided', ok: false });
    }

    jwt.verify(adminAuthToken, process.env.JWT_ADMIN_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Admin authentication failed: Invalid or expired adminAuthToken', ok: false });
        } else {
            // Store the entire decoded payload instead of just the ID
            req.admin = decoded;
            next();  // Continue with the request
        }
    });
}

module.exports = checkAdminToken;
