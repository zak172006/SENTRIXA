// SENTRIXA - Domain Controller

const Domain = require("../models/Domain");

const domainController = {

    // Create Domain
    createDomain: async (req, res, next) => {
        try {
            const { name, url, description } = req.body;

            if (!name || !url) {
                return res.status(400).json({
                    success: false,
                    message: "Domain name and URL are required"
                });
            }

            const domain = await Domain.create({
                name,
                url,
                description,
                user: req.user?.id
            });

            return res.status(201).json({
                success: true,
                message: "Domain created successfully",
                data: domain
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Domains
    getAllDomains: async (req, res, next) => {
        try {
            const {
                status,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {};

            if (status) filter.status = status;

            const domains = await Domain.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Domain.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: domains
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Domain By ID
    getDomainById: async (req, res, next) => {
        try {
            const domain = await Domain.findById(req.params.id);

            if (!domain) {
                return res.status(404).json({
                    success: false,
                    message: "Domain not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: domain
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Domain
    updateDomain: async (req, res, next) => {
        try {
            const allowedFields = [
                "name",
                "url",
                "description",
                "status",
                "expiresAt",
                "sslStatus"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const domain = await Domain.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!domain) {
                return res.status(404).json({
                    success: false,
                    message: "Domain not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Domain updated successfully",
                data: domain
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Domain
    deleteDomain: async (req, res, next) => {
        try {
            const domain = await Domain.findByIdAndDelete(
                req.params.id
            );

            if (!domain) {
                return res.status(404).json({
                    success: false,
                    message: "Domain not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Domain deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = domainController;