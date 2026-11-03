// SENTRIXA - Audit Log Controller

const AuditLog = require("../models/AuditLog");

// Create Audit Log
exports.createAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.create({
            ...req.body,
            user: req.user?._id,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.status(201).json({
            success: true,
            message: "Audit log created successfully",
            data: auditLog
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create audit log",
            error: error.message
        });
    }
};

// Get All Audit Logs
exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
            error: error.message
        });
    }
};

// Get Audit Log By ID
exports.getAuditLogById = async (req, res) => {
    try {
        const log = await AuditLog.findById(req.params.id);

        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            data: log
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit log",
            error: error.message
        });
    }
};

// Delete Audit Log
exports.deleteAuditLog = async (req, res) => {
    try {
        const log = await AuditLog.findByIdAndDelete(req.params.id);

        if (!log) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit log deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete audit log",
            error: error.message
        });
    }
};