function replaceEmptyObjects(obj) {
    if (obj && typeof obj === 'object' && (Object.keys(obj).length === 0 || obj.required !== undefined)) {
        return "";
    }
    if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, replaceEmptyObjects(value)])
        );
    }
    return obj;
}

export function transformPayload(payload) {
    return replaceEmptyObjects(payload);
}

export function findSchemaByName(key, validationSchema) {
    const parentKeys = Object.keys(validationSchema);
    for (const parentKey of parentKeys) {
        const value = validationSchema[parentKey];
        if (typeof value === 'object' && value.id === key) {
            return value;
        } else if (typeof value === 'object' && value.id === key) {
            return value;
        } else if (typeof value === 'object') {
            const result = findSchemaByName(key, value);
            if (result) {
                return result;
            }
        }
    }
    return "";
}

export function findValueByName(key, payload) {
    const parentKeys = Object.keys(payload);
    for (const parentKey of parentKeys) {
        const value = payload[parentKey];
        if (typeof value === 'object') {
            const result = findSchemaByName(key, value);
            if (result) {
                return result;
            }
        } else if (parentKey === key) {
            return value;
        }
    }
    return;
}

export function updateValueByName(key, value, payload) {
    const parentKeys = Object.keys(payload);
    for (const parentKey of parentKeys) {
        if (typeof payload[parentKey] === 'object') {
            const result = updateValueByName(key, value, payload[parentKey]);
            if (result) {
                payload[parentKey] = result;
                return payload;
            }
        } else if (parentKey === key) {
            payload[parentKey] = value;
            return payload;
        }
    }
    return;
}