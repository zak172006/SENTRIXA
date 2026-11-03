// SENTRIXA - Firewall Rule Controller

const FirewallRule = require("../models/FirewallRule");

// Create Firewall Rule
exports.createFirewallRule = async (req, res) => {
    try {
        const rule = await FirewallRule.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Firewall rule created successfully",
            data: rule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create firewall rule",
            error: error.message
        });
    }
};

// Get All Firewall Rules
exports.getFirewallRules = async (req, res) => {
    try {
        const rules = await FirewallRule.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rules.length,
            data: rules
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch firewall rules",
            error: error.message
        });
    }
};

// Get Firewall Rule By ID
exports.getFirewallRuleById = async (req, res) => {
    try {
        const rule = await FirewallRule.findById(req.params.id);

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Firewall rule not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch firewall rule",
            error: error.message
        });
    }
};

// Update Firewall Rule
exports.updateFirewallRule = async (req, res) => {
    try {
        const rule = await FirewallRule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Firewall rule not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Firewall rule updated successfully",
            data: rule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update firewall rule",
            error: error.message
        });
    }
};

// Delete Firewall Rule
exports.deleteFirewallRule = async (req, res) => {
    try {
        const rule = await FirewallRule.findByIdAndDelete(req.params.id);

        if (!rule) {
            return res.status(404).json({
                success: false,
                message: "Firewall rule not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Firewall rule deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete firewall rule",
            error: error.message
        });
    }
};