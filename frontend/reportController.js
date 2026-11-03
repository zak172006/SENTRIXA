// SENTRIXA - Report Controller

const Report = require("../models/Report");

const reportController = {

    // Create Report
    createReport: async (req, res, next) => {
        try {
            const {
                title,
                description,
                reportType,
                period,
                data
            } = req.body;

            if (!title || !reportType) {
                return res.status(400).json({
                    success: false,
                    message: "Title and report type are required"
                });
            }

            const report = await Report.create({
                title,
                description,
                reportType,
                period,
                data,
                createdBy: req.user?.id
            });

            return res.status(201).json({
                success: true,
                message: "Report created successfully",
                data: report
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Reports
    getAllReports: async (req, res, next) => {
        try {
            const {
                reportType,
                status,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (reportType) filter.reportType = reportType;
            if (status) filter.status = status;

            const reports = await Report.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Report.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: reports
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Report By ID
    getReportById: async (req, res, next) => {
        try {
            const report = await Report.findById(req.params.id);

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: report
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Report
    updateReport: async (req, res, next) => {
        try {
            const allowedFields = [
                "title",
                "description",
                "reportType",
                "period",
                "data",
                "status"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const report = await Report.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Report updated successfully",
                data: report
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Report
    deleteReport: async (req, res, next) => {
        try {
            const report = await Report.findByIdAndDelete(
                req.params.id
            );

            if (!report) {
                return res.status(404).json({
                    success: false,
                    message: "Report not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Report deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = reportController;