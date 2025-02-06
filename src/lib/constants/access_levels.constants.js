export const ACCESS_LEVELS = [
    { code: "ADMIN", name: "Administrador", description: "El usuario tiene acceso completo al sistema, incluyendo la gestión de usuarios, configuraciones y datos.", cssClass: "badge bg-dark" },
    { code: "USER", name: "Usuario", description: "El usuario tiene acceso básico al sistema, limitado a funcionalidades específicas según las reglas de negocio.", cssClass: "badge bg-dark" },
    { code: "MOD", name: "Moderador", description: "El usuario tiene privilegios para gestionar contenidos, como aprobar o eliminar publicaciones o gestionar ciertos recursos.", cssClass: "badge bg-dark" },
    { code: "GUEST", name: "Invitado", description: "El usuario tiene acceso limitado y solo puede visualizar ciertas partes del sistema sin realizar modificaciones.", cssClass: "badge bg-dark" },
    { code: "SUP", name: "Soporte", description: "El usuario tiene permisos para ayudar a otros usuarios con problemas técnicos, sin acceso completo a la administración del sistema.", cssClass: "badge bg-dark" },
    { code: "MANAGER", name: "Gerente", description: "El usuario tiene permisos para gestionar equipos, proyectos o tareas dentro de un área específica, pero no puede gestionar la configuración global del sistema.", cssClass: "badge bg-dark" }
];

export function getAccessLevelFromList(value) {
    return ACCESS_LEVELS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}