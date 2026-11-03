// SENTRIXA - Notification Controller

const Notification = require("../models/Notification");

const notificationController = {

    // Create Notification
    createNotification: async (req, res, next) => {
        try {
            const {
                userId,
                title,
                message,
                type,
                priority,
                link
            } = req.body;

            if (!userId || !title || !message) {
                return res.status(400).json({
                    success: false,
                    message: "User ID, title and message are required"
                });
            }

            const notification = await Notification.create({
                user: userId,
                title,
                message,
                type,
                priority,
                link
            });

            return res.status(201).json({
                success: true,
                message: "Notification created successfully",
                data: notification
            });

        } catch (error) {
            next(error);
        }
    },

    // Get User Notifications
    getMyNotifications: async (req, res, next) => {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(
                100,
                Math.max(1, Number(req.query.limit) || 20)
            );

            const filter = {
                user: req.user.id
            };

            const notifications = await Notification.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Notification.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page,
                pages: Math.ceil(total / limit),
                data: notifications
            });

        } catch (error) {
            next(error);
        }
    },

    // Mark Notification As Read
    markAsRead: async (req, res, next) => {
        try {
            const notification = await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.id
                },
                {
                    $set: {
                        isRead: true,
                        readAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Notification marked as read",
                data: notification
            });

        } catch (error) {
            next(error);
        }
    },

    // Mark All Notifications As Read
    markAllAsRead: async (req, res, next) => {
        try {
            await Notification.updateMany(
                {
                    user: req.user.id,
                    isRead: false
                },
                {
                    $set: {
                        isRead: true,
                        readAt: new Date()
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: "All notifications marked as read"
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Notification
    deleteNotification: async (req, res, next) => {
        try {
            const notification = await Notification.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });

            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Notification deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = notificationController;