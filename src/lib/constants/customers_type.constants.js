export const CUSTOMERS_TYPE = [
    { code: "CP", name: "Cliente potencial", description: "", cssClass: "badge bg-dark" },
    { code: "CR", name: "Cliente recurrente", description: "", cssClass: "badge bg-dark" },
    { code: "CI", name: "Cliente inactivo", description: ".", cssClass: "badge bg-dark" },
    { code: "CVIP", name: "Cliente VIP", description: "", cssClass: "badge bg-dark" },
    { code: "CO", name: "OTRO", description: "", cssClass: "badge bg-dark" }
];

export function getCustomerTypeFromList(value) {
    return CUSTOMERS_TYPE.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}