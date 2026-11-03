// SENTRIXA - Environment Configuration

const requiredVariables = [
    "JWT_SECRET"
];

function validateEnvironment() {

    const missingVariables = requiredVariables.filter(
        variable => !process.env[variable]
    );

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing environment variables: ${missingVariables.join(", ")}`
        );
    }

    if (process.env.JWT_SECRET.length < 32) {
        throw new Error(
            "JWT_SECRET must be at least 32 characters long"
        );
    }

    return true;
}

module.exports = {
    validateEnvironment
};