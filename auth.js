// SENTRIXA - Authentication Manager

class SentrixaAuth {

    constructor() {
        this.userKey = "sentrixa_user";
        this.tokenKey = "sentrixa_token";
    }

    isLoggedIn() {
        return Boolean(localStorage.getItem(this.tokenKey));
    }

    getCurrentUser() {

        try {
            const user = localStorage.getItem(this.userKey);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("User Data Error:", error);
            return null;
        }

    }

    saveSession(user, token) {

        if (!user || !token) {
            throw new Error("User and token are required");
        }

        localStorage.setItem(
            this.userKey,
            JSON.stringify(user)
        );

        localStorage.setItem(this.tokenKey, token);

    }

    async login(email, password) {

        try {

            const response = await sentrixaAPI.post(
                "/auth/login",
                { email, password }
            );

            if (response.token && response.user) {

                this.saveSession(
                    response.user,
                    response.token
                );

                sentrixaNotifications.success(
                    "Login successful"
                );

                sentrixaActivityLog.log("USER_LOGIN");

                return response;

            }

            throw new Error("Invalid login response");

        } catch (error) {

            sentrixaNotifications.error(
                error.message || "Login failed"
            );

            throw error;

        }

    }

    logout() {

        const user = this.getCurrentUser();

        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);

        sentrixaActivityLog.log("USER_LOGOUT", {
            user: user?.email || "Unknown"
        });

        window.location.href = "login.html";

    }

}

const sentrixaAuth = new SentrixaAuth();