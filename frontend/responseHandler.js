// SENTRIXA - Standard API Response Handler

const responseHandler = {

    success(res, message, data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    },

    created(res, message, data = null) {
        return this.success(res, message, data, 201);
    },

    error(res, message, statusCode = 400, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    },

    unauthorized(res, message = "Unauthorized access") {
        return this.error(res, message, 401);
    },

    forbidden(res, message = "Access forbidden") {
        return this.error(res, message, 403);
    },

    notFound(res, message = "Resource not found") {
        return this.error(res, message, 404);
    },

    serverError(res) {
        return this.error(
            res,
            "Internal server error",
            500
        );
    }

};

module.exports = responseHandler;