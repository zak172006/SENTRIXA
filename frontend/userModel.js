// SENTRIXA - User Database Model

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    role: {
        type: String,
        enum: [
            "super_admin",
            "admin",
            "security_analyst",
            "viewer"
        ],
        default: "viewer"
    },

    permissions: {
        type: [String],
        default: []
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    lastLogin: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;