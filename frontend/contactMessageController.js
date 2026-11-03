// SENTRIXA - Contact Message Controller

const ContactMessage = require("../models/ContactMessage");

// Create Contact Message
exports.createContactMessage = async (req, res) => {
    try {
        const message = await ContactMessage.create({
            ...req.body,
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"]
        });

        res.status(201).json({
            success: true,
            message: "Contact message sent successfully",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send contact message",
            error: error.message
        });
    }
};

// Get All Contact Messages
exports.getContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch contact messages",
            error: error.message
        });
    }
};

// Get Contact Message By ID
exports.getContactMessageById = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch contact message",
            error: error.message
        });
    }
};

// Update Contact Message
exports.updateContactMessage = async (req, res) => {
    try {
        const allowedUpdates = {
            status: req.body.status,
            reply: req.body.reply,
            isRead: req.body.isRead
        };

        Object.keys(allowedUpdates).forEach(key => {
            if (allowedUpdates[key] === undefined) {
                delete allowedUpdates[key];
            }
        });

        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            allowedUpdates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message updated successfully",
            data: message
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update contact message",
            error: error.message
        });
    }
};

// Delete Contact Message
exports.deleteContactMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(
            req.params.id
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete contact message",
            error: error.message
        });
    }
};