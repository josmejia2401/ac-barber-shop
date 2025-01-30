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
                        "firstName": "Juan",
                        "lastName": "Pérez",
                        "email": "juan.perez@example.com",
                        "phone": "+573105397699",
                        "address": "Av. Siempre Viva 123, Ciudad, País",
                        "birthdate": DateUtil.currentDateToFormat3(),
                        "tags": ["envíos rápidos", "descuentos exclusivos"],
                        "createdAt": DateUtil.currentDateToISO(),
                        "status": 1,
                        "purchaseHistory": []
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
                    "id": 1234567,
                    "firstName": "Juan",
                    "lastName": "Pérez",
                    "email": "juan.perez@example.com",
                    "phone": "+573105397699",
                    "address": "Av. Siempre Viva 123, Ciudad, País",
                    "birthdate": DateUtil.currentDateToFormat3(),
                    "tags": ["envíos rápidos", "descuentos exclusivos"],
                    "createdAt": DateUtil.currentDateToISO(),
                    "status": 1,
                    "purchaseHistory": []
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
                    lastEvaluatedKey: undefined,
                    data: [
                        {
                            "id": 1234567,
                            "firstName": "Juan",
                            "lastName": "Pérez",
                            "email": "juan.perez@example.com",
                            "phone": "+573105397699",
                            "address": "Av. Siempre Viva 123, Ciudad, País",
                            "birthdate": DateUtil.currentDateToFormat3(),
                            "tags": ["envíos rápidos", "descuentos exclusivos"],
                            "createdAt": DateUtil.currentDateToISO(),
                            "status": 1,
                            "purchaseHistory": [
                                {
                                    "transactionId": 123456,
                                    "date": DateUtil.currentDateToISO(),
                                    "amount": 1200,
                                    "items": [
                                        {
                                            "id": 123456,
                                            "name": "Laptop Lenovo T14",
                                            "reference": "20W1S2YY2P",
                                            "stock": 70,
                                            "price": 1200,
                                            "category": {
                                                "id": 1,
                                                "name": "Electrónica"
                                            },
                                            "stockLocation": {
                                                "id": 1,
                                                "name": "Bodega principal"
                                            },
                                            "description": "I7 11th+16GB+SSD256GB"
                                        },
                                        {
                                            "id": 123456,
                                            "name": "Smartphone Samsung Galaxy",
                                            "reference": "20W1S2YY2P",
                                            "stock": 70,
                                            "price": 1200,
                                            "category": {
                                                "id": 1,
                                                "name": "Electrónica"
                                            },
                                            "stockLocation": {
                                                "id": 1,
                                                "name": "Bodega principal"
                                            },
                                            "description": "I7 11th+16GB+SSD256GB"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": 12345678,
                            "firstName": "Juanx",
                            "lastName": "Mejia",
                            "email": "juan.perez@example.com",
                            "phone": "+573105397699",
                            "address": "Av. Siempre Viva 123, Ciudad, País",
                            "birthdate": DateUtil.currentDateToFormat3(),
                            "tags": ["envíos rápidos", "descuentos exclusivos"],
                            "createdAt": DateUtil.currentDateToISO(),
                            "purchaseHistory": [],
                            "status": 1,
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
            resolveOuter({
                code: 200,
                message: 'Successful operation',
                lastEvaluatedKey: undefined,
                data: {
                    "id": 1234567,
                    "firstName": "Juan",
                    "lastName": "Pérez",
                    "email": "juan.perez@example.com",
                    "phone": "+573105397699",
                    "address": "Av. Siempre Viva 123, Ciudad, País",
                    "birthdate": DateUtil.currentDateToFormat3(),
                    "tags": ["envíos rápidos", "descuentos exclusivos"],
                    "createdAt": DateUtil.currentDateToISO(),
                    "status": 1,
                    "purchaseHistory": []
                }
            });
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}


export const deleteItemById = async (id) => {
    try {
        return new Promise((resolveOuter) => {
            resolveOuter({
                code: 200,
                message: 'Successful operation',
                lastEvaluatedKey: undefined,
                data: {
                    "id": 1234567,
                    "firstName": "Juan",
                    "lastName": "Pérez",
                    "email": "juan.perez@example.com",
                    "phone": "+573105397699",
                    "address": "Av. Siempre Viva 123, Ciudad, País",
                    "birthdate": DateUtil.currentDateToFormat3(),
                    "tags": ["envíos rápidos", "descuentos exclusivos"],
                    "createdAt": DateUtil.currentDateToISO(),
                    "status": 1,
                    "purchaseHistory": []
                }
            });
        });
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}
