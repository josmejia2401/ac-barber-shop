export function findValueByKey(payload, llave) {
    // Si el payload es un objeto
    if (typeof payload === 'object' && payload !== null) {
        // Si la llave está en el objeto, devuelve el valor
        if (llave in payload) {
            return payload[llave];
        }
        // Si no, recorre las propiedades del objeto
        for (let key in payload) {
            if (payload.hasOwnProperty(key)) {
                const resultado = findValueByKey(payload[key], llave);
                if (resultado !== undefined) {
                    return resultado;
                }
            }
        }
    }
    // Si el payload es una lista
    else if (Array.isArray(payload)) {
        // Recorre cada elemento de la lista
        for (let item of payload) {
            const resultado = findValueByKey(item, llave);
            if (resultado !== undefined) {
                return resultado;
            }
        }
    }
    // Si no es ni objeto ni lista, no se puede buscar más
    return undefined;
}

export function transformPayload(payload) {
    function replaceEmptyObjects(obj) {
        const keysToSkip = ['id', 'placeholder', 'type', 'required'];
        if (obj && typeof obj === 'object' && (Object.keys(obj).length === 0 || obj.required !== undefined)) {
            for (const objKey of Object.keys(obj)) {
                if (keysToSkip.includes(objKey)) {
                    return obj.type === 'number' ? 0 : "";
                }
            }
        }
        if (obj && typeof obj === 'object') {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, replaceEmptyObjects(value)])
            );
        }
        return obj;
    }
    return replaceEmptyObjects(payload);
}

export function updateValueByKey(payload, llave, nuevoValor) {
    // Si el payload es un objeto
    if (typeof payload === 'object' && payload !== null) {
        // Si la llave está en el objeto, actualiza el valor
        if (llave in payload) {
            payload[llave] = nuevoValor;
            return true; // Indica que se actualizó la llave
        }
        // Si no, recorre las propiedades del objeto
        for (let key in payload) {
            if (payload.hasOwnProperty(key)) {
                const actualizado = updateValueByKey(payload[key], llave, nuevoValor);
                if (actualizado) {
                    return true; // Si se actualizó, detén la búsqueda
                }
            }
        }
    }
    // Si el payload es una lista
    else if (Array.isArray(payload)) {
        // Recorre cada elemento de la lista
        for (let item of payload) {
            const actualizado = updateValueByKey(item, llave, nuevoValor);
            if (actualizado) {
                return true; // Si se actualizó, detén la búsqueda
            }
        }
    }
    // Si no se encontró la llave, retorna false
    return false;
}

export function updateJSON(destino, origen) {
    for (let key in origen) {
        // Si el valor es un objeto y existe en el destino, actualiza recursivamente
        if (origen[key] && typeof origen[key] === 'object' && !Array.isArray(origen[key])) {
            if (!destino[key]) destino[key] = {}; // Si no existe, crea el objeto
            updateJSON(destino[key], origen[key]);
        } else {
            // Si no es un objeto, copia el valor directamente
            destino[key] = origen[key];
        }
    }
    return destino;
}