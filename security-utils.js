// SENTRIXA - Security Utilities

class SentrixaSecurity {

    static generateSecureId() {

        if (window.crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        return Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

    }

    static sanitizeText(value) {

        const element = document.createElement("div");

        element.textContent = String(value ?? "");

        return element.innerHTML;

    }

    static isValidURL(value) {

        try {

            const url = new URL(value);

            return ["http:", "https:"].includes(url.protocol);

        } catch {
            return false;
        }

    }

    static generateRandomToken(length = 32) {

        if (!Number.isInteger(length) || length < 16 || length > 128) {
            throw new Error("Token length must be between 16 and 128");
        }

        const bytes = new Uint8Array(length);

        crypto.getRandomValues(bytes);

        return Array.from(bytes)
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

    }

    static isSecureContext() {
        return window.isSecureContext;
    }

}

console.log("SENTRIXA Security Utilities Initialized");