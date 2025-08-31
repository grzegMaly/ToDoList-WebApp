class ApiResponse {
    #message;
    #status;
    #data;

    constructor(message, status, data) {
        this.#message = message;
        this.#status = status;
        this.#data = data;
    }

    get message() {
        return this.#message;
    }

    set message(value) {
        this.#message = value;
    }

    get status() {
        return this.#status;
    }

    set status(value) {
        this.#status = value;
    }

    get data() {
        return this.#data;
    }

    set data(value) {
        this.#data = value;
    }

    toJSON() {
        return {
            message: this.#message,
            status: this.#status,
            data: this.#data
        };
    }
}

module.exports = ApiResponse;