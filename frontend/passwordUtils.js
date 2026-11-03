// SENTRIXA - Password Security Utilities

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

const passwordUtils = {

    async hashPassword(password) {
        if (!password || typeof password !== "string") {
            throw new Error("Invalid password");
        }

        return await bcrypt.hash(password, SALT_ROUNDS);
    },

    async comparePassword(password, hashedPassword) {
        if (!password || !hashedPassword) {
            return false;
        }

        return await bcrypt.compare(
            password,
            hashedPassword
        );
    },

    validatePassword(password) {
        if (typeof password !== "string") {
            return false;
        }

        return (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password)
        );
    }

};

module.exports = passwordUtils;