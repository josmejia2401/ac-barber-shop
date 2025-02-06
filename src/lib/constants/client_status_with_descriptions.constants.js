export const CLIENT_STATUS = [
    {
        code: "ACT",
        name: "Activo",
        description: "El cliente está actualmente activo y tiene una relación comercial en curso con la empresa."
    },
    {
        code: "INACT",
        name: "Inactivo",
        description: "El cliente no tiene interacciones recientes y no está realizando compras o utilizando servicios."
    },
    {
        code: "PEND",
        name: "Pendiente",
        description: "El cliente está en proceso de ser evaluado o está a la espera de una acción para continuar la relación."
    },
    {
        code: "CLOSE",
        name: "Cerrado",
        description: "La relación comercial con el cliente se ha terminado por alguna razón, como una cancelación o finalización."
    },
    {
        code: "SUSP",
        name: "Suspendido",
        description: "La cuenta del cliente ha sido suspendida temporalmente debido a situaciones específicas, como impagos o violación de políticas."
    },
    {
        code: "OPP",
        name: "Oportunidad",
        description: "El cliente ha mostrado interés en un producto o servicio y existe una posibilidad concreta de venta."
    }
];

export function getClientStatusFromList(value) {
    return CLIENT_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}