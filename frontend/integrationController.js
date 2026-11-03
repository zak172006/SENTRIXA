
const Integration = require("../models/Integration");
const ActivityLog = require("../models/ActivityLog");

// Get all integrations
exports.getIntegrations = async (req, res) => {
    try {
        const integrations = await Integration.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: integrations.length,
            data: integrations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve integrations",
            error: error.message
        });
    }
};

// Get integration by ID
exports.getIntegrationById = async (req, res) => {
    try {
        const integration = await Integration.findById(req.params.id);

        if (!integration) {
            return res.status(404).json({
                success: false,
                message: "Integration not found"
            });
        }

        res.status(200).json({
            success: true,
            data: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve integration",
            error: error.message
        });
    }
};

// Create integration
exports.createIntegration = async (req, res) => {
    try {
        const {
            name,
            provider,
            apiUrl,
            description,
            status
        } = req.body;

        if (!name || !provider) {
            return res.status(400).json({
                success: false,
                message: "Name and provider are required"
            });
        }

        const integration = await Integration.create({
            name,
            provider,
            apiUrl,
            description,
            status: status || "inactive",
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Integration created successfully",
            data: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create integration",
            error: error.message
        });
    }
};

// Update integration
exports.updateIntegration = async (req, res) => {
    try {
        const integration = await Integration.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!integration) {
            return res.status(404).json({
                success: false,
                message: "Integration not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Integration updated successfully",
            data: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update integration",
            error: error.message
        });
    }
};

// Delete integration
exports.deleteIntegration = async (req, res) => {
    try {
        const integration = await Integration.findByIdAndDelete(
            req.params.id
        );

        if (!integration) {
            return res.status(404).json({
                success: false,
                message: "Integration not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Integration deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete integration",
            error: error.message
        });
    }
};

// Activate integration
exports.activateIntegration = async (req, res) => {
    try {
        const integration = await Integration.findByIdAndUpdate(
            req.params.id,
            { status: "active" },
            { new: true, runValidators: true }
        );

        if (!integration) {
            return res.status(404).json({
                success: false,
                message: "Integration not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Integration activated successfully",
            data: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to activate integration",
            error: error.message
        });
    }
};

// Deactivate integration
exports.deactivateIntegration = async (req, res) => {
    try {
        const integration = await Integration.findByIdAndUpdate(
            req.params.id,
            { status: "inactive" },
            { new: true, runValidators: true }
        );

        if (!integration) {
            return res.status(404).json({
                success: false,
                message: "Integration not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Integration deactivated successfully",
            data: integration
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to deactivate integration",
            error: error.message
        });
    }
};
