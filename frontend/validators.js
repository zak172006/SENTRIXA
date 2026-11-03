// SENTRIXA - Input Validation System

const validators = {

    isRequired(value) {
        return (
            value !== undefined &&
            value !== null &&
            String(value).trim().length > 0
        );
    },

    isValidEmail(email) {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(String(email || "").trim());
    },

    isValidPassword(password) {
        if (typeof password !== "string") {
            return false;
        }

        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password)
        );
    },

    isValidUsername(username) {
        if (typeof username !== "string") {
            return false;
        }

        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    },

    isValidId(id) {
        return Number.isInteger(Number(id)) &&
            Number(id) > 0;
    },

    isValidSeverity(severity) {
        const allowed = [
            "low",
            "medium",
            "high",
            "critical"
        ];

        return allowed.includes(severity);
    },

    isValidStatus(status) {
        const allowed = [
            "open",
            "investigating",
            "resolved",
            "closed"
        ];

        return allowed.includes(status);
    }

};

module.exports = validators;