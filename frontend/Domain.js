// SENTRIXA - Domain Monitoring Database Model

const mongoose = require("mongoose");

const domainSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    domainName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
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
            "expired",
            "suspended",
            "unknown"
        ],
        default: "active"
    },

    registrar: {
        type: String,
        default: null
    },

    registeredAt: {
        type: Date,
        default: null
    },

    expiresAt: {
        type: Date,
        default: null
    },

    nameservers: [{
        type: String,
        trim: true
    }],

    dnsRecords: [{
        type: String,
        trim: true
    }],

    sslEnabled: {
        type: Boolean,
        default: false
    },

    sslExpiresAt: {
        type: Date,
        default: null
    },

    monitoringEnabled: {
        type: Boolean,
        default: true
    },

    lastCheckedAt: {
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

domainSchema.index({ owner: 1 });

domainSchema.index({ domainName: 1 });

domainSchema.index({ status: 1 });

domainSchema.index({ expiresAt: 1 });

const Domain = mongoose.model("Domain", domainSchema);

module.exports = Domain;