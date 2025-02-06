export const EMPLOYEE_STATUS = [
    { code: "ACT", name: "Activo", cssClass: "badge bg-success" },
    { code: "INA", name: "Inactivo", cssClass: "badge bg-warning" },
    { code: "SUS", name: "Suspendido", cssClass: "badge bg-info" },
    { code: "LIC", name: "Licencia", cssClass: "badge bg-secondary" },
    { code: "VAC", name: "Vacaciones", cssClass: "badge bg-primary" },
    { code: "DES", name: "Despedido", cssClass: "badge bg-danger" },
    { code: "REN", name: "Renunciado", cssClass: "badge bg-light" },
    { code: "PEN", name: "Pensionado", cssClass: "badge bg-dark" }
];

export function getEmployeeStatusFromList(value) {
    return EMPLOYEE_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}