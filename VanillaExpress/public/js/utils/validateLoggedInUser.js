import {readUser} from "./storeUser.js"
export const validate = () => {
    const user = readUser();
    return user && user.id && user.username && user.roles.length > 0
}