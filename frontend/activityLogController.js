// SENTRIXA - Activity Log Controller

const ActivityLog = require("../models/ActivityLog");

// Create Activity Log
exports.createActivityLog = async (req, res) => {
    try {
        const activity = await ActivityLog.create({
            ...req.body,
            user: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Activity log created successfully",
            data: activity
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create activity log",
            error: error.message
        });
    }
};

// Get All Activity Logs
exports.getActivityLogs = async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs",
            error: error.message
        });
    }
};

// Get Activity Log By ID
exports.getActivityLogById = async (req, res) => {
    try {
        const activity = await ActivityLog.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        res.status(200).json({
            success: true,
            data: activity
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch activity log",
            error: error.message
        });
    }
};

// Delete Activity Log
exports.deleteActivityLog = async (req, res) => {
    try {
        const activity = await ActivityLog.findByIdAndDelete(
            req.params.id
        );

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity log deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete activity log",
            error: error.message
        });
    }
};