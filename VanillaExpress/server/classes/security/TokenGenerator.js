const jwt = require("jsonwebtoken");

class TokenGenerator {
    #jwtSecret;
    #jwtExpiresInDays;
    #algorithm
    #cookieName
    #expiryDays
    #cookieOptions

    constructor() {
        this.#jwtSecret = process.env.JWT_SECRET;
        this.#jwtExpiresInDays = process.env.JWT_EXPIRES_IN;
        this.#cookieName = process.env.JWT_COOKIE_NAME;
        this.#algorithm = ["HS256"];
        this.#expiryDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 30;

        this.#cookieOptions = {
            expires: new Date(Date.now() + this.#expiryDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
        }
        this.#cookieOptions.secure = process.env.NODE_ENV === "production";
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
    cookieOptions() {
        return this.#cookieOptions;
    }
}

module.exports = TokenGenerator;