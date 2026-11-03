// SENTRIXA - API Key Database Model

const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    keyHash: {
        type: String,
        required: true,
        unique: true,
        select: false
    },

    prefix: {
        type: String,
        required: true,
        maxlength: 20
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    permissions: [{
        type: String,
        trim: true
    }],

    status: {
        type: String,
        enum: [
            "active",
            "revoked",
            "expired"
        ],
        default: "active"
    },

    lastUsedAt: {
        type: Date,
        default: null
    },

    expiresAt: {
        type: Date,
        default: null
    },

    revokedAt: {
        type: Date,
        default: null
    },

    createdByIp: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

apiKeySchema.index({ user: 1 });

apiKeySchema.index({ status: 1 });

apiKeySchema.index({ keyHash: 1 }, { unique: true });

apiKeySchema.index({ createdAt: -1 });

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;