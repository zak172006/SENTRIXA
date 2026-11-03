// SENTRIXA - System Settings Database Model

const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({

    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    value: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

    category: {
        type: String,
        enum: [
            "general",
            "security",
            "notifications",
            "system",
            "backup",
            "privacy"
        ],
        default: "general"
    },

    description: {
        type: String,
        default: ""
    },

    isPublic: {
        type: Boolean,
        default: false
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, {
    timestamps: true
});

settingsSchema.index({ category: 1 });

const Settings = mongoose.model(
    "Settings",
    settingsSchema
);

module.exports = Settings;