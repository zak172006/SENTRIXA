// SENTRIXA - System Constants

const APP_NAME = "SENTRIXA";

const APP_VERSION = "1.0.0";

const USER_ROLES = {
    SUPER_ADMIN: "super_admin",
    ADMIN: "admin",
    SECURITY_ANALYST: "security_analyst",
    VIEWER: "viewer"
};

const ALERT_SEVERITY = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical"
};

const INCIDENT_STATUS = {
    OPEN: "open",
    INVESTIGATING: "investigating",
    RESOLVED: "resolved",
    CLOSED: "closed"
};

module.exports = {
    APP_NAME,
    APP_VERSION,
    USER_ROLES,
    ALERT_SEVERITY,
    INCIDENT_STATUS
};