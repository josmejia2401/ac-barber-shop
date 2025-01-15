export function formatDateToView(date) {
    return date.replace("T", " ").split(".")[0];
}

export function formatTextToView(text, max = 16) {
    if (String(text).length > max) {
        return text.substring(0, max).concat("...");
    }
    return text;
}
