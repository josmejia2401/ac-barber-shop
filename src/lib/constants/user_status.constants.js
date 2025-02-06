export const USER_STATUS = [
    { code: "ACT", name: "Activo", description: "El usuario tiene acceso completo y está utilizando el sistema normalmente.", cssClass: "badge bg-dark" },
    { code: "INACT", name: "Inactivo", description: "El usuario ha desactivado su cuenta o no ha interactuado con el sistema en un periodo largo.", cssClass: "badge bg-dark" },
    { code: "BLO", name: "Bloqueado", description: "El usuario ha sido bloqueado debido a violaciones de políticas, intentos fallidos de inicio de sesión, o actividades sospechosas.", cssClass: "badge bg-dark" },
    { code: "PEND", name: "Pendiente", description: "El usuario está esperando verificación o aprobación para activar su cuenta.", cssClass: "badge bg-dark" },
    { code: "ELI", name: "Eliminado", description: "El usuario ha sido eliminado permanentemente del sistema.", cssClass: "badge bg-dark" },
    { code: "SUSP", name: "Suspendido", description: "El acceso del usuario ha sido suspendido temporalmente por alguna razón administrativa o disciplinaria.", cssClass: "badge bg-dark" },
    { code: "TER", name: "Terminado", description: "El usuario ha terminado su relación con el sistema y su cuenta ha sido cerrada.", cssClass: "badge bg-dark" },
    { code: "NEW", name: "Nuevo", description: "El usuario acaba de registrarse y aún no ha completado la activación o el proceso inicial.", cssClass: "badge bg-dark" }
];

export function getUserStatusFromList(value) {
    return USER_STATUS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}