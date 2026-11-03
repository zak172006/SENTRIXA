// SENTRIXA - Activity Log Database Model

const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    action: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        enum: [
            "authentication",
            "security",
            "user_management",
            "system",
            "database",
            "network",
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
            "low",
            "info"
        ],
        default: "info"
    },

    ipAddress: {
        type: String,
        default: null
    },

    userAgent: {
        type: String,
        default: null
    },

    resource: {
        type: String,
        default: null
    },

    resourceId: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: [
            "success",
            "failed",
            "pending"
        ],
        default: "success"
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    timestamp: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

// Database indexes

activityLogSchema.index({ user: 1 });

activityLogSchema.index({ category: 1 });

activityLogSchema.index({ severity: 1 });

activityLogSchema.index({ timestamp: -1 });

activityLogSchema.index({ status: 1 });

const ActivityLog = mongoose.model(
    "ActivityLog",
    activityLogSchema
);

module.exports = ActivityLog;