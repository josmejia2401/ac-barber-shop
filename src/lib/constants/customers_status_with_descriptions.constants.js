export const CUSTOMERS_STATUS = [
    {
        code: "ACT",
        name: "Activo",
        description: "El cliente está actualmente activo y tiene una relación comercial en curso con la empresa.",
        cssClass: "badge bg-success text-white"
    },
    {
        code: "INACT",
        name: "Inactivo",
        description: "El cliente no tiene interacciones recientes y no está realizando compras o utilizando servicios.",
        cssClass: "badge bg-secondary text-white"
    },
    {
        code: "PEND",
        name: "Pendiente",
        description: "El cliente está en proceso de ser evaluado o está a la espera de una acción para continuar la relación.",
        cssClass: "badge bg-danger text-white"
    },
    {
        code: "CLOSE",
        name: "Cerrado",
        description: "La relación comercial con el cliente se ha terminado por alguna razón, como una cancelación o finalización.",
        cssClass: "badge bg-dark text-white"
    },
    {
        code: "SUSP",
        name: "Suspendido",
        description: "La cuenta del cliente ha sido suspendida temporalmente debido a situaciones específicas, como impagos o violación de políticas.",
        cssClass: "badge bg-warning text-white"
    },
    {
        code: "OPP",
        name: "Oportunidad",
        description: "El cliente ha mostrado interés en un producto o servicio y existe una posibilidad concreta de venta.",
        cssClass: "badge bg-light text-white"
    },
    {
        code: "ELI",
        name: "Eliminado",
        description: "El usuario ha sido eliminado permanentemente del sistema.",
        cssClass: "badge bg-dark text-danger"
    }
];

export function getCustomersStatusFromList(value) {
    return CUSTOMERS_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}