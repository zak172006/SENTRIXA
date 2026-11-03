
const Comment = require("../models/Comment");

const commentController = {

    // Create Comment
    createComment: async (req, res) => {
        try {
            const { content, project, milestone } = req.body;

            if (!content || !content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required"
                });
            }

            const comment = await Comment.create({
                content: content.trim(),
                project,
                milestone: milestone || null,
                user: req.user._id
            });

            const populatedComment = await Comment.findById(comment._id)
                .populate("user", "name email")
                .populate("project")
                .populate("milestone");

            return res.status(201).json({
                success: true,
                message: "Comment created successfully",
                data: populatedComment
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create comment",
                error: error.message
            });
        }
    },

    // Get Project Comments
    getProjectComments: async (req, res) => {
        try {
            const comments = await Comment.find({
                project: req.params.projectId
            })
                .populate("user", "name email")
                .populate("milestone")
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: comments.length,
                data: comments
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve comments",
                error: error.message
            });
        }
    },

    // Update Comment
    updateComment: async (req, res) => {
        try {
            const { content } = req.body;

            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found"
                });
            }

            if (comment.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to update this comment"
                });
            }

            if (!content || !content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Comment content is required"
                });
            }

            comment.content = content.trim();
            await comment.save();

            return res.status(200).json({
                success: true,
                message: "Comment updated successfully",
                data: comment
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to update comment",
                error: error.message
            });
        }
    },

    // Delete Comment
    deleteComment: async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);

            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: "Comment not found"
                });
            }

            if (comment.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to delete this comment"
                });
            }

            await comment.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Comment deleted successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete comment",
                error: error.message
            });
        }
    }

};

module.exports = commentController;
