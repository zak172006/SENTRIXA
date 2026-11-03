// SENTRIXA - Firewall Rule Database Model

const mongoose = require("mongoose");

const firewallRuleSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    ruleType: {
        type: String,
        enum: [
            "ip",
            "port",
            "protocol",
            "domain",
            "custom"
        ],
        default: "ip"
    },

    action: {
        type: String,
        enum: [
            "allow",
            "block",
            "monitor"
        ],
        default: "block"
    },

    source: {
        type: String,
        default: null
    },

    destination: {
        type: String,
        default: null
    },

    port: {
        type: Number,
        min: 1,
        max: 65535,
        default: null
    },

    protocol: {
        type: String,
        enum: [
            "TCP",
            "UDP",
            "ICMP",
            "ANY"
        ],
        default: "ANY"
    },

    priority: {
        type: Number,
        default: 100
    },

    status: {
        type: String,
        enum: [
            "active",
            "inactive",
            "disabled"
        ],
        default: "active"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    lastTriggeredAt: {
        type: Date,
        default: null
    },

    triggerCount: {
        type: Number,
        default: 0,
        min: 0
    },

    expiresAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

// Database indexes

firewallRuleSchema.index({ status: 1 });

firewallRuleSchema.index({ ruleType: 1 });

firewallRuleSchema.index({ action: 1 });

firewallRuleSchema.index({ priority: 1 });

firewallRuleSchema.index({ createdBy: 1 });

const FirewallRule = mongoose.model(
    "FirewallRule",
    firewallRuleSchema
);

module.exports = FirewallRule;