// SENTRIXA - CORS Security Configuration

const cors = require("cors");

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    credentials: true,

    optionsSuccessStatus: 204
};

const corsMiddleware = cors(corsOptions);

module.exports = corsMiddleware;