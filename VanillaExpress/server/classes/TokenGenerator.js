const jwt = require("jsonwebtoken");

class TokenGenerator {
    #jwtSecret;
    #jwtExpiresInDays;
    #algorithm
    #cookieName

    constructor() {
        this.#jwtSecret = process.env.JWT_SECRET;
        this.#jwtExpiresInDays = process.env.JWT_EXPIRES_IN;
        this.#cookieName = process.env.JWT_COOKIE_NAME;
        this.#algorithm = ["HS256"]
    }

    signToken(id) {
        return jwt.sign({sub:id},
            this.#jwtSecret,
            {
                expiresIn: this.#jwtExpiresInDays,
                algorithm: this.#algorithm[0]
            });
    }

    verify(token) {
        return jwt.verify(token, this.#jwtSecret, {algorithms: this.#algorithm})
    }

    cookieName() {
        return this.#cookieName;
    }
}

module.exports = TokenGenerator;