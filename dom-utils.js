// SENTRIXA - DOM Utilities

class SentrixaDOM {

    static select(selector, parent = document) {
        return parent.querySelector(selector);
    }

    static selectAll(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    }

    static create(tag, attributes = {}, content = "") {

        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {

            if (key === "className") {
                element.className = value;
            } else if (key === "textContent") {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }

        });

        element.textContent = content || element.textContent;

        return element;
    }

    static show(element) {
        if (element) {
            element.hidden = false;
        }
    }

    static hide(element) {
        if (element) {
            element.hidden = true;
        }
    }

    static toggle(element, className) {
        if (element) {
            return element.classList.toggle(className);
        }

        return false;
    }

    static remove(element) {
        if (element) {
            element.remove();
        }
    }

    static on(element, event, callback) {
        if (element) {
            element.addEventListener(event, callback);
        }
    }

}

console.log("SENTRIXA DOM Utilities Initialized");