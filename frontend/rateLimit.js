// SENTRIXA - Rate Limiting Protection

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 5,

    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false,

    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many login attempts. Try again after 15 minutes.",
            timestamp: new Date().toISOString()
        });
    }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 100,

    standardHeaders: true,

    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    apiLimiter
};