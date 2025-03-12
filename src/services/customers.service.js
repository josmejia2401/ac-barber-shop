import { axiosInstance } from './fetch.service.js'
import api from './api.constants';
import { buildAndThrowNewError, buildDefaultHeaders } from '../lib/auth.js';

export const createItem = async (payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.post(`${api.customers.create}`, payload, {
            headers: {
                ...authHeaders
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}

export const filterItems = async (payload) => {
    try {
        const urlParameters = payload && Object.keys(payload).length !== 0 ? `?${Object.entries(payload).map(e => e.join('=')).join('&')}` : '';
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.get(`${api.customers.filter}${urlParameters}`, {
            headers: {
                ...authHeaders
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}

export const updateItemById = async (id, payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.put(`${api.customers.update.replace(":id", id)}`, payload, {
            headers: {
                ...authHeaders
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}

export const deleteItemById = async (id) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.delete(`${api.customers.delete.replace(":id", id)}`, {
            headers: {
                ...authHeaders
            },
        });
        const data = res.data;
        return data;
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}
