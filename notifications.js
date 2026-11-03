// SENTRIXA - Notification Manager

class NotificationManager {

    constructor() {
        this.notifications = [];
    }

    show(message, type = "info", duration = 4000) {

        const container = this.getContainer();

        const notification = document.createElement("div");

        notification.className = `sentrixa-notification ${type}`;

        notification.setAttribute("role", "alert");

        notification.textContent = message;

        container.appendChild(notification);

        this.notifications.push(notification);

        requestAnimationFrame(() => {
            notification.classList.add("show");
        });

        setTimeout(() => {
            this.remove(notification);
        }, duration);

    }

    getContainer() {

        let container = document.querySelector(
            "#sentrixa-notifications"
        );

        if (!container) {

            container = document.createElement("div");

            container.id = "sentrixa-notifications";

            container.setAttribute("aria-live", "polite");

            document.body.appendChild(container);

        }

        return container;

    }

    remove(notification) {

        notification.classList.remove("show");

        setTimeout(() => {

            notification.remove();

            this.notifications = this.notifications.filter(
                item => item !== notification
            );

        }, 300);

    }

    success(message) {
        this.show(message, "success");
    }

    error(message) {
        this.show(message, "error");
    }

    warning(message) {
        this.show(message, "warning");
    }

    info(message) {
        this.show(message, "info");
    }

}

const sentrixaNotifications = new NotificationManager();