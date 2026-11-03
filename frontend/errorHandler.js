// SENTRIXA - Central Error Handler

function errorHandler(err, req, res, next) {
    console.error("SENTRIXA Error:", err);

    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        message: statusCode === 500
            ? "Internal Server Error"
            : err.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    };

    if (process.env.NODE_ENV === "development") {
        response.error = err.message;
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
}

module.exports = errorHandler;