export const GENDERS = [
    { code: "M", name: "Masculino", cssClass: "badge bg-dark" },
    { code: "F", name: "Femenino", cssClass: "badge bg-dark" },
    { code: "NB", name: "No Binario", cssClass: "badge bg-dark" },
    { code: "OT", name: "Otro", cssClass: "badge bg-dark" },
    { code: "NS", name: "Prefiero no decirlo", cssClass: "badge bg-dark" }
];

export function getGenderFromList(value) {
    return GENDERS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}