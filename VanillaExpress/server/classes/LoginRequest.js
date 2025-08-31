const Data = require("./Data");

class LoginRequest extends Data {
    #email;
    #password;

    constructor({email, password}) {
        super();
        this.#email = email;
        this.#password = password;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get password() {
        return this.#password;
    }

    set password(value) {
        this.#password = value;
    }

    toJSON() {
        return {
            email: this.#email,
            password: this.#password,
        };
    }
}

module.exports = LoginRequest;