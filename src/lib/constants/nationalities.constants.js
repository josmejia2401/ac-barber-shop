export const NATIONALITIES = [
    { code: "CO", name: "Colombiano/a", cssClass: "badge bg-dark" },
    { code: "VE", name: "Venezolano/a", cssClass: "badge bg-dark" },
    { code: "EC", name: "Ecuatoriano/a", cssClass: "badge bg-dark" },
    { code: "PE", name: "Peruano/a", cssClass: "badge bg-dark" },
    { code: "BR", name: "Brasileño/a", cssClass: "badge bg-dark" },
    { code: "AR", name: "Argentino/a", cssClass: "badge bg-dark" },
    { code: "CL", name: "Chileno/a", cssClass: "badge bg-dark" },
    { code: "MX", name: "Mexicano/a", cssClass: "badge bg-dark" },
    { code: "ES", name: "Español/a", cssClass: "badge bg-dark" },
    { code: "US", "name": "Estadounidense", cssClass: "badge bg-dark" },
    { code: "FR", name: "Francés/Francesa", cssClass: "badge bg-dark" },
    { code: "DE", name: "Alemán/Alemana", cssClass: "badge bg-dark" },
    { code: "IT", name: "Italiano/a", cssClass: "badge bg-dark" },
    { code: "CN", name: "Chino/a", cssClass: "badge bg-dark" },
    { code: "JP", name: "Japonés/Japonesa", cssClass: "badge bg-dark" }
];

export function getNationalityFromList(value) {
    return NATIONALITIES.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}