const jwt = require('jsonwebtoken');

async function checkAuth(req, res, next) {
    try {
        const authToken = req.cookies.authToken;
        const refreshToken = req.cookies.refreshToken;

        if (!authToken || !refreshToken) {
            return res.status(401).json({ message: "Authentication failed: Missing tokens", ok: false });
        }

        // ✅ Verify Access Token First
        try {
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            return next(); // ✅ Token is valid → Proceed
        } catch (err) {
            console.warn("🔴 Access token expired, checking refresh token...");
        }

        // ✅ If Access Token Expired, Verify Refresh Token
        let refreshDecoded;
        try {
            refreshDecoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (refreshErr) {
            console.error("❌ Both tokens expired! User must re-login.");
            res.clearCookie("authToken");
            res.clearCookie("refreshToken");
            return res.status(403).json({ message: "Authentication failed: Please log in again", ok: false });
        }

        // ✅ Generate New Tokens
        const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: "10m" });
        const newRefreshToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: "10d" });

        // ✅ Set Cookies for New Tokens
        res.cookie("authToken", newAuthToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // ✅ Secure in production
            sameSite: "Lax",
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        req.user = refreshDecoded; // ✅ Attach user data
        next(); // ✅ Continue

    } catch (error) {
        console.error("❌ Unexpected Authentication Error:", error);
        res.status(500).json({ message: "Internal Server Error", ok: false });
    }
}

module.exports = checkAuth;
