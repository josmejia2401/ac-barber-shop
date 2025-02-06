export const INVENTARY_STATUS = [
    {
        code: "AVAILABLE",
        name: "Disponible",
        cssClass: "badge bg-success"
    },
    {
        code: "OUT_OF_STOCK",
        name: "Agotado",
        cssClass: "badge bg-secondary"
    },
    {
        code: "BACKORDER",
        name: "Pedido Pendiente",
        cssClass: "badge bg-primary"
    },
    {
        code: "DISCONTINUED",
        name: "Descontinuado",
        cssClass: "badge bg-light"
    },
    {
        code: "DAMAGED",
        name: "Dañado",
        cssClass: "badge bg-danger"
    },
    {
        code: "ON_HOLD",
        name: "En Espera",
        cssClass: "badge bg-info"
    },
    {
        code: "PENDING_INSPECTION",
        name: "Pendiente Inspección",
        cssClass: "badge bg-dark"
    }
];

export function getInventaryStatusFromList(value) {
    return INVENTARY_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}