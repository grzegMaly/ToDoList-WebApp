import {api} from "./api.js"

export const getDocs = async () => {
    return await api("/lists", {
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
}

export const createDoc = async(content) => {
    return await api('/lists', {
        method: "POST",
        body: {
            content: content.trim(),
            done: false
        },
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

export const updateDocStatus = async (id, done) => {
    return await api(`/lists/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: {done},
        credentials: "include"
    });
}

export const deleteDoc = async (id) => {
    return await api(`/lists/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
}