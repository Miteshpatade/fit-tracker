const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;

    if (!authToken || !refreshToken) {
        return res.status(401).json({ message: 'Authentication failed: No authToken or refreshToken provided', ok: false });
    }

    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // 🔹 Auth token expired, check refresh token
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    return res.status(403).json({ message: 'Authentication failed: Both tokens are invalid', ok: false });
                } else {
                    // 🔹 Refresh token is valid, generate new tokens
                    const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
                    const newRefreshToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '10d' });

                    // 🔹 Set the new tokens as cookies
                    res.cookie('authToken', newAuthToken, { httpOnly: true, secure: false, sameSite: "Lax" });
                    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, sameSite: "Lax" });

                    // 🔹 Continue processing the request
                    req.user = refreshDecoded;
                    next();
                }
            });
        } else {
            // 🔹 Auth token is valid, continue
            req.user = decoded;
            next();
        }
    });
}

module.exports = checkAuth;
