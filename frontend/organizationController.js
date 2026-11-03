
const Organization = require("../models/Organization");

// Get all organizations
exports.getOrganizations = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.search) {
            const search = String(req.query.search).trim();

            filter.name = {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                $options: "i"
            };
        }

        const [organizations, total] = await Promise.all([
            Organization.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Organization.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: organizations.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: organizations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve organizations",
            error: error.message
        });
    }
};

// Get organization by ID
exports.getOrganizationById = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            data: organization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve organization",
            error: error.message
        });
    }
};

// Create organization
exports.createOrganization = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            industry,
            description
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Organization name and email are required"
            });
        }

        const existing = await Organization.findOne({
            email: email.toLowerCase().trim()
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "An organization with this email already exists"
            });
        }

        const organization = await Organization.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone,
            address,
            industry,
            description,
            status: "active",
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Organization created successfully",
            data: organization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create organization",
            error: error.message
        });
    }
};

// Update organization
exports.updateOrganization = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "email",
            "phone",
            "address",
            "industry",
            "description"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.name) {
            updates.name = updates.name.trim();
        }

        if (updates.email) {
            updates.email = updates.email.toLowerCase().trim();

            const duplicate = await Organization.findOne({
                email: updates.email,
                _id: { $ne: req.params.id }
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "This email is already in use"
                });
            }
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            data: organization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update organization",
            error: error.message
        });
    }
};

// Change organization status
exports.updateOrganizationStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "active",
            "inactive",
            "suspended"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid organization status"
            });
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization status updated successfully",
            data: organization
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update organization status",
            error: error.message
        });
    }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findByIdAndDelete(
            req.params.id
        );

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete organization",
            error: error.message
        });
    }
};
