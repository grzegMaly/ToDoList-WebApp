const mongoose = require('mongoose');
const ClientOAuth2 = require('client-oauth2');

const UserModel = require('../models/userModel');
const SignupRequest = require('../classes/SignupRequest');
const LoginResponse = require('../classes/LoginResponse');
const ApiResponse = require('../classes/ApiResponse');
const LoginRequest = require('../classes/LoginRequest');
const TokenGenerator = require('../classes/TokenGenerator');

class AuthController {

    #tokenGenerator;
    #expiryDays;
    #cookieOptions;
    #githubAuth;
    #googleAuth;

    constructor() {
        this.#tokenGenerator = new TokenGenerator();
        this.#expiryDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 30;

        this.#cookieOptions = {
            expires: new Date(Date.now() + this.#expiryDays * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
        }
        this.#cookieOptions.secure = process.env.NODE_ENV === "production";

        this.#setUpProviders();
    }

    #setUpProviders = () => {

        this.#githubAuth = new ClientOAuth2({

        });

        this.#googleAuth = new ClientOAuth2({

        });
    }

    #sendLoginResponse = (res, user, message, status = 201) => {
        const token = this.#tokenGenerator.signToken(user._id);

        const loginResponse = new LoginResponse(user._id, user.username, user.roles);
        const response = new ApiResponse(message, status, loginResponse);

        res.cookie(this.#tokenGenerator.cookieName(), token, this.#cookieOptions);
        return res.status(status)
            .json(response);
    }

    login = async (req, res, next) => {
        if (mongoose.connection.readyState !== 1) {
            return next(new Error("Unknown error"));
        }

        const loginRequest = new LoginRequest(req.body);
        if (!loginRequest.email || !loginRequest.password) {
            return next(new Error("Please provide valid data"));
        }

        let user;
        try {
            user = await UserModel.findOne({email: loginRequest.email})
                .select("+password");
        } catch (error) {
            return next(new Error("Something went wrong"));
        }

        if (!user || !(await user.correctPassword(loginRequest.password))) {
            return next(new Error("Incorrect Email or password"));
        }

        return this.#sendLoginResponse(res, user, "Logged in successfully", 200);
    }

    register = async (req, res, next) => {

        const signupRequest = new SignupRequest(req.body);
        try {
            const user = await UserModel.create({
                username: signupRequest.username,
                email: signupRequest.email,
                password: signupRequest.password,
                passwordConfirm: signupRequest.passwordConfirm
            });
            return this.#sendLoginResponse(res, user, "Registered successfully");
        } catch (error) {
            console.log(error)
            return next(new Error("Something went wrong"));
        }
    }

    githubAuth = async () => {

    }

    githubCallback = async () => {

    }

    googleAuth = async () => {

    }

    googleCallback = async () => {

    }
}

module.exports = new AuthController();