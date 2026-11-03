// SENTRIXA - Password Reset Controller

const PasswordReset = require("../models/PasswordReset");

// Get all password reset requests
const getPasswordResetRequests = async (req, res) => {
    try {
        const requests = await PasswordReset.find()
            .select("-token -password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve password reset requests",
            error: error.message
        });
    }
};


// Get password reset request by ID
const getPasswordResetRequestById = async (req, res) => {
    try {
        const request = await PasswordReset.findById(req.params.id)
            .select("-token -password");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Password reset request not found"
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve password reset request",
            error: error.message
        });
    }
};


// Delete password reset request
const deletePasswordResetRequest = async (req, res) => {
    try {
        const request = await PasswordReset.findByIdAndDelete(
            req.params.id
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Password reset request not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Password reset request deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete password reset request",
            error: error.message
        });
    }
};


module.exports = {
    getPasswordResetRequests,
    getPasswordResetRequestById,
    deletePasswordResetRequest
};