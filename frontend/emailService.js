// SENTRIXA - Email Service

const nodemailer = require("nodemailer");

const emailService = {

    // Create Email Transporter
    createTransporter: () => {

        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",

            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

    },

    // Send Email
    sendEmail: async ({ to, subject, text, html }) => {

        try {

            if (!to || !subject) {
                throw new Error("Recipient and subject are required");
            }

            const transporter = emailService.createTransporter();

            const result = await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to,
                subject,
                text,
                html
            });

            return {
                success: true,
                messageId: result.messageId
            };

        } catch (error) {

            throw new Error(
                "Email sending failed: " + error.message
            );

        }

    },

    // Send Security Alert Email
    sendSecurityAlert: async (email, alert) => {

        return await emailService.sendEmail({

            to: email,

            subject: "SENTRIXA Security Alert",

            text: `
Security Alert

Title: ${alert.title}

Description: ${alert.description || "No description provided"}

Severity: ${alert.severity || "Unknown"}

Please review your security dashboard.
            `

        });

    },

    // Send Password Reset Email
    sendPasswordReset: async (email, resetLink) => {

        return await emailService.sendEmail({

            to: email,

            subject: "SENTRIXA - Password Reset",

            html: `
                <div style="font-family:Arial;padding:20px">
                    <h2>SENTRIXA Password Reset</h2>

                    <p>You requested to reset your password.</p>

                    <a href="${resetLink}"
                       style="background:#2563eb;color:white;
                       padding:12px 20px;text-decoration:none;
                       border-radius:6px">

                       Reset Password

                    </a>

                    <p>If you did not request this, ignore this email.</p>
                </div>
            `

        });

    }

};

module.exports = emailService;