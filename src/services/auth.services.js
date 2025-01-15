import { axiosInstance } from './fetch.service.js'
import api from './api.constants';
import { buildAndThrowNewError, buildDefaultHeaders, setAccessToken } from '../lib/auth.js';

export const signIn = async (payload) => {
    try {
        const authHeaders = buildDefaultHeaders();
        const res = await axiosInstance.post(`${api.auth.signIn}`, payload, {
            headers: {
                ...authHeaders
            },
        });
        setAccessToken(res.data["accessToken"]);
        return res.data;
    } catch (error) {
        console.error(error);
        buildAndThrowNewError(error);
    }
}
