export default class Validator {
    static #defaultSchema = {
        name: '',
        placeholder: '',
        id: '',
        type: 'text', // Tipo de campo (text, number, email, etc.)
        required: false,
        minLength: 0,
        maxLength: 0,
        min: 0,
        max: 0,
        pattern: '', // Expresión regular para validación
        size: 0, // Tamaño máximo en bytes (para archivos)
        select: false, // Si es un campo de selección
        multiple: false, // Si permite múltiples valores
        rows: 0, // Para textarea
        cols: 0, // Para textarea
        email: false, // Si es un campo de email
        customErrorMessage: '' // Mensaje de error personalizado
    };

    static #emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    static isEmpty(value) {
        if (value === undefined || value === null || value === "") {
            return true;
        }
        if (Array.isArray(value) && value.length === 0) {
            return true;
        }
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true;
        }
        return false;
    }

    static #validateRequired(value, config) {
        if (config.required && this.isEmpty(value)) {
            return config.customErrorMessage || `${config.name} es requerido.`;
        }
        return '';
    }

    static #validateLength(value, config) {
        const stringValue = String(value ?? '');
        const valueLength = Array.isArray(value) ? value.length : stringValue.length;

        if (!this.isEmpty(stringValue)) {
            if (config.minLength > 0 && valueLength < config.minLength) {
                return config.customErrorMessage || `${config.name} requiere una longitud mínima de ${config.minLength}.`;
            }
            if (config.maxLength > 0 && valueLength > config.maxLength) {
                return config.customErrorMessage || `${config.name} requiere una longitud máxima de ${config.maxLength}.`;
            }
        }
        return '';
    }

    static #validateEmail(value, config) {
        if (!this.isEmpty(value) && config.email && !this.#emailRegex.test(String(value).toLowerCase())) {
            return config.customErrorMessage || `${config.name} no es válido.`;
        }
        return '';
    }

    static #validateMinMax(value, config) {
        if (typeof value === 'number') {
            if (config.min !== undefined && value < config.min) {
                return config.customErrorMessage || `${config.name} debe ser mayor o igual a ${config.min}.`;
            }
            if (config.max !== undefined && value > config.max) {
                return config.customErrorMessage || `${config.name} debe ser menor o igual a ${config.max}.`;
            }
        }
        return '';
    }

    static #validatePattern(value, config) {
        if (!this.isEmpty(value) && config.pattern && !new RegExp(config.pattern).test(value)) {
            return config.customErrorMessage || `${config.name} no cumple con el formato requerido.`;
        }
        return '';
    }

    static #validateFileSize(value, config) {
        if (value instanceof File && config.size > 0 && value.size > config.size) {
            return config.customErrorMessage || `${config.name} excede el tamaño máximo permitido.`;
        }
        return '';
    }

    static validate(value, schema = {}) {
        const config = { ...this.#defaultSchema, ...schema };

        // Validaciones
        const errors = [
            this.#validateRequired(value, config),
            this.#validateLength(value, config),
            this.#validateEmail(value, config),
            this.#validateMinMax(value, config),
            this.#validatePattern(value, config),
            this.#validateFileSize(value, config)
        ].filter(error => error !== ''); // Filtra errores vacíos

        return errors; // Devuelve solo el listado de errores
    }
}