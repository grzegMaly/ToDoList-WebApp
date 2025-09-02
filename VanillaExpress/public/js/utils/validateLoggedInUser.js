import {saveUser} from "./storeUser.js"
import {api} from "./api.js";

export const validate = async () => {
    await api('/auth/me', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include'
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Unauthorized');
            }
            return res.json();
        })
        .then(data => {
            saveUser(data);
        })
        .catch(() => {
            localStorage.clear();
            const location = window.location.pathname;
            if (!location.startsWith('/login') && !location.startsWith('/register')) {
                window.location.assign('/login');
            }
        })
}