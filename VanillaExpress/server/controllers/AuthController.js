const mongoose = require('mongoose');

const UserModel = require('../models/userModel');
const SignupRequest = require('../classes/requestResponse/SignupRequest');
const LoginResponse = require('../classes/requestResponse/LoginResponse');
const ApiResponse = require('../classes/requestResponse/ApiResponse');
const LoginRequest = require('../classes/requestResponse/LoginRequest');
const TokenGenerator = require('../classes/security/TokenGenerator');
const OAuth2Google = require('../classes/security/OAuth2Google');
const OAuth2GitHub = require('../classes/security/OAuth2GitHub');

class AuthController {

    #tokenGenerator;
    #cookieOptions;

    constructor() {
        this.#tokenGenerator = new TokenGenerator();
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

    githubAuth = async (req, res) => {
        const state = OAuth2GitHub.generateOAuthStateCookie(res);
        const uri = OAuth2GitHub.providerAuth().code.getUri({state})
        return res.redirect(uri);
    }

    githubCallback = async (req, res) => {
        await OAuth2GitHub.providerCallback(req, res)
    }

    googleAuth = async (req, res) => {
        const state = OAuth2Google.generateOAuthStateCookie(res);
        const uri = OAuth2Google.providerAuth().code.getUri({state});
        res.redirect(uri);
    }

    googleCallback = async (req, res) => {
        await OAuth2Google.providerCallback(req, res);
    }
}

module.exports = new AuthController();