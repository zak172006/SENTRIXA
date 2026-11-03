// SENTRIXA - API Key Controller

const ApiKey = require("../models/ApiKey");
const crypto = require("crypto");

// Generate API Key
exports.createApiKey = async (req, res) => {
    try {
        const apiKey = crypto.randomBytes(32).toString("hex");

        const newKey = await ApiKey.create({
            ...req.body,
            key: apiKey,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "API key created successfully",
            data: newKey
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create API key",
            error: error.message
        });
    }
};

// Get All API Keys
exports.getApiKeys = async (req, res) => {
    try {
        const keys = await ApiKey.find()
            .select("-key")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: keys.length,
            data: keys
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch API keys",
            error: error.message
        });
    }
};

// Get API Key By ID
exports.getApiKeyById = async (req, res) => {
    try {
        const key = await ApiKey.findById(req.params.id)
            .select("-key");

        if (!key) {
            return res.status(404).json({
                success: false,
                message: "API key not found"
            });
        }

        res.status(200).json({
            success: true,
            data: key
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch API key",
            error: error.message
        });
    }
};

// Update API Key
exports.updateApiKey = async (req, res) => {
    try {
        const allowedUpdates = {
            name: req.body.name,
            permissions: req.body.permissions,
            expiresAt: req.body.expiresAt,
            isActive: req.body.isActive
        };

        Object.keys(allowedUpdates).forEach(key => {
            if (allowedUpdates[key] === undefined) {
                delete allowedUpdates[key];
            }
        });

        const apiKey = await ApiKey.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            {
                new: true,
                runValidators: true
            }
        ).select("-key");

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: "API key not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "API key updated successfully",
            data: apiKey
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update API key",
            error: error.message
        });
    }
};

// Revoke API Key
exports.revokeApiKey = async (req, res) => {
    try {
        const apiKey = await ApiKey.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        ).select("-key");

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: "API key not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "API key revoked successfully",
            data: apiKey
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to revoke API key",
            error: error.message
        });
    }
};

// Delete API Key
exports.deleteApiKey = async (req, res) => {
    try {
        const apiKey = await ApiKey.findByIdAndDelete(req.params.id);

        if (!apiKey) {
            return res.status(404).json({
                success: false,
                message: "API key not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "API key deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete API key",
            error: error.message
        });
    }
};