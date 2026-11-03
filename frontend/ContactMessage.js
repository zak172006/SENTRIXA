// SENTRIXA - Contact Message Database Model

const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 150
    },

    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    status: {
        type: String,
        enum: [
            "new",
            "read",
            "replied",
            "archived"
        ],
        default: "new"
    },

    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    repliedAt: {
        type: Date,
        default: null
    },

    ipAddress: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

const ContactMessage = mongoose.model(
    "ContactMessage",
    contactMessageSchema
);

module.exports = ContactMessage;