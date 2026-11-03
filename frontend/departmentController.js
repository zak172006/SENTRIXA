
const Department = require("../models/Department");

// Get all departments
exports.getDepartments = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.organization) {
            filter.organization = req.query.organization;
        }

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

        const [departments, total] = await Promise.all([
            Department.find(filter)
                .populate("manager", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Department.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: departments.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve departments",
            error: error.message
        });
    }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id)
            .populate("manager", "name email");

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve department",
            error: error.message
        });
    }
};

// Create department
exports.createDepartment = async (req, res) => {
    try {
        const {
            name,
            description,
            organization,
            manager,
            code
        } = req.body;

        if (!name || !organization) {
            return res.status(400).json({
                success: false,
                message: "Department name and organization are required"
            });
        }

        const existing = await Department.findOne({
            name: name.trim(),
            organization
        });

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "This department already exists"
            });
        }

        const department = await Department.create({
            name: name.trim(),
            description,
            organization,
            manager: manager || null,
            code,
            status: "active",
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create department",
            error: error.message
        });
    }
};

// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "manager",
            "code"
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

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update department",
            error: error.message
        });
    }
};

// Update department status
exports.updateDepartmentStatus = async (req, res) => {
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
                message: "Invalid department status"
            });
        }

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department status updated successfully",
            data: department
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update department status",
            error: error.message
        });
    }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(
            req.params.id
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete department",
            error: error.message
        });
    }
};

// Get department statistics
exports.getDepartmentStatistics = async (req, res) => {
    try {
        const statistics = await Department.aggregate([
            {
                $match: req.query.organization
                    ? { organization: require("mongoose").Types.ObjectId.createFromHexString(req.query.organization) }
                    : {}
            },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve department statistics",
            error: error.message
        });
    }
};
