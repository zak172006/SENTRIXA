// SENTRIXA - Settings Controller

const Settings = require("../models/Settings");

// Get Settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
                createdBy: req.user?._id
            });
        }

        res.status(200).json({
            success: true,
            data: settings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message
        });
    }
};

// Update Settings
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            {},
            {
                $set: req.body,
                $setOnInsert: {
                    createdBy: req.user?._id
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            data: settings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
            error: error.message
        });
    }
};

// Reset Settings
exports.resetSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            {},
            {
                $set: {
                    notifications: true,
                    emailNotifications: true,
                    securityAlerts: true,
                    maintenanceMode: false
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Settings reset successfully",
            data: settings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset settings",
            error: error.message
        });
    }
};