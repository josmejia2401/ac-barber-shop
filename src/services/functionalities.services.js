import { axiosInstance } from './fetch.service.js'
import api from './api.constants';
import { buildAndThrowNewError, buildDefaultHeaders } from '../lib/auth.js';

export const create = async (payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.post(`${api.functionalities.create}`, payload, {
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

export const find = async (id, projectId) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.get(`${api.functionalities.find
            .replace(":id", id)
            .replace(":projectId", projectId)}`, {
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

export const filter = async (payload) => {
    try {
        const urlParameters = payload && Object.keys(payload).length !== 0 ? `?${Object.entries(payload).map(e => e.join('=')).join('&')}` : '';
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.get(`${api.functionalities.filter}${urlParameters}`, {
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


export const update = async (id, payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.put(`${api.functionalities.update.replace(":id", id)}`, payload, {
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


export const del = async (id, projectId) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.delete(`${api.functionalities.delete
            .replace(":id", id)
            .replace(":projectId", projectId)}`, {
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
