
const Invitation = require("../models/Invitation");
const crypto = require("crypto");

// Create invitation
exports.createInvitation = async (req, res) => {
    try {
        const { email, role, organization, expiresInDays } = req.body;

        if (!email || !role || !organization) {
            return res.status(400).json({
                success: false,
                message: "Email, role and organization are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingInvitation = await Invitation.findOne({
            email: normalizedEmail,
            organization,
            status: "pending",
            expiresAt: { $gt: new Date() }
        });

        if (existingInvitation) {
            return res.status(409).json({
                success: false,
                message: "A pending invitation already exists"
            });
        }

        const days = Math.min(
            30,
            Math.max(1, Number(expiresInDays) || 7)
        );

        const token = crypto.randomBytes(32).toString("hex");

        const invitation = await Invitation.create({
            email: normalizedEmail,
            role,
            organization,
            tokenHash: crypto
                .createHash("sha256")
                .update(token)
                .digest("hex"),
            status: "pending",
            invitedBy: req.user?._id,
            expiresAt: new Date(
                Date.now() + days * 24 * 60 * 60 * 1000
            )
        });

        res.status(201).json({
            success: true,
            message: "Invitation created successfully",
            data: {
                id: invitation._id,
                email: invitation.email,
                role: invitation.role,
                organization: invitation.organization,
                expiresAt: invitation.expiresAt
            },
            invitationToken: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create invitation",
            error: error.message
        });
    }
};

// Get organization invitations
exports.getInvitations = async (req, res) => {
    try {
        const filter = {};

        if (req.query.organization) {
            filter.organization = req.query.organization;
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        const invitations = await Invitation.find(filter)
            .select("-tokenHash")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: invitations.length,
            data: invitations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve invitations",
            error: error.message
        });
    }
};

// Get invitation by ID
exports.getInvitationById = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id)
            .select("-tokenHash");

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }

        res.status(200).json({
            success: true,
            data: invitation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve invitation",
            error: error.message
        });
    }
};

// Accept invitation
exports.acceptInvitation = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Invitation token is required"
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const invitation = await Invitation.findOne({
            tokenHash,
            status: "pending",
            expiresAt: { $gt: new Date() }
        });

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired invitation"
            });
        }

        invitation.status = "accepted";
        invitation.acceptedAt = new Date();

        await invitation.save();

        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            data: {
                id: invitation._id,
                email: invitation.email,
                role: invitation.role,
                organization: invitation.organization
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to accept invitation",
            error: error.message
        });
    }
};

// Cancel invitation
exports.cancelInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findOneAndUpdate(
            {
                _id: req.params.id,
                status: "pending"
            },
            {
                status: "cancelled"
            },
            {
                new: true
            }
        ).select("-tokenHash");

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Pending invitation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Invitation cancelled successfully",
            data: invitation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel invitation",
            error: error.message
        });
    }
};

// Delete invitation
exports.deleteInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findByIdAndDelete(
            req.params.id
        );

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: "Invitation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Invitation deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete invitation",
            error: error.message
        });
    }
};

// Remove expired invitations
exports.removeExpiredInvitations = async (req, res) => {
    try {
        const result = await Invitation.updateMany(
            {
                status: "pending",
                expiresAt: { $lte: new Date() }
            },
            {
                status: "expired"
            }
        );

        res.status(200).json({
            success: true,
            message: "Expired invitations processed",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to process expired invitations",
            error: error.message
        });
    }
};
