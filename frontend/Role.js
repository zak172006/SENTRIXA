// SENTRIXA - Role Database Model

const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    displayName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    permissions: [{
        type: String,
        trim: true
    }],

    isSystemRole: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

roleSchema.index({ name: 1 }, { unique: true });

roleSchema.index({ isActive: 1 });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;