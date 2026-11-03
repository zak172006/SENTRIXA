// SENTRIXA - Audit Service

const AuditLog = require("../models/AuditLog");

const auditService = {

    // Create Audit Log
    createLog: async (data) => {
        try {

            const log = await AuditLog.create({
                user: data.user || null,
                action: data.action,
                resource: data.resource || "system",
                resourceId: data.resourceId || null,
                description: data.description || "",
                ipAddress: data.ipAddress || null,
                userAgent: data.userAgent || null,
                status: data.status || "success",
                metadata: data.metadata || {}
            });

            return log;

        } catch (error) {
            throw new Error(
                "Failed to create audit log: " + error.message
            );
        }
    },

    // Get All Audit Logs
    getAllLogs: async (filters = {}) => {
        try {

            const query = {};

            if (filters.user) {
                query.user = filters.user;
            }

            if (filters.action) {
                query.action = filters.action;
            }

            if (filters.status) {
                query.status = filters.status;
            }

            if (filters.resource) {
                query.resource = filters.resource;
            }

            const page = Math.max(
                1,
                parseInt(filters.page, 10) || 1
            );

            const limit = Math.min(
                100,
                Math.max(1, parseInt(filters.limit, 10) || 20)
            );

            const skip = (page - 1) * limit;

            const [logs, total] = await Promise.all([
                AuditLog.find(query)
                    .populate("user", "name email")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),

                AuditLog.countDocuments(query)
            ]);

            return {
                logs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };

        } catch (error) {
            throw new Error(
                "Failed to retrieve audit logs: " + error.message
            );
        }
    },

    // Get User Activity
    getUserActivity: async (userId, limit = 20) => {
        try {

            return await AuditLog.find({
                user: userId
            })
                .sort({ createdAt: -1 })
                .limit(Math.min(100, Math.max(1, Number(limit) || 20)));

        } catch (error) {
            throw new Error(
                "Failed to retrieve user activity: " + error.message
            );
        }
    },

    // Delete Old Audit Logs
    deleteOldLogs: async (days = 90) => {
        try {

            const retentionDays = Math.max(
                1,
                Math.min(3650, Number(days) || 90)
            );

            const expirationDate = new Date();

            expirationDate.setDate(
                expirationDate.getDate() - retentionDays
            );

            const result = await AuditLog.deleteMany({
                createdAt: { $lt: expirationDate }
            });

            return {
                success: true,
                deletedCount: result.deletedCount
            };

        } catch (error) {
            throw new Error(
                "Failed to delete old logs: " + error.message
            );
        }
    }

};

module.exports = auditService;