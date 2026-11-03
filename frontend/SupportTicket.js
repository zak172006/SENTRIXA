// SENTRIXA - Support Ticket Database Model

const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({

    ticketNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    subject: {
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

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    category: {
        type: String,
        enum: [
            "technical",
            "security",
            "billing",
            "account",
            "general",
            "other"
        ],
        default: "general"
    },

    priority: {
        type: String,
        enum: [
            "urgent",
            "high",
            "medium",
            "low"
        ],
        default: "medium"
    },

    status: {
        type: String,
        enum: [
            "open",
            "in_progress",
            "waiting",
            "resolved",
            "closed"
        ],
        default: "open"
    },

    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    resolvedAt: {
        type: Date,
        default: null
    },

    closedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

supportTicketSchema.index({ user: 1, status: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ createdAt: -1 });

const SupportTicket = mongoose.model(
    "SupportTicket",
    supportTicketSchema
);

module.exports = SupportTicket;