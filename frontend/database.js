// SENTRIXA - Database Connection

const mongoose = require("mongoose");

async function connectDatabase() {
    try {
        const databaseURI = process.env.MONGODB_URI;

        if (!databaseURI) {
            throw new Error("MONGODB_URI is missing from environment variables");
        }

        await mongoose.connect(databaseURI);

        console.log("SENTRIXA Database Connected Successfully");

    } catch (error) {
        console.error("Database Connection Failed:", error.message);
        throw error;
    }
}

module.exports = connectDatabase;