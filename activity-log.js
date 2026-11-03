// SENTRIXA - Frontend Activity Logger

class ActivityLogger {

    constructor() {
        this.storageKey = "sentrixa_activity_logs";
        this.maxLogs = 200;
    }

    log(action, details = {}) {

        const logs = this.getLogs();

        const entry = {
            id: this.generateId(),
            action,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        logs.unshift(entry);

        if (logs.length > this.maxLogs) {
            logs.length = this.maxLogs;
        }

        try {
            localStorage.setItem(
                this.storageKey,
                JSON.stringify(logs)
            );
        } catch (error) {
            console.error("SENTRIXA Activity Log Error:", error);
        }

        console.log("SENTRIXA Activity:", entry);

        return entry;
    }

    getLogs() {

        try {
            const data = localStorage.getItem(this.storageKey);

            return data ? JSON.parse(data) : [];

        } catch (error) {
            console.error("Unable to read activity logs:", error);
            return [];
        }

    }

    getRecentLogs(limit = 20) {
        return this.getLogs().slice(0, limit);
    }

    clearLogs() {

        localStorage.removeItem(this.storageKey);

        return true;
    }

    generateId() {

        return "ACT-" +
            Date.now().toString(36).toUpperCase() +
            "-" +
            Math.random().toString(36).substring(2, 8).toUpperCase();

    }

}

const sentrixaActivityLog = new ActivityLogger();