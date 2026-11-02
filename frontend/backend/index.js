const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to SENTRIXA",
        status: "Server is running",
        version: "1.0.0"
    });
});

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(
        `SENTRIXA Server running on port ${PORT}`
    );
});
