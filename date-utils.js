// SENTRIXA - Date Utilities

class SentrixaDateUtils {

    static now() {
        return new Date();
    }

    static format(date, locale = "en-US") {
        return new Date(date).toLocaleString(locale);
    }

    static formatDate(date, locale = "en-US") {
        return new Date(date).toLocaleDateString(locale);
    }

    static formatTime(date, locale = "en-US") {
        return new Date(date).toLocaleTimeString(locale);
    }

    static timeAgo(date) {

        const seconds = Math.floor(
            (Date.now() - new Date(date).getTime()) / 1000
        );

        if (!Number.isFinite(seconds) || seconds < 0) {
            return "Just now";
        }

        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 }
        ];

        for (const interval of intervals) {

            const count = Math.floor(
                seconds / interval.seconds
            );

            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
            }

        }

        return "Just now";
    }

    static isToday(date) {

        const value = new Date(date);
        const today = new Date();

        return value.toDateString() === today.toDateString();
    }

    static isValid(date) {
        return !Number.isNaN(new Date(date).getTime());
    }

}

console.log("SENTRIXA Date Utilities Initialized");