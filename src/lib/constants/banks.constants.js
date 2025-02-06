export const BANKS = [
    { "code": "00", "name": "Banco de la República", cssClass: "badge bg-dark" },
    { "code": "01", "name": "Banco de Bogotá", cssClass: "badge bg-dark" },
    { "code": "02", "name": "Banco Popular", cssClass: "badge bg-dark" },
    { "code": "06", "name": "Itaú Corpbanca Colombia S.A.", cssClass: "badge bg-dark" },
    { "code": "07", "name": "Bancolombia S.A.", cssClass: "badge bg-dark" },
    { "code": "09", "name": "Citibank Colombia", cssClass: "badge bg-dark" },
    { "code": "12", "name": "GNB Sudameris S.A.", cssClass: "badge bg-dark" },
    { "code": "13", "name": "BBVA Colombia", cssClass: "badge bg-dark" },
    { "code": "19", "name": "Colpatria", cssClass: "badge bg-dark" },
    { "code": "23", "name": "Banco de Occidente", cssClass: "badge bg-dark" },
    { "code": "32", "name": "Banco Caja Social BCSC S.A.", cssClass: "badge bg-dark" },
    { "code": "40", "name": "Banco Agrario de Colombia S.A.", cssClass: "badge bg-dark" },
    { "code": "51", "name": "Banco Davivienda S.A.", cssClass: "badge bg-dark" },
    { "code": "52", "name": "Banco AV Villas", cssClass: "badge bg-dark" },
    { "code": "53", "name": "Banco W S.A.", cssClass: "badge bg-dark" },
    { "code": "58", "name": "Banco Credifinanciera S.A.C.F", cssClass: "badge bg-dark" },
    { "code": "59", "name": "Bancamía", cssClass: "badge bg-dark" },
    { "code": "60", "name": "Banco Pichincha S.A.", cssClass: "badge bg-dark" },
    { "code": "61", "name": "Bancoomeva", cssClass: "badge bg-dark" },
    { "code": "62", "name": "CMR Falabella S.A.", cssClass: "badge bg-dark" },
    { "code": "63", "name": "Banco Finandina S.A.", cssClass: "badge bg-dark" },
    { "code": "65", "name": "Banco Santander de Negocios Colombia S.A.", cssClass: "badge bg-dark" },
    { "code": "66", "name": "Banco Cooperativo Coopcentral", cssClass: "badge bg-dark" },
    { "code": "67", "name": "Banco Compartir S.A.", cssClass: "badge bg-dark" },
    { "code": "69", "name": "Banco Serfinanza S.A.", cssClass: "badge bg-dark" }
];
export function getBankFromList(value) {
    return BANKS.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}