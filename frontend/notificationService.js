// SENTRIXA - Notification Service

const Notification = require("../models/Notification");

const notificationService = {

    // Create Notification
    createNotification: async (data) => {
        try {
            const notification = await Notification.create({
                user: data.user,
                title: data.title,
                message: data.message,
                type: data.type || "info",
                isRead: false
            });

            return notification;

        } catch (error) {
            throw new Error("Failed to create notification: " + error.message);
        }
    },

    // Get User Notifications
    getUserNotifications: async (userId) => {
        try {
            return await Notification.find({
                user: userId
            }).sort({ createdAt: -1 });

        } catch (error) {
            throw new Error("Failed to retrieve notifications: " + error.message);
        }
    },

    // Mark Notification As Read
    markAsRead: async (notificationId, userId) => {
        try {
            const notification = await Notification.findOneAndUpdate(
                {
                    _id: notificationId,
                    user: userId
                },
                {
                    isRead: true
                },
                {
                    new: true
                }
            );

            return notification;

        } catch (error) {
            throw new Error("Failed to update notification: " + error.message);
        }
    },

    // Mark All Notifications As Read
    markAllAsRead: async (userId) => {
        try {
            return await Notification.updateMany(
                { user: userId },
                { isRead: true }
            );

        } catch (error) {
            throw new Error("Failed to update notifications: " + error.message);
        }
    },

    // Delete Notification
    deleteNotification: async (notificationId, userId) => {
        try {
            return await Notification.findOneAndDelete({
                _id: notificationId,
                user: userId
            });

        } catch (error) {
            throw new Error("Failed to delete notification: " + error.message);
        }
    },

    // Count Unread Notifications
    countUnread: async (userId) => {
        try {
            return await Notification.countDocuments({
                user: userId,
                isRead: false
            });

        } catch (error) {
            throw new Error("Failed to count notifications: " + error.message);
        }
    }

};

module.exports = notificationService;