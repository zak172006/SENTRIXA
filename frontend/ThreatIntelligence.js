// SENTRIXA - Threat Intelligence Database Model

const mongoose = require("mongoose");

const threatIntelligenceSchema = new mongoose.Schema({

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

    threatType: {
        type: String,
        enum: [
            "malware",
            "phishing",
            "ransomware",
            "botnet",
            "spyware",
            "trojan",
            "ddos",
            "apt",
            "other"
        ],
        default: "other"
    },

    indicatorType: {
        type: String,
        enum: [
            "ip",
            "domain",
            "url",
            "hash",
            "email",
            "file",
            "other"
        ],
        default: "other"
    },

    indicatorValue: {
        type: String,
        trim: true,
        default: null
    },

    severity: {
        type: String,
        enum: [
            "critical",
            "high",
            "medium",
            "low",
            "info"
        ],
        default: "medium"
    },

    confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },

    source: {
        type: String,
        default: "internal"
    },

    status: {
        type: String,
        enum: [
            "active",
            "investigating",
            "mitigated",
            "false_positive",
            "archived"
        ],
        default: "active"
    },

    firstSeen: {
        type: Date,
        default: Date.now
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    tags: [{
        type: String,
        trim: true
    }],

    references: [{
        type: String,
        trim: true
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

// Database indexes

threatIntelligenceSchema.index({
    threatType: 1,
    severity: 1
});

threatIntelligenceSchema.index({
    indicatorType: 1,
    indicatorValue: 1
});

threatIntelligenceSchema.index({
    status: 1
});

threatIntelligenceSchema.index({
    lastSeen: -1
});

const ThreatIntelligence = mongoose.model(
    "ThreatIntelligence",
    threatIntelligenceSchema
);

module.exports = ThreatIntelligence;