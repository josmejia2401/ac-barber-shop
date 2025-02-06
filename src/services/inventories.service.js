import { axiosInstance } from './fetch.service.js'
import api from './api.constants';
import { buildAndThrowNewError, buildDefaultHeaders } from '../lib/auth.js';
import DateUtil from '../lib/date.js';

export const createItem = async (payload) => {
    try {
        return new Promise((resolveOuter) => {
            setTimeout(() => {
                resolveOuter({
                    code: 200,
                    message: 'Successful operation',
                    lastEvaluatedKey: undefined,
                    data: {
                        "id": 1234567,
                        "name": "Laptop Dell XPS 13",
                        "categoryId": "ELECTRONICS",
                        "description": "Laptop ultradelgada con pantalla táctil de 13 pulgadas y procesador Intel i7.",
                        "realPrice": 950.00,
                        "buyerPrice": 1200.99,
                        "stock": 15,
                        "supplierId": "S001",
                        "sku": "DEL-XPS13-2025",
                        "location": "A1",
                        "statusId": "AVAILABLE",
                        "tags": ["Tecnología", "Portátil", "Dell"]
                    }
                });
            }, 2000);
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}

export const findItemById = async (id) => {
    try {
        return new Promise((resolveOuter) => {
            resolveOuter({
                code: 200,
                message: 'Successful operation',
                lastEvaluatedKey: undefined,
                data: {
                    "id": 12345,
                    "firstName": "Juan",
                    "lastName": "Pérez",
                    "birthdate": DateUtil.currentDateToFormat3(),
                    "createdAt": DateUtil.currentDateToISO(),
                    "statusId": "ACT",
                    "genderId": "M",
                    "nationalityId": "CO",
                    "maritalStatusId": "S",
                    "documentTypeId": "CC",
                    "documentNumber": "123456",
                    "contactInformation": {
                        "email": "juan.perez@example.com",
                        "phone": "+573105397699",
                        "address": "Av. Siempre Viva 123, Ciudad, País",
                        "corporateEmail": ""
                    },
                    "employmentInformation": {
                        "position": "", //Puesto o cargo.
                        "department": "",
                        "dateHiring": "", //Fecha de contratacion
                        "typeContract": "", //Tipo de contrato (indefinido, temporal, prácticas, etc.).
                        "directBoss": "" //Jefe directo (para asignar jerarquías).
                    },
                    "bankingInformation": {
                        "bankAccountNumber": "2345566",
                        "bankId": "00",
                        "accountTypeId": "01"
                    },
                    "additionalInformation": {
                        "description": ""
                    },
                    "accessSecurityInformation": {
                        "username": "",
                        "password": "",
                        "accessLevel": "USER"
                    }
                }
            });
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}

export const filterItems = async (payload) => {
    try {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: 'Successful operation',
                    lastEvaluatedKey: { id: 1 },
                    data: [
                        {
                            "id": 12345,
                            "firstName": "Juan",
                            "lastName": "Pérez",
                            "birthdate": DateUtil.currentDateToFormat3(),
                            "createdAt": DateUtil.currentDateToISO(),
                            "statusId": "ACT",
                            "genderId": "M",
                            "nationalityId": "CO",
                            "maritalStatusId": "S",
                            "documentTypeId": "CC",
                            "documentNumber": "123456",
                            "contactInformation": {
                                "email": "juan.perez@example.com",
                                "phone": "+573105397699",
                                "address": "Av. Siempre Viva 123, Ciudad, País",
                                "corporateEmail": ""
                            },
                            "employmentInformation": {
                                "position": "", //Puesto o cargo.
                                "department": "",
                                "dateHiring": "", //Fecha de contratacion
                                "typeContract": "", //Tipo de contrato (indefinido, temporal, prácticas, etc.).
                                "directBoss": "" //Jefe directo (para asignar jerarquías).
                            },
                            "bankingInformation": {
                                "bankAccountNumber": "2345566",
                                "bankId": "00",
                                "accountTypeId": "01"
                            },
                            "additionalInformation": {
                                "description": ""
                            },
                            "accessSecurityInformation": {
                                "username": "",
                                "password": "",
                                "accessLevel": "USER"
                            }
                        }
                    ]
                })
            }, 2000)
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}


export const updateItemById = async (id, payload) => {
    try {
        return new Promise((resolveOuter) => {
            setTimeout(() => {
                resolveOuter({
                    code: 200,
                    message: 'Successful operation',
                    lastEvaluatedKey: undefined,
                    data: {
                        "id": 12345,
                        "firstName": "Juan",
                        "lastName": "Pérez",
                        "birthdate": DateUtil.currentDateToFormat3(),
                        "createdAt": DateUtil.currentDateToISO(),
                        "statusId": "ACT",
                        "genderId": "M",
                        "nationalityId": "CO",
                        "maritalStatusId": "S",
                        "documentTypeId": "CC",
                        "documentNumber": "123456",
                        "contactInformation": {
                            "email": "juan.perez@example.com",
                            "phone": "+573105397699",
                            "address": "Av. Siempre Viva 123, Ciudad, País",
                            "corporateEmail": ""
                        },
                        "employmentInformation": {
                            "position": "", //Puesto o cargo.
                            "department": "",
                            "dateHiring": "", //Fecha de contratacion
                            "typeContract": "", //Tipo de contrato (indefinido, temporal, prácticas, etc.).
                            "directBoss": "" //Jefe directo (para asignar jerarquías).
                        },
                        "bankingInformation": {
                            "bankAccountNumber": "2345566",
                            "bankId": "00",
                            "accountTypeId": "01"
                        },
                        "additionalInformation": {
                            "description": ""
                        },
                        "accessSecurityInformation": {
                            "username": "",
                            "password": "",
                            "accessLevel": "USER"
                        }
                    }
                });
            }, 2000);
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}


export const deleteItemById = async (id) => {
    try {
        return new Promise((resolveOuter) => {

            setTimeout(() => {
                resolveOuter({
                    code: 200,
                    message: 'Successful operation',
                    lastEvaluatedKey: undefined,
                    data: {
                        "id": 12345,
                        "firstName": "Juan",
                        "lastName": "Pérez",
                        "birthdate": DateUtil.currentDateToFormat3(),
                        "createdAt": DateUtil.currentDateToISO(),
                        "statusId": "ACT",
                        "genderId": "M",
                        "nationalityId": "CO",
                        "maritalStatusId": "S",
                        "documentTypeId": "CC",
                        "documentNumber": "123456",
                        "contactInformation": {
                            "email": "juan.perez@example.com",
                            "phone": "+573105397699",
                            "address": "Av. Siempre Viva 123, Ciudad, País",
                            "corporateEmail": ""
                        },
                        "employmentInformation": {
                            "position": "", //Puesto o cargo.
                            "department": "",
                            "dateHiring": "", //Fecha de contratacion
                            "typeContract": "", //Tipo de contrato (indefinido, temporal, prácticas, etc.).
                            "directBoss": "" //Jefe directo (para asignar jerarquías).
                        },
                        "bankingInformation": {
                            "bankAccountNumber": "2345566",
                            "bankId": "00",
                            "accountTypeId": "01"
                        },
                        "additionalInformation": {
                            "description": ""
                        },
                        "accessSecurityInformation": {
                            "username": "",
                            "password": "",
                            "accessLevel": "USER"
                        }
                    }
                });
            }, 2000);
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}
