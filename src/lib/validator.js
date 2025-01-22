export default class Validator {

    static validate(value, schema) {
        const errors = [];
        if (schema.required) {
            if (value === undefined || value === null || value === '' || value.length === 0) {
                errors.push(`${schema.name} es requerido.`);
            }
        }
        if (schema.minLength !== undefined && schema.minLength >= 0) {
            if (String(value).length < schema.minLength) {
                errors.push(`${schema.name} requiere una longitud mínima de ${schema.minLength}.`);
            }
        }
        if (schema.minLength !== undefined && schema.maxLength >= 0) {
            if (String(value).length > schema.maxLength) {
                errors.push(`${schema.name} requiere una longitud máxima de ${schema.maxLength}.`);
            }
        }
        if (schema.email !== undefined && schema.email === true) {
            if (value && !String(value)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                errors.push(`${schema.name} no es válido.`);
            }
        }
        return errors;
    }
}