export const COMMUNICATION_CHANNEL = [
    { code: "EM", name: "Email", description: "", cssClass: "badge bg-dark" },
    { code: "TL", name: "Teléfono", description: "", cssClass: "badge bg-dark" },
    { code: "WS", name: "WhatsApp", description: ".", cssClass: "badge bg-dark" },
    { code: "SMS", name: "SMS", description: "", cssClass: "badge bg-dark" },
    { code: "OT", name: "Otro", description: "", cssClass: "badge bg-dark" }
];

export function getCommunicationChannelFromList(value) {
    return COMMUNICATION_CHANNEL.filter(dt => dt.code === value)[0] || { code: "", name: "", cssClass: "badge bg-secondary" }
}