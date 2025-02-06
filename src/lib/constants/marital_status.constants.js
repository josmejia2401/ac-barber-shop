export const MARITAL_STATUS = [
    { code: "S", name: "Soltero/a", cssClass: "badge bg-dark" },
    { code: "C", name: "Casado/a", cssClass: "badge bg-dark" },
    { code: "U", name: "Unión libre", cssClass: "badge bg-dark" },
    { code: "D", name: "Divorciado/a", cssClass: "badge bg-dark" },
    { code: "V", name: "Viudo/a", cssClass: "badge bg-dark" },
    { code: "NS", name: "Prefiero no decirlo", cssClass: "badge bg-dark" }
];

export function getMaritalStatusFromList(value) {
    return MARITAL_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}