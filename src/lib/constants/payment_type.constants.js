export const PAYMENT_TYPE = [
    { code: "TB", name: "Transferencias Bancarias", description: "", cssClass: "badge bg-dark" },
    { code: "PE", name: "Pago en Efectivo", description: "", cssClass: "badge bg-dark" },
    { code: "CB", name: "Cheque Bancario", description: ".", cssClass: "badge bg-dark" },
    { code: "PPBD", name: "Plataformas de Pago y Billeteras Digitales", description: "", cssClass: "badge bg-dark" },
    { code: "PM", name: "Pagos Mixtos (Salario + Beneficios en Especie)", description: "", cssClass: "badge bg-dark" }
];

export function getPaymentTypeFromList(value) {
    return PAYMENT_TYPE.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}