// SENTRIXA - Website Controller

const Website = require("../models/Website");

// Create Website
exports.createWebsite = async (req, res) => {
    try {
        const website = await Website.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Website created successfully",
            data: website
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create website",
            error: error.message
        });
    }
};

// Get All Websites
exports.getWebsites = async (req, res) => {
    try {
        const websites = await Website.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: websites.length,
            data: websites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch websites",
            error: error.message
        });
    }
};

// Get Website By ID
exports.getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            });
        }

        res.status(200).json({
            success: true,
            data: website
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch website",
            error: error.message
        });
    }
};

// Update Website
exports.updateWebsite = async (req, res) => {
    try {
        const website = await Website.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Website updated successfully",
            data: website
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update website",
            error: error.message
        });
    }
};

// Delete Website
exports.deleteWebsite = async (req, res) => {
    try {
        const website = await Website.findByIdAndDelete(
            req.params.id
        );

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Website deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete website",
            error: error.message
        });
    }
};