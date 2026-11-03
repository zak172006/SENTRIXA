
const crypto = require("crypto");
const Webhook = require("../models/Webhook");

// Get all webhooks
exports.getWebhooks = async (req, res) => {
    try {
        const webhooks = await Webhook.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: webhooks.length,
            data: webhooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch webhooks",
            error: error.message
        });
    }
};

// Get webhook by ID
exports.getWebhookById = async (req, res) => {
    try {
        const webhook = await Webhook.findById(req.params.id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                message: "Webhook not found"
            });
        }

        res.status(200).json({
            success: true,
            data: webhook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch webhook",
            error: error.message
        });
    }
};

// Create webhook
exports.createWebhook = async (req, res) => {
    try {
        const { name, url, events, secret } = req.body;

        if (!name || !url || !Array.isArray(events) || events.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Name, URL and at least one event are required"
            });
        }

        let parsedUrl;

        try {
            parsedUrl = new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook URL"
            });
        }

        if (parsedUrl.protocol !== "https:") {
            return res.status(400).json({
                success: false,
                message: "Webhook URL must use HTTPS"
            });
        }

        const webhook = await Webhook.create({
            name,
            url,
            events,
            secret: secret || crypto.randomBytes(32).toString("hex"),
            status: "active",
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Webhook created successfully",
            data: {
                _id: webhook._id,
                name: webhook.name,
                url: webhook.url,
                events: webhook.events,
                status: webhook.status
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create webhook",
            error: error.message
        });
    }
};

// Update webhook
exports.updateWebhook = async (req, res) => {
    try {
        const allowedFields = ["name", "url", "events", "status"];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.url) {
            let parsedUrl;

            try {
                parsedUrl = new URL(updates.url);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Invalid webhook URL"
                });
            }

            if (parsedUrl.protocol !== "https:") {
                return res.status(400).json({
                    success: false,
                    message: "Webhook URL must use HTTPS"
                });
            }
        }

        const webhook = await Webhook.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!webhook) {
            return res.status(404).json({
                success: false,
                message: "Webhook not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Webhook updated successfully",
            data: webhook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update webhook",
            error: error.message
        });
    }
};

// Delete webhook
exports.deleteWebhook = async (req, res) => {
    try {
        const webhook = await Webhook.findByIdAndDelete(req.params.id);

        if (!webhook) {
            return res.status(404).json({
                success: false,
                message: "Webhook not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Webhook deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete webhook",
            error: error.message
        });
    }
};

// Activate webhook
exports.activateWebhook = async (req, res) => {
    try {
        const webhook = await Webhook.findByIdAndUpdate(
            req.params.id,
            { status: "active" },
            { new: true }
        );

        if (!webhook) {
            return res.status(404).json({
                success: false,
                message: "Webhook not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Webhook activated successfully",
            data: webhook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to activate webhook",
            error: error.message
        });
    }
};

// Deactivate webhook
exports.deactivateWebhook = async (req, res) => {
    try {
        const webhook = await Webhook.findByIdAndUpdate(
            req.params.id,
            { status: "inactive" },
            { new: true }
        );

        if (!webhook) {
            return res.status(404).json({
                success: false,
                message: "Webhook not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Webhook deactivated successfully",
            data: webhook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to deactivate webhook",
            error: error.message
        });
    }
};
