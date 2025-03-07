function errorHandler(err, req, res, next) {
    // 🔹 Only log error details in development mode
    if (process.env.NODE_ENV === "development") {
        console.error(err.stack);
    }

    if (res.headersSent) {
        return next(err);
    }

    console.log("🚨 ERROR MIDDLEWARE CALLED");

    res.status(err.statusCode || 500).json({
        ok: false,
        message: err.message || "Internal Server Error",
    });
}

module.exports = errorHandler;
