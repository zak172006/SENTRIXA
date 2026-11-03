// SENTRIXA - Encryption Service

const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";

const encryptionService = {

    // Get Encryption Key
    getEncryptionKey: () => {

        const key = process.env.ENCRYPTION_KEY;

        if (!key || !/^[a-fA-F0-9]{64}$/.test(key)) {
            throw new Error(
                "A valid 64-character hexadecimal ENCRYPTION_KEY is required"
            );
        }

        return Buffer.from(key, "hex");
    },

    // Encrypt Data
    encrypt: (data) => {

        try {

            if (data === undefined || data === null) {
                throw new Error("Data is required");
            }

            const iv = crypto.randomBytes(12);

            const cipher = crypto.createCipheriv(
                ALGORITHM,
                encryptionService.getEncryptionKey(),
                iv
            );

            const encrypted = Buffer.concat([
                cipher.update(String(data), "utf8"),
                cipher.final()
            ]);

            const authTag = cipher.getAuthTag();

            return {
                algorithm: ALGORITHM,
                iv: iv.toString("hex"),
                authTag: authTag.toString("hex"),
                encryptedData: encrypted.toString("hex")
            };

        } catch (error) {

            throw new Error(
                "Encryption failed: " + error.message
            );

        }

    },

    // Decrypt Data
    decrypt: (encryptedObject) => {

        try {

            if (
                !encryptedObject ||
                encryptedObject.algorithm !== ALGORITHM ||
                !encryptedObject.iv ||
                !encryptedObject.authTag ||
                !encryptedObject.encryptedData
            ) {
                throw new Error("Invalid encrypted data");
            }

            const decipher = crypto.createDecipheriv(
                ALGORITHM,
                encryptionService.getEncryptionKey(),
                Buffer.from(encryptedObject.iv, "hex")
            );

            decipher.setAuthTag(
                Buffer.from(encryptedObject.authTag, "hex")
            );

            const decrypted = Buffer.concat([
                decipher.update(
                    Buffer.from(
                        encryptedObject.encryptedData,
                        "hex"
                    )
                ),
                decipher.final()
            ]);

            return decrypted.toString("utf8");

        } catch (error) {

            throw new Error(
                "Decryption failed: " + error.message
            );

        }

    },

    // Generate Secure Random Token
    generateToken: (length = 32) => {

        if (
            !Number.isInteger(length) ||
            length < 16 ||
            length > 128
        ) {
            throw new Error("Invalid token length");
        }

        return crypto.randomBytes(length).toString("hex");

    },

    // Generate SHA256 Hash
    generateHash: (data) => {

        if (data === undefined || data === null) {
            throw new Error("Data is required");
        }

        return crypto
            .createHash("sha256")
            .update(String(data))
            .digest("hex");

    }

};

module.exports = encryptionService;