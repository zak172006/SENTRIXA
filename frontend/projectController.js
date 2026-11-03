
const Project = require("../models/Project");

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.organization) {
            filter.organization = req.query.organization;
        }

        if (req.query.department) {
            filter.department = req.query.department;
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

        const [projects, total] = await Promise.all([
            Project.find(filter)
                .populate("manager", "name email")
                .populate("department", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Project.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: projects.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve projects",
            error: error.message
        });
    }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("manager", "name email")
            .populate("department", "name");

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project",
            error: error.message
        });
    }
};

// Create project
exports.createProject = async (req, res) => {
    try {
        const {
            name,
            description,
            organization,
            department,
            manager,
            startDate,
            endDate,
            budget,
            priority
        } = req.body;

        if (!name || !organization) {
            return res.status(400).json({
                success: false,
                message: "Project name and organization are required"
            });
        }

        if (
            startDate &&
            endDate &&
            new Date(endDate) < new Date(startDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        const project = await Project.create({
            name: name.trim(),
            description,
            organization,
            department: department || null,
            manager: manager || req.user?._id,
            startDate,
            endDate,
            budget: Number(budget) || 0,
            priority: priority || "medium",
            status: "planning",
            progress: 0,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create project",
            error: error.message
        });
    }
};

// Update project
exports.updateProject = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "department",
            "manager",
            "startDate",
            "endDate",
            "budget",
            "priority"
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

        if (updates.budget !== undefined) {
            updates.budget = Number(updates.budget);

            if (!Number.isFinite(updates.budget) || updates.budget < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Budget must be a valid non-negative number"
                });
            }
        }

        const current = await Project.findById(req.params.id);

        if (!current) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const start = updates.startDate || current.startDate;
        const end = updates.endDate || current.endDate;

        if (start && end && new Date(end) < new Date(start)) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        Object.assign(current, updates);
        await current.save();

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: current
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project",
            error: error.message
        });
    }
};

// Update project status
exports.updateProjectStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "planning",
            "active",
            "on-hold",
            "completed",
            "cancelled"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project status"
            });
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project status updated successfully",
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project status",
            error: error.message
        });
    }
};

// Update project progress
exports.updateProjectProgress = async (req, res) => {
    try {
        const progress = Number(req.body.progress);

        if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
            return res.status(400).json({
                success: false,
                message: "Progress must be an integer between 0 and 100"
            });
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { progress },
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project progress updated successfully",
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update project progress",
            error: error.message
        });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete project",
            error: error.message
        });
    }
};

// Get project statistics
exports.getProjectStatistics = async (req, res) => {
    try {
        const match = {};

        if (req.query.organization) {
            match.organization = req.query.organization;
        }

        const statistics = await Project.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                    averageProgress: { $avg: "$progress" },
                    totalBudget: { $sum: "$budget" }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve project statistics",
            error: error.message
        });
    }
};
