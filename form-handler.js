// SENTRIXA - Form Handler

class SentrixaFormHandler {

    constructor() {
        this.forms = new Map();
    }

    init() {

        document.querySelectorAll("form[data-sentrixa-form]")
            .forEach(form => this.register(form));

    }

    register(form) {

        if (!form || this.forms.has(form)) return;

        const handler = event => {
            this.handleSubmit(event, form);
        };

        form.addEventListener("submit", handler);

        this.forms.set(form, handler);

    }

    async handleSubmit(event, form) {

        event.preventDefault();

        if (!form.reportValidity()) return;

        const submitButton = form.querySelector(
            '[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
        }

        const formData = new FormData(form);

        const data = Object.fromEntries(formData.entries());

        try {

            const endpoint = form.dataset.endpoint;
            const method = (form.dataset.method || "POST").toUpperCase();

            if (!endpoint) {
                throw new Error("Form endpoint is missing");
            }

            const response = await sentrixaAPI.request(
                endpoint,
                {
                    method,
                    body: JSON.stringify(data)
                }
            );

            sentrixaNotifications.success(
                response.message || "Form submitted successfully"
            );

            sentrixaActivityLog.log("FORM_SUBMITTED", {
                form: form.id || "unnamed"
            });

            form.reset();

            return response;

        } catch (error) {

            sentrixaNotifications.error(error.message);

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    }

}

const sentrixaFormHandler = new SentrixaFormHandler();

document.addEventListener("DOMContentLoaded", () => {
    sentrixaFormHandler.init();
});