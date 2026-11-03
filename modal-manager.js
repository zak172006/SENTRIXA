// SENTRIXA - Modal Manager

class SentrixaModal {

    constructor() {
        this.activeModal = null;
    }

    open(modalId) {

        const modal = document.getElementById(modalId);

        if (!modal) {
            console.error("Modal not found:", modalId);
            return false;
        }

        if (this.activeModal) {
            this.close();
        }

        modal.hidden = false;
        modal.classList.add("active");

        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("role", "dialog");

        this.activeModal = modal;

        document.body.classList.add("modal-open");

        const closeButton = modal.querySelector("[data-modal-close]");

        if (closeButton) {
            closeButton.focus();
        }

        return true;
    }

    close() {

        if (!this.activeModal) return;

        this.activeModal.classList.remove("active");
        this.activeModal.hidden = true;

        this.activeModal.removeAttribute("aria-modal");

        this.activeModal = null;

        document.body.classList.remove("modal-open");

    }

    init() {

        document.addEventListener("click", event => {

            const openButton = event.target.closest("[data-modal-open]");

            if (openButton) {
                this.open(openButton.dataset.modalOpen);
            }

            const closeButton = event.target.closest("[data-modal-close]");

            if (closeButton) {
                this.close();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                this.close();
            }

        });

    }

}

const sentrixaModal = new SentrixaModal();

document.addEventListener("DOMContentLoaded", () => {
    sentrixaModal.init();
});