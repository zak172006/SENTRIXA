// SENTRIXA - Incident Controller

const Incident = require("../models/Incident");

const incidentController = {

    // Create Incident
    createIncident: async (req, res, next) => {
        try {
            const {
                title,
                description,
                severity,
                category,
                source,
                affectedSystems
            } = req.body;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required"
                });
            }

            const incident = await Incident.create({
                title,
                description,
                severity,
                category,
                source,
                affectedSystems,
                reportedBy: req.user?.id
            });

            return res.status(201).json({
                success: true,
                message: "Incident created successfully",
                data: incident
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Incidents
    getAllIncidents: async (req, res, next) => {
        try {
            const {
                status,
                severity,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (status) filter.status = status;
            if (severity) filter.severity = severity;

            const incidents = await Incident.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Incident.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: incidents
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Incident By ID
    getIncidentById: async (req, res, next) => {
        try {
            const incident = await Incident.findById(req.params.id);

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: incident
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Incident
    updateIncident: async (req, res, next) => {
        try {
            const allowedFields = [
                "title",
                "description",
                "severity",
                "status",
                "category",
                "source",
                "affectedSystems",
                "resolution",
                "assignedTo"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const incident = await Incident.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Incident updated successfully",
                data: incident
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Incident
    deleteIncident: async (req, res, next) => {
        try {
            const incident = await Incident.findByIdAndDelete(
                req.params.id
            );

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Incident deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = incidentController;