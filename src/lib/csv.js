/**
 * Convierte un listado de datos en JSON a CSV.
 *
 * @param {Array<Object>} data - Arreglo de objetos en formato JSON.
 * @returns {string} El contenido CSV resultante.
 */
export function jsonToCsv(data) {
    if (!data || !data.length) {
        return "";
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Agrega la fila de cabeceras
    csvRows.push(headers.join(","));

    // Función para escapar valores que contengan comas, comillas o saltos de línea
    const escapeValue = (value) => {
        if (value == null) return "";
        let stringValue = value.toString();
        if (stringValue.includes('"')) {
            stringValue = stringValue.replace(/"/g, '""');
        }
        if (stringValue.search(/("|,|\n)/g) >= 0) {
            stringValue = `"${stringValue}"`;
        }
        return stringValue;
    };

    data.forEach(item => {
        const row = headers.map(header => escapeValue(item[header]));
        csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
}

/**
 * Descarga un contenido CSV como archivo.
 *
 * @param {string} csvContent - El contenido CSV que se desea descargar.
 * @param {string} [filename='data.csv'] - El nombre del archivo a descargar.
 */
export function downloadCSV(csvContent, filename = 'data.csv') {
    // Crea un Blob con el contenido CSV y el tipo MIME correspondiente
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    // Crea un enlace oculto y simula el clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    // Limpia el DOM y revoca el objeto URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Ejemplo de uso:
/*const jsonData = [
    { id: 1, nombre: "Juan", correo: "juan@example.com" },
    { id: 2, nombre: "María", correo: "maria@example.com" },
    { id: 3, nombre: "Pedro", correo: 'pedro, "el amigo"@example.com' }
];

// Convertir el JSON a CSV
const csvContent = jsonToCsv(jsonData);

// Iniciar la descarga del archivo CSV
//downloadCSV(csvContent, 'usuarios.csv');
*/

