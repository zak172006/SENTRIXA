// SENTRIXA - Scan Schedule Controller

const ScanSchedule = require("../models/ScanSchedule");

// Create Scan Schedule
exports.createScanSchedule = async (req, res) => {
    try {
        const schedule = await ScanSchedule.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Scan schedule created successfully",
            data: schedule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create scan schedule",
            error: error.message
        });
    }
};

// Get All Scan Schedules
exports.getScanSchedules = async (req, res) => {
    try {
        const schedules = await ScanSchedule.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: schedules.length,
            data: schedules
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch scan schedules",
            error: error.message
        });
    }
};

// Get Scan Schedule By ID
exports.getScanScheduleById = async (req, res) => {
    try {
        const schedule = await ScanSchedule.findById(req.params.id);

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Scan schedule not found"
            });
        }

        res.status(200).json({
            success: true,
            data: schedule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch scan schedule",
            error: error.message
        });
    }
};

// Update Scan Schedule
exports.updateScanSchedule = async (req, res) => {
    try {
        const schedule = await ScanSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Scan schedule not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Scan schedule updated successfully",
            data: schedule
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update scan schedule",
            error: error.message
        });
    }
};

// Delete Scan Schedule
exports.deleteScanSchedule = async (req, res) => {
    try {
        const schedule = await ScanSchedule.findByIdAndDelete(
            req.params.id
        );

        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Scan schedule not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Scan schedule deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete scan schedule",
            error: error.message
        });
    }
};