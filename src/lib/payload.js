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
        if (parentKey && typeof parentKey === 'object') {
            return findSchemaByName(key, validationSchema[parentKey]);
        } else if (parentKey === key) {
            return validationSchema[parentKey];
        }
    }
}

export function findValueByName(key, payload) {
    const parentKeys = Object.keys(payload);
    for (const parentKey of parentKeys) {
        if (parentKey && typeof parentKey === 'object') {
            return findSchemaByName(key, payload[parentKey]);
        } else if (parentKey === key) {
            return payload[parentKey];
        }
    }
}

export function updateValueByName(key, value, payload) {
    const parentKeys = Object.keys(payload);
    for (const parentKey of parentKeys) {
        if (parentKey && typeof parentKey === 'object') {
            return findSchemaByName(key, payload[parentKey]);
        } else if (parentKey === key) {
            payload[parentKey] = value;
            break;
        }
    }
    return payload;
}