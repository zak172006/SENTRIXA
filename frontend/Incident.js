// SENTRIXA - Security Incident Database Model

const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({

    incidentId: {
        type: String,
        unique: true,
        sparse: true
    },

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        enum: [
            "malware",
            "phishing",
            "unauthorized_access",
            "data_breach",
            "ddos",
            "ransomware",
            "insider_threat",
            "network_attack",
            "other"
        ],
        default: "other"
    },

    severity: {
        type: String,
        enum: [
            "critical",
            "high",
            "medium",
            "low"
        ],
        default: "medium"
    },

    status: {
        type: String,
        enum: [
            "reported",
            "investigating",
            "contained",
            "eradicated",
            "recovered",
            "closed"
        ],
        default: "reported"
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    affectedAssets: [{
        type: String,
        trim: true
    }],

    sourceIp: {
        type: String,
        default: null
    },

    detectedAt: {
        type: Date,
        default: Date.now
    },

    containedAt: {
        type: Date,
        default: null
    },

    resolvedAt: {
        type: Date,
        default: null
    },

    resolution: {
        type: String,
        default: null
    },

    notes: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

// Database indexes

incidentSchema.index({ status: 1, severity: 1 });

incidentSchema.index({ detectedAt: -1 });

incidentSchema.index({ assignedTo: 1 });

incidentSchema.index({ reportedBy: 1 });

const Incident = mongoose.model(
    "Incident",
    incidentSchema
);

module.exports = Incident;