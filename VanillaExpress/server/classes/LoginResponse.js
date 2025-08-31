const Data = require("./Data");

class LoginResponse extends Data {
    #id;
    #username;
    #roles;

    constructor(id, username, roles) {
        super();
        this.#id = id;
        this.#username = username;
        this.#roles = roles;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get roles() {
        return this.#roles;
    }

    set roles(value) {
        this.#roles = value;
    }

    toJSON() {
        return {
            id: this.#id,
            username: this.#username,
            roles: this.#roles
        };
    }
}

module.exports = LoginResponse;