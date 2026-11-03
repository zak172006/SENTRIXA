// SENTRIXA - Theme Manager

class SentrixaTheme {

    constructor() {
        this.storageKey = "sentrixa_theme";
        this.defaultTheme = "dark";
    }

    init() {

        const savedTheme =
            localStorage.getItem(this.storageKey) ||
            this.defaultTheme;

        this.setTheme(savedTheme);

        this.createToggleButton();

    }

    setTheme(theme) {

        if (!["dark", "light"].includes(theme)) {
            return;
        }

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(this.storageKey, theme);

    }

    toggle() {

        const currentTheme =
            document.documentElement.getAttribute("data-theme") ||
            this.defaultTheme;

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        this.setTheme(newTheme);

        return newTheme;

    }

    createToggleButton() {

        const button = document.querySelector(
            "#theme-toggle"
        );

        if (!button) return;

        button.addEventListener("click", () => {

            const theme = this.toggle();

            button.textContent =
                theme === "dark" ? "☀️" : "🌙";

        });

    }

}

const sentrixaTheme = new SentrixaTheme();

document.addEventListener("DOMContentLoaded", () => {
    sentrixaTheme.init();
});