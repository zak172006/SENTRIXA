// SENTRIXA - Payment Controller

const Payment = require("../models/Payment");

const paymentController = {

    // Create Payment
    createPayment: async (req, res, next) => {
        try {
            const {
                amount,
                currency,
                paymentMethod,
                subscriptionId,
                description
            } = req.body;

            if (!amount || amount <= 0 || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    message: "Valid amount and payment method are required"
                });
            }

            const payment = await Payment.create({
                amount,
                currency: currency || "USD",
                paymentMethod,
                subscription: subscriptionId,
                description,
                user: req.user.id,
                status: "pending"
            });

            return res.status(201).json({
                success: true,
                message: "Payment record created successfully",
                data: payment
            });

        } catch (error) {
            next(error);
        }
    },

    // Get My Payments
    getMyPayments: async (req, res, next) => {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(
                100,
                Math.max(1, Number(req.query.limit) || 20)
            );

            const filter = {
                user: req.user.id
            };

            const payments = await Payment.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit);

            const total = await Payment.countDocuments(filter);

            return res.status(200).json({
                success: true,
                total,
                page,
                pages: Math.ceil(total / limit),
                data: payments
            });

        } catch (error) {
            next(error);
        }
    },

    // Get Payment By ID
    getPaymentById: async (req, res, next) => {
        try {
            const payment = await Payment.findOne({
                _id: req.params.id,
                user: req.user.id
            });

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: payment
            });

        } catch (error) {
            next(error);
        }
    },

    // Update Payment Status
    updatePaymentStatus: async (req, res, next) => {
        try {
            const allowedStatuses = [
                "pending",
                "processing",
                "completed",
                "failed",
                "refunded",
                "cancelled"
            ];

            const { status } = req.body;

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment status"
                });
            }

            const payment = await Payment.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        status,
                        updatedAt: new Date()
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Payment status updated successfully",
                data: payment
            });

        } catch (error) {
            next(error);
        }
    },

    // Delete Payment
    deletePayment: async (req, res, next) => {
        try {
            const payment = await Payment.findByIdAndDelete(
                req.params.id
            );

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Payment deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }

};

module.exports = paymentController;