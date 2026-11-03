// SENTRIXA - Task Controller

const Task = require("../models/Task");

const taskController = {

    // Create Task
    createTask: async (req, res, next) => {
        try {
            const {
                title,
                description,
                assignedTo,
                priority,
                dueDate
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Task title is required"
                });
            }

            const task = await Task.create({
                title,
                description,
                assignedTo,
                priority,
                dueDate,
                createdBy: req.user.id
            });

            return res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: task
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Tasks
    getAllTasks: async (req, res, next) => {
        try {
            const {
                status,
                priority,
                page = 1,
                limit = 20
            } = req.query;

            const filter = {
                createdBy: req.user.id
            };

            if (status) filter.status = status;
            if (priority) filter.priority = priority;

            const tasks = await Task.find(filter)
                .sort({ createdAt: -1 })
                .skip((Number(page) - 1) * Number(limit))
                .limit(Number(limit));

            const total = await Task.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: tasks
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Task By ID
    getTaskById: async (req, res, next) => {
        try {
            const task = await Task.findOne({
                _id: req.params.id,
                createdBy: req.user.id
            });

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: task
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Task
    updateTask: async (req, res, next) => {
        try {
            const allowedFields = [
                "title",
                "description",
                "assignedTo",
                "priority",
                "status",
                "dueDate"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const task = await Task.findOneAndUpdate(
                {
                    _id: req.params.id,
                    createdBy: req.user.id
                },
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: task
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Task
    deleteTask: async (req, res, next) => {
        try {
            const task = await Task.findOneAndDelete({
                _id: req.params.id,
                createdBy: req.user.id
            });

            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Task deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = taskController;