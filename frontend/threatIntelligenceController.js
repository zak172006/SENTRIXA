// SENTRIXA - Threat Intelligence Controller

const ThreatIntelligence = require("../models/ThreatIntelligence");

// Create Threat Intelligence
exports.createThreatIntelligence = async (req, res) => {
    try {
        const threat = await ThreatIntelligence.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Threat intelligence created successfully",
            data: threat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create threat intelligence",
            error: error.message
        });
    }
};

// Get All Threat Intelligence
exports.getThreatIntelligence = async (req, res) => {
    try {
        const threats = await ThreatIntelligence.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: threats.length,
            data: threats
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch threat intelligence",
            error: error.message
        });
    }
};

// Get Threat Intelligence By ID
exports.getThreatIntelligenceById = async (req, res) => {
    try {
        const threat = await ThreatIntelligence.findById(
            req.params.id
        );

        if (!threat) {
            return res.status(404).json({
                success: false,
                message: "Threat intelligence not found"
            });
        }

        res.status(200).json({
            success: true,
            data: threat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch threat intelligence",
            error: error.message
        });
    }
};

// Update Threat Intelligence
exports.updateThreatIntelligence = async (req, res) => {
    try {
        const threat = await ThreatIntelligence.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!threat) {
            return res.status(404).json({
                success: false,
                message: "Threat intelligence not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Threat intelligence updated successfully",
            data: threat
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update threat intelligence",
            error: error.message
        });
    }
};

// Delete Threat Intelligence
exports.deleteThreatIntelligence = async (req, res) => {
    try {
        const threat = await ThreatIntelligence.findByIdAndDelete(
            req.params.id
        );

        if (!threat) {
            return res.status(404).json({
                success: false,
                message: "Threat intelligence not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Threat intelligence deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete threat intelligence",
            error: error.message
        });
    }
};