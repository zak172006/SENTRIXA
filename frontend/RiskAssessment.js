const mongoose = require("mongoose");

const riskAssessmentSchema = new mongoose.Schema(
    {
        assessmentId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        description: {
            type: String,
            trim: true,
            maxlength: 3000
        },

        assessmentType: {
            type: String,
            enum: [
                "network",
                "application",
                "infrastructure",
                "data",
                "operational",
                "compliance",
                "general"
            ],
            default: "general"
        },

        target: {
            type: String,
            required: true,
            trim: true
        },

        riskLevel: {
            type: String,
            enum: ["critical", "high", "medium", "low"],
            default: "medium"
        },

        likelihood: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },

        impact: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },

        riskScore: {
            type: Number,
            min: 1,
            max: 25,
            default: 9
        },

        status: {
            type: String,
            enum: [
                "pending",
                "in_progress",
                "completed",
                "reviewed",
                "cancelled"
            ],
            default: "pending"
        },

        identifiedRisks: [
            {
                title: {
                    type: String,
                    required: true
                },

                description: String,

                severity: {
                    type: String,
                    enum: ["critical", "high", "medium", "low"],
                    default: "medium"
                },

                likelihood: {
                    type: Number,
                    min: 1,
                    max: 5,
                    default: 3
                },

                impact: {
                    type: Number,
                    min: 1,
                    max: 5,
                    default: 3
                },

                mitigation: String,

                status: {
                    type: String,
                    enum: ["open", "mitigated", "accepted", "closed"],
                    default: "open"
                }
            }
        ],

        recommendations: [
            {
                type: String,
                trim: true
            }
        ],

        assessedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        assessmentDate: {
            type: Date,
            default: Date.now
        },

        reviewDate: Date,

        nextReviewDate: Date,

        notes: {
            type: String,
            maxlength: 5000
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

riskAssessmentSchema.index({ riskLevel: 1, status: 1 });
riskAssessmentSchema.index({ assessedBy: 1 });
riskAssessmentSchema.index({ assessmentDate: -1 });

riskAssessmentSchema.pre("validate", function () {
    this.riskScore = this.likelihood * this.impact;

    if (this.riskScore >= 20) {
        this.riskLevel = "critical";
    } else if (this.riskScore >= 15) {
        this.riskLevel = "high";
    } else if (this.riskScore >= 8) {
        this.riskLevel = "medium";
    } else {
        this.riskLevel = "low";
    }
});

module.exports = mongoose.model(
    "RiskAssessment",
    riskAssessmentSchema
);