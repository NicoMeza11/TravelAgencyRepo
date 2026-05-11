import axios from "axios";
import keycloak from './keycloak';

const api = axios.create({
    baseURL: 'http://18.230.122.69:8100/api',
    headers: {
        'Content-Type' : 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        if (keycloak.authenticated) {
            try {
                await keycloak.updateToken(30);
                
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            } catch (error) {
                console.error("Token expired, the session could not be renewed", error);
                keycloak.login();
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;