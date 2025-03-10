import Storage from "./storage";
import { CustomError } from "./errors/custom-error";
import TokenUtil from "./token";

export const getAccessToken = () => {
    return Storage.get("ACCESS_TOKEN");
}

export const setAccessToken = (accessToken) => {
    return Storage.set("ACCESS_TOKEN", accessToken);
}

export const getTokenInfo = () => {
    const accessToken = getAccessToken();
    if (accessToken && TokenUtil.isValidToken(accessToken)) {
        return TokenUtil.getInfoToken(accessToken);
    }
    return null;
}

export const isAuthenticated = () => {
    const accessToken = getAccessToken();
    if (accessToken && TokenUtil.isValidToken(accessToken)) {
        return true;
    }
    return false;
}

export const cleanAll = () => {
    return Storage.clear();
}

export const buildAndThrowNewError = (error) => {
    if (error && error.response) {
        //en App.js el sistema se encarga de validar si hay datos y redirecciona a login
        if (error.response.status === 401 || error.response.status === 403) {
            cleanAll();
        }
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
        throw new CustomError(error.response.data["message"], error.response.data["code"], error.response.status);
    }
    throw error;
}

export const buildDefaultHeaders = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
        return {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*'
        };
    }
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": '*'
    };
}