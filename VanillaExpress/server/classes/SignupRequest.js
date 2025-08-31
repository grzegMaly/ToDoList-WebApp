class SignupRequest {
    #username;
    #email;
    #password;
    #passwordConfirm;

    constructor({username, email, password, passwordConfirm}) {
        this.#username = username;
        this.#email = email;
        this.#password = password;
        this.#passwordConfirm = passwordConfirm;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
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

    get passwordConfirm() {
        return this.#passwordConfirm;
    }

    set passwordConfirm(value) {
        this.#passwordConfirm = value;
    }
}

module.exports = SignupRequest;