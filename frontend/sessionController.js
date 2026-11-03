
const Session = require("../models/Session");
const crypto = require("crypto");

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find()
            .select("-token")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve sessions",
            error: error.message
        });
    }
};

// Get current user's sessions
exports.getMySessions = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const sessions = await Session.find({
            user: req.user._id
        })
        .select("-token")
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve user sessions",
            error: error.message
        });
    }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .select("-token");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve session",
            error: error.message
        });
    }
};

// Create a new session
exports.createSession = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = crypto.randomBytes(48).toString("hex");

        const session = await Session.create({
            user: req.user._id,
            token,
            device: req.body.device || "Unknown device",
            ipAddress: req.ip,
            userAgent: req.get("user-agent") || "Unknown",
            expiresAt: req.body.expiresAt ||
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: "active"
        });

        res.status(201).json({
            success: true,
            message: "Session created successfully",
            data: {
                id: session._id,
                device: session.device,
                status: session.status,
                expiresAt: session.expiresAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create session",
            error: error.message
        });
    }
};

// Revoke a session
exports.revokeSession = async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { status: "revoked" },
            { new: true }
        ).select("-token");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Session revoked successfully",
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to revoke session",
            error: error.message
        });
    }
};

// Revoke all sessions except current
exports.revokeOtherSessions = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const currentSessionId = req.session?._id;

        const filter = {
            user: req.user._id,
            status: "active"
        };

        if (currentSessionId) {
            filter._id = { $ne: currentSessionId };
        }

        const result = await Session.updateMany(
            filter,
            { status: "revoked" }
        );

        res.status(200).json({
            success: true,
            message: "Other sessions revoked successfully",
            revokedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to revoke other sessions",
            error: error.message
        });
    }
};

// Delete expired sessions
exports.deleteExpiredSessions = async (req, res) => {
    try {
        const result = await Session.deleteMany({
            expiresAt: { $lt: new Date() }
        });

        res.status(200).json({
            success: true,
            message: "Expired sessions deleted",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete expired sessions",
            error: error.message
        });
    }
};
