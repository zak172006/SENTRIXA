// SENTRIXA - Permission Middleware

const responseHandler = require("./responseHandler");

function requirePermissions(...requiredPermissions) {

    return function (req, res, next) {

        if (!req.user) {
            return responseHandler.unauthorized(
                res,
                "Authentication required"
            );
        }

        const userPermissions = req.user.permissions || [];

        const hasFullAccess = userPermissions.includes("*");

        const hasAllPermissions = requiredPermissions.every(
            permission => userPermissions.includes(permission)
        );

        if (!hasFullAccess && !hasAllPermissions) {
            return responseHandler.forbidden(
                res,
                "Insufficient permissions"
            );
        }

        next();
    };
}

module.exports = requirePermissions;