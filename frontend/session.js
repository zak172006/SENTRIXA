// SENTRIXA - User Session Database Model

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tokenHash: {
        type: String,
        required: true,
        select: false
    },

    ipAddress: {
        type: String,
        default: null
    },

    userAgent: {
        type: String,
        default: null
    },

    deviceName: {
        type: String,
        default: "Unknown Device"
    },

    status: {
        type: String,
        enum: [
            "active",
            "revoked",
            "expired"
        ],
        default: "active"
    },

    lastActivity: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        required: true
    },

    revokedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

sessionSchema.index({ user: 1, status: 1 });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

sessionSchema.index({ tokenHash: 1 }, { unique: true });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;