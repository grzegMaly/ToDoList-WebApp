export const saveUser = (data) => {
    const user = {
        id: data.id,
        roles: data.roles,
        username: data.username
    }
    localStorage.setItem("USER", JSON.stringify(user));
}

export const readUser = () => {
    const userData = localStorage.getItem("USER");
    return userData ? JSON.parse(userData) : null;
}