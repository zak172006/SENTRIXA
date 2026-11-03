// SENTRIXA - Subscription Controller

const Subscription = require("../models/Subscription");

const subscriptionController = {

    // Create Subscription
    createSubscription: async (req, res, next) => {
        try {
            const {
                plan,
                price,
                billingCycle,
                features
            } = req.body;

            if (!plan || price === undefined || price < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Valid plan and price are required"
                });
            }

            const subscription = await Subscription.create({
                plan,
                price,
                billingCycle,
                features,
                user: req.user.id,
                status: "pending"
            });

            return res.status(201).json({
                success: true,
                message: "Subscription created successfully",
                data: subscription
            });

        } catch (error) {
            next(error);
        }
    },

    // Get My Subscription
    getMySubscriptions: async (req, res, next) => {
        try {
            const subscriptions = await Subscription.find({
                user: req.user.id
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: subscriptions.length,
                data: subscriptions
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Subscription By ID
    getSubscriptionById: async (req, res, next) => {
        try {
            const subscription = await Subscription.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    message: "Subscription not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: subscription
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Subscription
    updateSubscription: async (req, res, next) => {
        try {
            const allowedFields = [
                "plan",
                "billingCycle",
                "features"
            ];

            const updates = {};

            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });

            const subscription = await Subscription.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.id
                },
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    message: "Subscription not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Subscription updated successfully",
                data: subscription
            });

        } catch (error) {
            next(error);
        }
    },

    // Cancel Subscription
    cancelSubscription: async (req, res, next) => {
        try {
            const subscription = await Subscription.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.user.id
                },
                {
                    $set: {
                        status: "cancelled",
                        cancelledAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!subscription) {
                return res.status(404).json({
                    success: false,
                    message: "Subscription not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Subscription cancelled successfully",
                data: subscription
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = subscriptionController;