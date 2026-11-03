// SENTRIXA - Subscription Database Model

const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    planName: {
        type: String,
        enum: [
            "free",
            "basic",
            "professional",
            "enterprise"
        ],
        default: "free"
    },

    status: {
        type: String,
        enum: [
            "active",
            "pending",
            "cancelled",
            "expired",
            "suspended"
        ],
        default: "active"
    },

    price: {
        type: Number,
        default: 0,
        min: 0
    },

    currency: {
        type: String,
        default: "USD"
    },

    billingCycle: {
        type: String,
        enum: [
            "monthly",
            "yearly",
            "lifetime"
        ],
        default: "monthly"
    },

    startDate: {
        type: Date,
        default: Date.now
    },

    endDate: {
        type: Date,
        default: null
    },

    autoRenew: {
        type: Boolean,
        default: false
    },

    paymentMethod: {
        type: String,
        default: null
    },

    transactionId: {
        type: String,
        default: null
    },

    features: [{
        type: String
    }],

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

subscriptionSchema.index({ user: 1, status: 1 });

subscriptionSchema.index({ endDate: 1 });

const Subscription = mongoose.model(
    "Subscription",
    subscriptionSchema
);

module.exports = Subscription;