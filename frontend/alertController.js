// SENTRIXA - Alert Controller

const Alert = require("../models/alertModel");

const alertController = {

    // Create Alert
    createAlert: async (req, res, next) => {
        try {
            const {
                title,
                description,
                severity,
                type,
                source
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Alert title is required"
                });
            }

            const alert = await Alert.create({
                title,
                description,
                severity,
                type,
                source,
                user: req.user?.id
            });

            return res.status(201).json({
                success: true,
                message: "Alert created successfully",
                data: alert
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Alerts
    getAllAlerts: async (req, res, next) => {
        try {
            const {
                severity,
                status,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (severity) filter.severity = severity;
            if (status) filter.status = status;

            const alerts = await Alert.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Alert.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: alerts
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Alert By ID
    getAlertById: async (req, res, next) => {
        try {
            const alert = await Alert.findById(req.params.id);

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: alert
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Alert
    updateAlert: async (req, res, next) => {
        try {
            const allowedFields = [
                "title",
                "description",
                "severity",
                "status",
                "type",
                "source",
                "assignedTo"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const alert = await Alert.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Alert updated successfully",
                data: alert
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Alert
    deleteAlert: async (req, res, next) => {
        try {
            const alert = await Alert.findByIdAndDelete(
                req.params.id
            );

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Alert deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = alertController;