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
                    metadata: {
                        totalScannedCount: 0,
                        totalItemsMatched: 0,
                        totalConsumedCapacity: 0,
                        lastEvaluatedKey: {
                            id: '...'
                        }
                    },
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

export const findItemById = async (id) => {
    try {
        return new Promise((resolveOuter) => {
            resolveOuter({
                code: 200,
                message: 'Successful operation',
                lastEvaluatedKey: undefined,
                data: {
                    "id": getRandomArbitrary(1, 100000),
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

function getRandomArbitrary(min, max) {
    return Math.trunc((Math.random() * (max - min) + min));
}

export const filterItems = async (payload) => {
    try {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    code: 200,
                    message: 'Successful operation',
                    metadata: {
                        totalScannedCount: 0,
                        totalItemsMatched: 0,
                        totalConsumedCapacity: 0,
                        lastEvaluatedKey: {
                            id: getRandomArbitrary(1, 100000),
                        }
                    },
                    data: [
                        {
                            "id": getRandomArbitrary(1, 100000),
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
