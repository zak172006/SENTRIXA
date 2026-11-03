// SENTRIXA - Backup Controller

const Backup = require("../models/Backup");

// Create Backup
exports.createBackup = async (req, res) => {
    try {
        const backup = await Backup.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Backup created successfully",
            data: backup
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create backup",
            error: error.message
        });
    }
};

// Get All Backups
exports.getBackups = async (req, res) => {
    try {
        const backups = await Backup.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: backups.length,
            data: backups
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch backups",
            error: error.message
        });
    }
};

// Get Backup By ID
exports.getBackupById = async (req, res) => {
    try {
        const backup = await Backup.findById(req.params.id);

        if (!backup) {
            return res.status(404).json({
                success: false,
                message: "Backup not found"
            });
        }

        res.status(200).json({
            success: true,
            data: backup
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch backup",
            error: error.message
        });
    }
};

// Update Backup
exports.updateBackup = async (req, res) => {
    try {
        const backup = await Backup.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!backup) {
            return res.status(404).json({
                success: false,
                message: "Backup not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Backup updated successfully",
            data: backup
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update backup",
            error: error.message
        });
    }
};

// Delete Backup
exports.deleteBackup = async (req, res) => {
    try {
        const backup = await Backup.findByIdAndDelete(req.params.id);

        if (!backup) {
            return res.status(404).json({
                success: false,
                message: "Backup not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Backup deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete backup",
            error: error.message
        });
    }
};