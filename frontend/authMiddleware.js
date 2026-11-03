// SENTRIXA - Authentication Middleware

const tokenUtils = require("./tokenUtils");
const responseHandler = require("./responseHandler");

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return responseHandler.unauthorized(
                res,
                "Authentication token is required"
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return responseHandler.unauthorized(
                res,
                "Invalid authentication token"
            );
        }

        const decoded = tokenUtils.verifyToken(token);

        if (decoded.tokenType === "refresh") {
            return responseHandler.unauthorized(
                res,
                "Refresh token cannot be used for API access"
            );
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();

    } catch (error) {
        return responseHandler.unauthorized(
            res,
            "Invalid or expired authentication token"
        );
    }
}

module.exports = authMiddleware;