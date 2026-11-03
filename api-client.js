// SENTRIXA - API Client

class SentrixaAPI {

    constructor() {
        this.baseURL = "http://localhost:5000/api";
        this.tokenKey = "sentrixa_token";
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    async request(endpoint, options = {}) {

        const token = this.getToken();

        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {

            const response = await fetch(
                `${this.baseURL}${endpoint}`,
                {
                    ...options,
                    headers
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || `API Error: ${response.status}`
                );
            }

            return data;

        } catch (error) {

            console.error("SENTRIXA API Error:", error);

            throw error;

        }

    }

    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: "DELETE"
        });
    }

}

const sentrixaAPI = new SentrixaAPI();