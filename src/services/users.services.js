import { axiosInstance } from './fetch.service.js'
import api from './api.constants';
import { buildAndThrowNewError, buildDefaultHeaders } from '../lib/auth.js';

export const register = async (payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.post(`${api.users.register}`, payload, {
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
