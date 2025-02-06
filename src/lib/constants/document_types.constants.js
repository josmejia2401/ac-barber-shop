export const DOCUMENT_TYPES = [
    { code: "CC", name: "Cédula de Ciudadanía", cssClass: "badge bg-primary" },
    { code: "TI", name: "Tarjeta de Identidad", cssClass: "badge bg-secondary" },
    { code: "RC", name: "Registro Civil", cssClass: "badge bg-success" },
    { code: "CE", name: "Cédula de Extranjería", cssClass: "badge bg-danger" },
    { code: "PA", name: "Pasaporte", cssClass: "badge bg-warning" },
    { code: "NIT", name: "Número de Identificación Tributaria", cssClass: "badge bg-info" },
    { code: "PPT", name: "Permiso por Protección Temporal", cssClass: "badge bg-light" },
    { code: "DNI", name: "Documento Nacional de Identidad", cssClass: "badge bg-dark" },
    { code: "PEP", name: "Permiso Especial de Permanencia", cssClass: "badge bg-light" }
];
export function getDocumentTypeFromList(value) {
    return DOCUMENT_TYPES.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}