// SENTRIXA - Device Controller

const Device = require("../models/Device");

// Register Device
exports.createDevice = async (req, res) => {
    try {
        const device = await Device.create({
            ...req.body,
            user: req.user?._id
        });

        res.status(201).json({
            success: true,
            message: "Device registered successfully",
            data: device
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to register device",
            error: error.message
        });
    }
};

// Get All Devices
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: devices.length,
            data: devices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch devices",
            error: error.message
        });
    }
};

// Get Device By ID
exports.getDeviceById = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        res.status(200).json({
            success: true,
            data: device
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch device",
            error: error.message
        });
    }
};

// Update Device
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Device updated successfully",
            data: device
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update device",
            error: error.message
        });
    }
};

// Delete Device
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Device deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete device",
            error: error.message
        });
    }
};