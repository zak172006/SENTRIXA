// SENTRIXA - Authentication Controller

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {

    // Register new user
    register: async (req, res, next) => {
        try {
            const {
                name,
                email,
                password
            } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, email and password are required"
                });
            }

            const existingUser = await User.findOne({
                email: email.toLowerCase()
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = await User.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword
            });

            return res.status(201).json({
                success: true,
                message: "Account created successfully",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // Login user
    login: async (req, res, next) => {
        try {
            const {
                email,
                password
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select("+password");

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
                }
            );

            return res.status(200).json({
                success: true,
                message: "Login successful",
                token,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // Get current user
    getMe: async (req, res, next) => {
        try {
            const user = await User.findById(
                req.user.id
            ).select("-password");

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
    }

};

module.exports = authController;