// SENTRIXA - Scan Controller

const Scan = require("../models/Scan");

const scanController = {

    // Create Scan
    createScan: async (req, res, next) => {
        try {
            const {
                target,
                scanType,
                description
            } = req.body;

            if (!target || !scanType) {
                return res.status(400).json({
                    success: false,
                    message: "Target and scan type are required"
                });
            }

            const scan = await Scan.create({
                target,
                scanType,
                description,
                status: "pending",
                initiatedBy: req.user?.id
            });

            return res.status(201).json({
                success: true,
                message: "Scan created successfully",
                data: scan
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Scans
    getAllScans: async (req, res, next) => {
        try {
            const {
                status,
                scanType,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (status) filter.status = status;
            if (scanType) filter.scanType = scanType;

            const scans = await Scan.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Scan.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: scans
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Scan By ID
    getScanById: async (req, res, next) => {
        try {
            const scan = await Scan.findById(req.params.id);

            if (!scan) {
                return res.status(404).json({
                    success: false,
                    message: "Scan not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: scan
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Scan
    updateScan: async (req, res, next) => {
        try {
            const allowedFields = [
                "status",
                "results",
                "findings",
                "riskLevel",
                "completedAt",
                "description"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const scan = await Scan.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!scan) {
                return res.status(404).json({
                    success: false,
                    message: "Scan not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Scan updated successfully",
                data: scan
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Scan
    deleteScan: async (req, res, next) => {
        try {
            const scan = await Scan.findByIdAndDelete(
                req.params.id
            );

            if (!scan) {
                return res.status(404).json({
                    success: false,
                    message: "Scan not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Scan deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = scanController;