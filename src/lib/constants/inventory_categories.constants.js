export const INVENTARY_CATEGORIES = [
    {
        code: "ELECTRONICS",
        name: "Electrónica",
        description: "Productos electrónicos como computadoras, smartphones, etc.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "FURNITURE",
        name: "Mobiliario",
        description: "Muebles de oficina, sillas, escritorios, etc.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "CLOTHING",
        name: "Ropa",
        description: "Artículos de ropa y accesorios.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "FOOD",
        name: "Alimentos",
        description: "Productos alimenticios y bebidas.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "TOYS",
        name: "Juguetes",
        description: "Juguetes y productos para niños.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "BOOKS",
        name: "Libros",
        description: "Libros y material educativo.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "TOOLS",
        name: "Herramientas",
        description: "Herramientas para reparaciones y mantenimiento.",
        cssClass: "badge bg-secondary"
    },
    {
        code: "HOME_APPLIANCES",
        name: "Electrodomésticos",
        description: "Electrodomésticos para uso en el hogar, como lavadoras, refrigeradores, etc.",
        cssClass: "badge bg-secondary"
    }
];

export function getInventaryStatusFromList(value) {
    return INVENTARY_CATEGORIES.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}