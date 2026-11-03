// SENTRIXA - Support Ticket Controller

const SupportTicket = require("../models/SupportTicket");

// Create Support Ticket
exports.createSupportTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.create({
            ...req.body,
            createdBy: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            data: ticket
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create support ticket",
            error: error.message
        });
    }
};

// Get All Support Tickets
exports.getSupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch support tickets",
            error: error.message
        });
    }
};

// Get Support Ticket By ID
exports.getSupportTicketById = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch support ticket",
            error: error.message
        });
    }
};

// Update Support Ticket
exports.updateSupportTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Support ticket updated successfully",
            data: ticket
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update support ticket",
            error: error.message
        });
    }
};

// Delete Support Ticket
exports.deleteSupportTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByIdAndDelete(
            req.params.id
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Support ticket deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete support ticket",
            error: error.message
        });
    }
};