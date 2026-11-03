
const Permission = require("../models/Permission");

// Get all permissions
exports.getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: permissions.length,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve permissions",
            error: error.message
        });
    }
};

// Get permission by ID
exports.getPermissionById = async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        res.status(200).json({
            success: true,
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve permission",
            error: error.message
        });
    }
};

// Create permission
exports.createPermission = async (req, res) => {
    try {
        const { name, code, description, resource, actions } = req.body;

        if (!name || !code || !resource) {
            return res.status(400).json({
                success: false,
                message: "Name, code and resource are required"
            });
        }

        const existingPermission = await Permission.findOne({
            $or: [{ name }, { code }]
        });

        if (existingPermission) {
            return res.status(409).json({
                success: false,
                message: "Permission already exists"
            });
        }

        const permission = await Permission.create({
            name,
            code,
            description,
            resource,
            actions: Array.isArray(actions) ? actions : []
        });

        res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create permission",
            error: error.message
        });
    }
};

// Update permission
exports.updatePermission = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "description",
            "resource",
            "actions"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const permission = await Permission.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update permission",
            error: error.message
        });
    }
};

// Delete permission
exports.deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(
            req.params.id
        );

        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Permission deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete permission",
            error: error.message
        });
    }
};

// Search permissions
exports.searchPermissions = async (req, res) => {
    try {
        const search = String(req.query.search || "").trim();

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search term is required"
            });
        }

        const permissions = await Permission.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
                { resource: { $regex: search, $options: "i" } }
            ]
        }).limit(50);

        res.status(200).json({
            success: true,
            count: permissions.length,
            data: permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Permission search failed",
            error: error.message
        });
    }
};
