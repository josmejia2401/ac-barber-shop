export const CONTRACT_TYPES = [
    { code: "IND", name: "Contrato a Término Indefinido" },
    { code: "TF", name: "Contrato a Término Fijo" },
    { code: "OBR", name: "Contrato de Obra o Labor" },
    { code: "PS", name: "Contrato de Prestación de Servicios" },
    { code: "APR", name: "Contrato de Aprendizaje" },
    { code: "PAR", name: "Contrato a Tiempo Parcial" }
];

export function getContractTypesFromList(value) {
    return CONTRACT_TYPES.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}