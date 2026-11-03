// SENTRIXA - Payment Database Model

const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        default: null
    },

    amount: {
        type: Number,
        required: true,
        min: 0
    },

    currency: {
        type: String,
        default: "USD"
    },

    paymentMethod: {
        type: String,
        enum: [
            "card",
            "bank_transfer",
            "wallet",
            "cash",
            "other"
        ],
        default: "other"
    },

    transactionId: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: [
            "pending",
            "processing",
            "completed",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    paidAt: {
        type: Date,
        default: null
    },

    failureReason: {
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

paymentSchema.index({ user: 1 });

paymentSchema.index({ status: 1 });

paymentSchema.index({ transactionId: 1 });

paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;