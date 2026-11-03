// SENTRIXA - JWT Token Utilities

const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function getSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error(
            "JWT_SECRET must contain at least 32 characters"
        );
    }

    return secret;
}

const tokenUtils = {

    generateAccessToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            getSecret(),
            {
                expiresIn: ACCESS_TOKEN_EXPIRY,
                issuer: "SENTRIXA"
            }
        );
    },

    generateRefreshToken(user) {
        return jwt.sign(
            {
                id: user.id,
                tokenType: "refresh"
            },
            getSecret(),
            {
                expiresIn: REFRESH_TOKEN_EXPIRY,
                issuer: "SENTRIXA"
            }
        );
    },

    verifyToken(token) {
        return jwt.verify(
            token,
            getSecret(),
            {
                issuer: "SENTRIXA"
            }
        );
    }

};

module.exports = tokenUtils;