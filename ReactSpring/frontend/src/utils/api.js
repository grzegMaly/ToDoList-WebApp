import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15_000,
});

const getCsrfToken = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/csrf`,
            {withCredentials: true}
        );
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
        const csrfMethods = ["POST", "PUT", "PATCH", "DELETE"];
        if (csrfMethods.includes(method)) {
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