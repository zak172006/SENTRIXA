// SENTRIXA - User Controller

const User = require("../models/userModel");

const userController = {

    // Get all users
    getAllUsers: async (req, res, next) => {
        try {
            const users = await User.find()
                .select("-password")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: users.length,
                data: users
            });

        } catch (error) {
            next(error);
        }
    },

    // Get user by ID
    getUserById: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id)
                .select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: user
            });

        } catch (error) {
            next(error);
        }
    },

    // Update user
    updateUser: async (req, res, next) => {
        try {
            const allowedFields = [
                "name",
                "email",
                "phone",
                "avatar"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete user
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndDelete(
                req.params.id
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = userController;