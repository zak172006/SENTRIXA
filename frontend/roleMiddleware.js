// SENTRIXA - Role Based Access Control

const responseHandler = require("./responseHandler");

function allowRoles(...allowedRoles) {

    return function (req, res, next) {

        if (!req.user) {
            return responseHandler.unauthorized(
                res,
                "Please login first"
            );
        }

        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return responseHandler.forbidden(
                res,
                "You do not have permission to access this resource"
            );
        }

        next();
    };
}

module.exports = allowRoles;