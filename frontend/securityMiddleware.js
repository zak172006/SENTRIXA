// SENTRIXA - Security Middleware

const helmet = require("helmet");

const securityMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: []
        }
    },

    crossOriginEmbedderPolicy: false,

    referrerPolicy: {
        policy: "strict-origin-when-cross-origin"
    }
});

module.exports = securityMiddleware;