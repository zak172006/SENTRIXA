
const Milestone = require("../models/Milestone");

// Get all milestones
exports.getMilestones = async (req, res) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

        const filter = {};

        if (req.query.project) {
            filter.project = req.query.project;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const [milestones, total] = await Promise.all([
            Milestone.find(filter)
                .populate("project", "name status")
                .sort({ dueDate: 1 })
                .skip((page - 1) * limit)
                .limit(limit),

            Milestone.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: milestones.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: milestones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve milestones",
            error: error.message
        });
    }
};

// Get milestone by ID
exports.getMilestoneById = async (req, res) => {
    try {
        const milestone = await Milestone.findById(req.params.id)
            .populate("project", "name status");

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        res.status(200).json({
            success: true,
            data: milestone
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve milestone",
            error: error.message
        });
    }
};

// Create milestone
exports.createMilestone = async (req, res) => {
    try {
        const {
            title,
            description,
            project,
            dueDate,
            startDate,
            priority
        } = req.body;

        if (!title || !project || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Title, project and due date are required"
            });
        }

        const due = new Date(dueDate);

        if (Number.isNaN(due.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid due date"
            });
        }

        if (startDate) {
            const start = new Date(startDate);

            if (
                Number.isNaN(start.getTime()) ||
                due < start
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Due date must be valid and after start date"
                });
            }
        }

        const milestone = await Milestone.create({
            title: title.trim(),
            description,
            project,
            startDate,
            dueDate: due,
            priority: priority || "medium",
            status: "pending",
            progress: 0,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Milestone created successfully",
            data: milestone
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create milestone",
            error: error.message
        });
    }
};

// Update milestone
exports.updateMilestone = async (req, res) => {
    try {
        const allowedFields = [
            "title",
            "description",
            "startDate",
            "dueDate",
            "priority"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.title !== undefined) {
            updates.title = String(updates.title).trim();

            if (!updates.title) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty"
                });
            }
        }

        const milestone = await Milestone.findById(req.params.id);

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        const start = updates.startDate || milestone.startDate;
        const due = updates.dueDate || milestone.dueDate;

        if (
            start &&
            due &&
            new Date(due) < new Date(start)
        ) {
            return res.status(400).json({
                success: false,
                message: "Due date cannot be before start date"
            });
        }

        Object.assign(milestone, updates);
        await milestone.save();

        res.status(200).json({
            success: true,
            message: "Milestone updated successfully",
            data: milestone
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update milestone",
            error: error.message
        });
    }
};

// Update milestone status
exports.updateMilestoneStatus = async (req, res) => {
    try {
        const allowedStatuses = [
            "pending",
            "in-progress",
            "completed",
            "delayed",
            "cancelled"
        ];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid milestone status"
            });
        }

        const updates = { status };

        if (status === "completed") {
            updates.progress = 100;
            updates.completedAt = new Date();
        }

        const milestone = await Milestone.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Milestone status updated successfully",
            data: milestone
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update milestone status",
            error: error.message
        });
    }
};

// Update milestone progress
exports.updateMilestoneProgress = async (req, res) => {
    try {
        const progress = Number(req.body.progress);

        if (
            !Number.isInteger(progress) ||
            progress < 0 ||
            progress > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Progress must be an integer between 0 and 100"
            });
        }

        const updates = {
            progress,
            status: progress === 100 ? "completed" :
                progress > 0 ? "in-progress" : "pending"
        };

        if (progress === 100) {
            updates.completedAt = new Date();
        }

        const milestone = await Milestone.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Milestone progress updated successfully",
            data: milestone
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update milestone progress",
            error: error.message
        });
    }
};

// Delete milestone
exports.deleteMilestone = async (req, res) => {
    try {
        const milestone = await Milestone.findByIdAndDelete(
            req.params.id
        );

        if (!milestone) {
            return res.status(404).json({
                success: false,
                message: "Milestone not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Milestone deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete milestone",
            error: error.message
        });
    }
};

// Get milestone statistics
exports.getMilestoneStatistics = async (req, res) => {
    try {
        const filter = {};

        if (req.query.project) {
            filter.project = req.query.project;
        }

        const statistics = await Milestone.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                    averageProgress: { $avg: "$progress" }
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
            message: "Failed to retrieve milestone statistics",
            error: error.message
        });
    }
};
