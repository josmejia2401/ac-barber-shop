export default class Validator {

    static validate(value, schema = {
        name: '',
        placeholder: '',
        id: '',
        type: '',
        required: false,
        minLength: 0,
        maxLength: 0,
        min: 0,
        max: 0,
        pattern: '',
        size: 0,
        select: false,
        multiple: false,
        rows: 0,
        cols: 0,
        email: false
    }) {
        if (schema.required) {
            if (value === undefined || value === null || value === '' || value.length === 0) {
                return `${schema.name} es requerido.`;
            }
        }
        if (Array.isArray(value)) {
            if (schema.minLength !== undefined && schema.minLength >= 0) {
                if (value.length < schema.minLength) {
                    return `${schema.name} requiere una longitud mínima de ${schema.minLength}.`;
                }
            }
            if (schema.minLength !== undefined && schema.maxLength >= 0) {
                if (value.length > schema.maxLength) {
                    return `${schema.name} requiere una longitud máxima de ${schema.maxLength}.`;
                }
            }
        } else {
            if (schema.minLength !== undefined && schema.minLength >= 0) {
                if (String(value).length < schema.minLength) {
                    return `${schema.name} requiere una longitud mínima de ${schema.minLength}.`;
                }
            }
            if (schema.minLength !== undefined && schema.maxLength >= 0) {
                if (String(value).length > schema.maxLength) {
                    return `${schema.name} requiere una longitud máxima de ${schema.maxLength}.`;
                }
            }
        }

        if (schema.email !== undefined && schema.email === true) {
            if (value && !String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                return `${schema.name} no es válido.`;
            }
        }
        return "";
    }
}