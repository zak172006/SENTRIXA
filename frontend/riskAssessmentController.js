// SENTRIXA - Risk Assessment Controller

const RiskAssessment = require("../models/RiskAssessment");

// Create Risk Assessment
exports.createRiskAssessment = async (req, res) => {
    try {
        const assessment = await RiskAssessment.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Risk assessment created successfully",
            data: assessment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create risk assessment",
            error: error.message
        });
    }
};

// Get All Risk Assessments
exports.getRiskAssessments = async (req, res) => {
    try {
        const assessments = await RiskAssessment.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: assessments.length,
            data: assessments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch risk assessments",
            error: error.message
        });
    }
};

// Get Risk Assessment By ID
exports.getRiskAssessmentById = async (req, res) => {
    try {
        const assessment = await RiskAssessment.findById(
            req.params.id
        );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Risk assessment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: assessment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch risk assessment",
            error: error.message
        });
    }
};

// Update Risk Assessment
exports.updateRiskAssessment = async (req, res) => {
    try {
        const assessment = await RiskAssessment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Risk assessment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Risk assessment updated successfully",
            data: assessment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update risk assessment",
            error: error.message
        });
    }
};

// Delete Risk Assessment
exports.deleteRiskAssessment = async (req, res) => {
    try {
        const assessment = await RiskAssessment.findByIdAndDelete(
            req.params.id
        );

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Risk assessment not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Risk assessment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete risk assessment",
            error: error.message
        });
    }
};