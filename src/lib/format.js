function convertUTCDateToLocalDate (date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds()));
}
export function formatDateToView(date) {
    date = convertUTCDateToLocalDate(new Date(date)).toISOString();
    return date.replace("T", " ").split(".")[0];
}

export function formatBirthdateToView(date) {
    date = convertUTCDateToLocalDate(new Date(date)).toISOString();
    return date.replace("T", " ").split(" ")[0];
}

export function formatTextToView(text, max = 16) {
    if (String(text).length > max) {
        return text.substring(0, max).concat("...");
    }
    return text;
}
