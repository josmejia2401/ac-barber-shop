export const ACCOUNT_TYPES = [
    { code: "01", name: "Cuenta de Ahorros", cssClass: "badge bg-primary" },
    { code: "02", name: "Cuenta Corriente", cssClass: "badge bg-secondary" },
    { code: "03", name: "Cuenta de Nómina", cssClass: "badge bg-success" },
    { code: "04", name: "Cuenta de Pensiones", cssClass: "badge bg-danger" },
    { code: "05", name: "Depósito Electrónico", cssClass: "badge bg-warning" },
    { code: "06", name: "Cuenta AFC (Ahorro para el Fomento de la Construcción)", cssClass: "badge bg-info" },
    { code: "07", name: "Cuenta CDT (Certificado de Depósito a Término)", cssClass: "badge bg-light" },
    { code: "08", name: "Fiducuenta (Cuenta de Fideicomiso)", cssClass: "badge bg-dark" }
];

export function getAccountTypeFromList(value) {
    return ACCOUNT_TYPES.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}