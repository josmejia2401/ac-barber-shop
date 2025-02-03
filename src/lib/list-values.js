export const documentTypes = [
    {
        id: 1,
        name: 'Cédula de ciudadanía'
    },
    {
        id: 2,
        name: 'Tarjeta de identidad'
    },
    {
        id: 3,
        name: 'Registro civil'
    },
    {
        id: 4,
        name: 'NIT'
    },
    {
        id: 5,
        name: 'Otro'
    }
];

export function findDocumentTypeById(id) {
    return documentTypes.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}



export const status = [
    {
        id: 1,
        name: 'ACTIVO'
    },
    {
        id: 2,
        name: 'INACTIVO'
    },
    {
        id: 3,
        name: 'FINALIZADO'
    },
    {
        id: 4,
        name: 'PENDIENTE'
    },
    {
        id: 5,
        name: 'POTENCIAL'
    },
    {
        id: 6,
        name: 'PERDIDO'
    }
];

export function findStatusById(id) {
    return status.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}

export function buildAndGetClassStatus(recordStatus) {
    const key = findStatusById(recordStatus).id;
    switch (key) {
        case 1:
            return "badge bg-success";
        case 2:
            return "badge bg-secondary";
        case 3:
            return "badge bg-warning";
        case 4:
            return "badge bg-danger";
        default:
            break;
    }
    return null;
}






export const phase = [
    {
        id: 1,
        name: 'ANÁLISIS'
    },
    {
        id: 2,
        name: 'DISEÑO'
    },
    {
        id: 3,
        name: 'DESARROLLO'
    },
    {
        id: 4,
        name: 'PRUEBAS'
    },
    {
        id: 5,
        name: 'IMPLEMENTACIÓN'
    },
    {
        id: 6,
        name: 'MANTENIMIENTO'
    }
];

export function findPhaseById(id) {
    return phase.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}

export function buildAndGetClassPhase(recordStatus) {
    const key = findPhaseById(recordStatus).id;
    switch (key) {
        case 1:
            return "badge bg-success";
        case 2:
            return "badge bg-secondary";
        case 3:
            return "badge bg-warning";
        case 4:
            return "badge bg-danger";
        default:
            break;
    }
    return null;
}







// TODO: Eliminar
export const languages = [
    {
        id: 1,
        name: 'Python'
    },
    {
        id: 2,
        name: 'JavaScript'
    },
    {
        id: 3,
        name: 'Java'
    },
    {
        id: 4,
        name: 'C'
    },
    {
        id: 5,
        name: 'C++'
    },
    {
        id: 6,
        name: 'C#'
    },
    {
        id: 7,
        name: 'TypeScript'
    },
    {
        id: 8,
        name: 'SQL'
    },
    {
        id: 9,
        name: 'Swift'
    },
    {
        id: 10,
        name: 'Go (Golang)'
    },
    {
        id: 11,
        name: 'PHP'
    },
    {
        id: 12,
        name: 'Rust'
    },
    {
        id: 13,
        name: 'Otro'
    },
    {
        id: 99,
        name: 'Ninguna'
    }
];

export function findLanguagesById(id) {
    return languages.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}


export const technologies = [
    {
        id: 1,
        name: 'BD Relacional (MySQL, PostgreSQL, Etc)'
    },
    {
        id: 2,
        name: 'BD NoSql (MongoDB, DynamoDB, Etc)'
    },
    {
        id: 3,
        name: 'Redis'
    },
    {
        id: 4,
        name: 'Cloud (AWS, Azure, Etc)'
    },
    {
        id: 5,
        name: 'React'
    },
    {
        id: 6,
        name: 'Node.js'
    },
    {
        id: 7,
        name: 'Spring boot'
    },
    {
        id: 8,
        name: 'Flask'
    },
    {
        id: 9,
        name: 'Next.js'
    },
    {
        id: 10,
        name: 'Angular'
    },
    {
        id: 11,
        name: 'Django'
    },
    {
        id: 12,
        name: 'ASP.NET CORE'
    },
    {
        id: 13,
        name: 'Otro'
    },
    {
        id: 99,
        name: 'Ninguna'
    }
];

export function findTechnologiesById(id) {
    return technologies.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}



export const itemsType = [
    {
        id: 1,
        name: 'Bug'
    },
    {
        id: 2,
        name: 'Feature'
    },
    {
        id: 3,
        name: 'Issue'
    },
    {
        id: 4,
        name: 'Task'
    }
];

export function findItemTypeById(id) {
    return itemsType.filter(p => p.id === Number(id || 0))[0] || { id: 0, name: " " };
}