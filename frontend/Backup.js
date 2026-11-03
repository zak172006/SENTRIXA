// SENTRIXA - Backup Database Model

const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    backupType: {
        type: String,
        enum: [
            "full",
            "incremental",
            "database",
            "files",
            "configuration"
        ],
        default: "full"
    },

    status: {
        type: String,
        enum: [
            "pending",
            "running",
            "completed",
            "failed",
            "restoring",
            "deleted"
        ],
        default: "pending"
    },

    storagePath: {
        type: String,
        default: null
    },

    fileSize: {
        type: Number,
        default: 0,
        min: 0
    },

    checksum: {
        type: String,
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    startedAt: {
        type: Date,
        default: null
    },

    completedAt: {
        type: Date,
        default: null
    },

    expiresAt: {
        type: Date,
        default: null
    },

    errorMessage: {
        type: String,
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

backupSchema.index({ status: 1 });

backupSchema.index({ backupType: 1 });

backupSchema.index({ createdAt: -1 });

backupSchema.index({ createdBy: 1 });

const Backup = mongoose.model("Backup", backupSchema);

module.exports = Backup;