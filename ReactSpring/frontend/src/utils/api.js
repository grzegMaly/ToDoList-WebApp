import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15_000,
    withCredentials: true
});

const getCsrfToken = async () => {

    const response = await api.get(`/csrf`);
    try {
        return {
            header: response.data.headerName,
            token: response.data.token
        }
    } catch (error) {
        console.log('Failed to fetch CSRF token', error);
        return null;
    }
}

api.interceptors.request.use(
    async (config) => {
        const method = config.method.toUpperCase();
        const protectedMethods = ["POST", "PUT", "PATCH", "DELETE"];
        const isPublicEndpoint = config.url.includes("/auth/public") || config.url.includes('/oauth2');
        if (protectedMethods.includes(method) && !isPublicEndpoint) {
            const csrf = await getCsrfToken();
            if (csrf?.header && csrf?.token) {
                config.headers[csrf.header] = csrf.token;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export {api};