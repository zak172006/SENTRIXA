// SENTRIXA - Password Reset Database Model

const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    tokenHash: {
        type: String,
        required: true,
        unique: true,
        select: false
    },

    expiresAt: {
        type: Date,
        required: true
    },

    usedAt: {
        type: Date,
        default: null
    },

    isUsed: {
        type: Boolean,
        default: false
    },

    ipAddress: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

passwordResetSchema.index({ user: 1 });

passwordResetSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PasswordReset = mongoose.model(
    "PasswordReset",
    passwordResetSchema
);

module.exports = PasswordReset;