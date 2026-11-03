// SENTRIXA - Team Database Model

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },

    description: {
        type: String,
        default: ""
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        role: {
            type: String,
            enum: [
                "owner",
                "admin",
                "analyst",
                "viewer"
            ],
            default: "viewer"
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],

    status: {
        type: String,
        enum: [
            "active",
            "inactive",
            "archived"
        ],
        default: "active"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

teamSchema.index({ owner: 1 });
teamSchema.index({ "members.user": 1 });
teamSchema.index({ status: 1 });

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;