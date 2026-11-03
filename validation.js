// SENTRIXA - Form Validation Manager

class SentrixaValidation {

    static isEmpty(value) {
        return value === null ||
            value === undefined ||
            String(value).trim() === "";
    }

    static isEmail(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(String(email).trim());
    }

    static isStrongPassword(password) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            .test(String(password));
    }

    static isPhone(phone) {
        return /^\+?[0-9\s\-()]{7,20}$/.test(String(phone).trim());
    }

    static minLength(value, length) {
        return String(value).length >= length;
    }

    static maxLength(value, length) {
        return String(value).length <= length;
    }

    static isNumber(value) {
        return value !== "" && Number.isFinite(Number(value));
    }

    static validate(data, rules) {

        const errors = {};

        Object.entries(rules).forEach(([field, validations]) => {

            const value = data[field];

            validations.forEach(rule => {

                if (rule.type === "required" &&
                    this.isEmpty(value)) {
                    errors[field] = rule.message;
                }

                if (rule.type === "email" &&
                    !this.isEmail(value)) {
                    errors[field] = rule.message;
                }

                if (rule.type === "minLength" &&
                    !this.minLength(value, rule.value)) {
                    errors[field] = rule.message;
                }

                if (rule.type === "strongPassword" &&
                    !this.isStrongPassword(value)) {
                    errors[field] = rule.message;
                }

            });

        });

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };

    }

}

console.log("SENTRIXA Validation Manager Initialized");