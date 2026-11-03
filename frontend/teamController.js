// SENTRIXA - Team Controller

const Team = require("../models/Team");

const teamController = {

    // Create Team
    createTeam: async (req, res, next) => {
        try {
            const { name, description, members } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: "Team name is required"
                });
            }

            const team = await Team.create({
                name,
                description,
                members: members || [],
                createdBy: req.user.id
            });

            return res.status(201).json({
                success: true,
                message: "Team created successfully",
                data: team
            });

        } catch (error) {
            next(error);
        }
    },

    // Get All Teams
    getAllTeams: async (req, res, next) => {
        try {
            const teams = await Team.find({
                createdBy: req.user.id
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: teams.length,
                data: teams
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Team By ID
    getTeamById: async (req, res, next) => {
        try {
            const team = await Team.findOne({
                _id: req.params.id,
                createdBy: req.user.id
            });

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "Team not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: team
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Team
    updateTeam: async (req, res, next) => {
        try {
            const allowedFields = [
                "name",
                "description",
                "members"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const team = await Team.findOneAndUpdate(
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

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "Team not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Team updated successfully",
                data: team
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Team
    deleteTeam: async (req, res, next) => {
        try {
            const team = await Team.findOneAndDelete({
                _id: req.params.id,
                createdBy: req.user.id
            });

            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: "Team not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Team deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = teamController;