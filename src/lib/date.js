
class DateUtil {

    /**
     * 
     * @returns '30/01/2025'
     */
    static currentDateToFormat1(date = new Date()) {
        return date.toJSON().slice(0, 10).split('-').reverse().join('/');
    }

    /**
     * 
     * @returns '2025/01/30'
     */
    static currentDateToFormat2(date = new Date()) {
        return date.toJSON().slice(0, 10).split('-').join('/');
    }

    /**
     * 
     * @returns '2025-01-30'
     */
    static currentDateToFormat3(date = new Date()) {
        return date.toJSON().slice(0, 10);
    }


    static currentDateToISO(date = new Date()) {
        return date.toISOString();
    }

    static isoToLocalDate(date = new Date()) {
        return new Date(date).toJSON().slice(0, 19).replace("T", " ");
    }

    static elapsedTime(fechaPasada) {
        const ahora = new Date(); // Fecha y hora actual
        const fecha = new Date(fechaPasada); // Convertir la fecha pasada a objeto Date
        const diferencia = ahora - fecha; // Diferencia en milisegundos
        // Convertir la diferencia a segundos, minutos, horas, días, meses y años
        const segundos = Math.floor(diferencia / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
        const meses = Math.floor(dias / 30);
        const años = Math.floor(meses / 12);
        // Lógica para determinar el mensaje
        if (segundos < 60) {
            return "hace un momento";
        } else if (minutos < 60) {
            if (minutos === 1) {
                return "hace 1 minuto";
            } else {
                return `hace ${minutos} minutos`;
            }
        } else if (horas < 24) {
            if (horas === 1) {
                return "hace 1 hora";
            } else {
                return `hace ${horas} horas`;
            }
        } else if (dias < 30) {
            if (dias === 1) {
                return "hace 1 día";
            } else {
                return `hace ${dias} días`;
            }
        } else if (meses < 12) {
            if (meses === 1) {
                return "hace 1 mes";
            } else {
                return `hace ${meses} meses`;
            }
        } else {
            if (años === 1) {
                return "hace 1 año";
            } else {
                return `hace ${años} años`;
            }
        }
    }
}

export default DateUtil;