// SENTRIXA - System Logger

const fs = require("fs");
const path = require("path");

const LOG_DIRECTORY = path.join(__dirname, "logs");

if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
}

const LOG_FILE = path.join(LOG_DIRECTORY, "application.log");

function writeLog(level, message, details = null) {

    const logEntry = {
        application: "SENTRIXA",
        level,
        message,
        details,
        timestamp: new Date().toISOString()
    };

    const formattedLog = JSON.stringify(logEntry);

    console.log(formattedLog);

    fs.appendFile(
        LOG_FILE,
        formattedLog + "\n",
        (error) => {
            if (error) {
                console.error("Failed to write log:", error.message);
            }
        }
    );
}

const logger = {
    info(message, details = null) {
        writeLog("INFO", message, details);
    },

    warning(message, details = null) {
        writeLog("WARNING", message, details);
    },

    error(message, details = null) {
        writeLog("ERROR", message, details);
    },

    security(message, details = null) {
        writeLog("SECURITY", message, details);
    }
};

module.exports = logger;