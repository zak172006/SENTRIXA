// SENTRIXA - Scan Schedule Database Model

const mongoose = require("mongoose");

const scanScheduleSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    description: {
        type: String,
        default: ""
    },

    scanType: {
        type: String,
        enum: [
            "network",
            "website",
            "server",
            "device",
            "vulnerability",
            "full",
            "custom"
        ],
        default: "custom"
    },

    target: {
        type: String,
        required: true,
        trim: true
    },

    scheduleType: {
        type: String,
        enum: [
            "once",
            "daily",
            "weekly",
            "monthly"
        ],
        default: "daily"
    },

    scheduledAt: {
        type: Date,
        required: true
    },

    nextRunAt: {
        type: Date,
        default: null
    },

    lastRunAt: {
        type: Date,
        default: null
    },

    isEnabled: {
        type: Boolean,
        default: true
    },

    initiatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    configuration: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    lastScan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scan",
        default: null
    },

    executionCount: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});

// Database indexes

scanScheduleSchema.index({ nextRunAt: 1, isEnabled: 1 });

scanScheduleSchema.index({ initiatedBy: 1 });

scanScheduleSchema.index({ scheduleType: 1 });

const ScanSchedule = mongoose.model(
    "ScanSchedule",
    scanScheduleSchema
);

module.exports = ScanSchedule;