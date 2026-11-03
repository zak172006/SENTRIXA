// SENTRIXA - Task Database Model

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },

    description: {
        type: String,
        default: "",
        trim: true
    },

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    priority: {
        type: String,
        enum: [
            "critical",
            "high",
            "medium",
            "low"
        ],
        default: "medium"
    },

    status: {
        type: String,
        enum: [
            "todo",
            "in_progress",
            "review",
            "completed",
            "cancelled"
        ],
        default: "todo"
    },

    dueDate: {
        type: Date,
        default: null
    },

    completedAt: {
        type: Date,
        default: null
    },

    tags: [{
        type: String,
        trim: true
    }],

    attachments: [{
        filename: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]

}, {
    timestamps: true
});

// Database indexes

taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ team: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;