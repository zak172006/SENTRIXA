// SENTRIXA - Storage Manager

class SentrixaStorage {

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage Save Error:", error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);

            return value !== null
                ? JSON.parse(value)
                : defaultValue;

        } catch (error) {
            console.error("Storage Read Error:", error);
            return defaultValue;
        }
    }

    remove(key) {
        localStorage.removeItem(key);
    }

    clear() {
        localStorage.clear();
    }

    exists(key) {
        return localStorage.getItem(key) !== null;
    }

    getAllKeys() {
        return Object.keys(localStorage);
    }

}

const sentrixaStorage = new SentrixaStorage();

console.log("SENTRIXA Storage Manager Initialized");