// SENTRIXA - Website Monitoring Database Model

const mongoose = require("mongoose");

const websiteSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    url: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: [
            "active",
            "inactive",
            "monitoring",
            "error"
        ],
        default: "active"
    },

    monitoringEnabled: {
        type: Boolean,
        default: true
    },

    lastCheckedAt: {
        type: Date,
        default: null
    },

    lastResponseTime: {
        type: Number,
        default: null
    },

    lastHttpStatus: {
        type: Number,
        default: null
    },

    sslEnabled: {
        type: Boolean,
        default: false
    },

    sslExpiresAt: {
        type: Date,
        default: null
    },

    riskLevel: {
        type: String,
        enum: [
            "critical",
            "high",
            "medium",
            "low",
            "unknown"
        ],
        default: "unknown"
    },

    notes: {
        type: String,
        default: ""
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

// Database indexes

websiteSchema.index({ owner: 1 });

websiteSchema.index({ status: 1 });

websiteSchema.index({ monitoringEnabled: 1 });

websiteSchema.index({ createdAt: -1 });

const Website = mongoose.model("Website", websiteSchema);

module.exports = Website;