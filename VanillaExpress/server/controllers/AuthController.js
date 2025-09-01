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
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            accessTokenUri: 'https://github.com/login/oauth/access_token',
            authorizationUri: 'https://github.com/login/oauth/authorize',
            redirectUri: 'http://localhost:5000/api/v1/auth/oauth2/github/callback',
            scopes: ['read:user', 'user:email'],
        });

        this.#googleAuth = new ClientOAuth2({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            accessTokenUri: 'https://oauth2.googleapis.com/token',
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            redirectUri: 'http://localhost:5000/api/v1/auth/oauth2/google/callback',
            scopes: ['openid', 'email', 'profile'],
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

    #getGithubProfile = async (accessToken) => {

        const headers = {Authorization: `Bearer ${accessToken}`, 'User-Agent': 'todo-app'}

        const user = await fetch('https://api.github.com/user', {headers}).then(res => res.json());
        const emails = await fetch('https://api.github.com/user/emails', {headers}).then(res => res.json());
        const primaryEmail = Array.isArray(emails) ? (emails.find(e => e.primary)?.email || emails[0]?.email) : null;

        return {
            provider: 'github',
            providerId: String(user.id),
            username: user.login,
            name: user.name || user.login,
            email: primaryEmail,
        }
    }

    githubAuth = async (req, res) => {
        const state = crypto.randomUUID();
        res.cookie('oauth_state', state, {httpOnly: true, sameSite: "lax", secure: false})
        const uri = this.#githubAuth.code.getUri({state})
        return res.redirect(uri);
    }

    githubCallback = async (req, res) => {
        try {

            const expected = req.cookies?.['oauth_state'];
            const received = req.query.state;
            if (!expected || expected !== received) {
                return res.status(400).send("Invalid OAuth state");
            }

            const token = await this.#githubAuth.code.getToken(req.originalUrl);
            const profile = await this.#getGithubProfile(token.accessToken);

            if (!profile.email) {
                return res.redirect("/login?error=email_not_found");
            }

            let user = await UserModel.findOne({email: profile.email})
            if (!user) {
                user = await UserModel.create({
                    username: profile.username,
                    email: profile.email,
                    loginMethod: profile.provider
                });
            }

            const jwt = this.#tokenGenerator.signToken(user._id);
            res.cookie(this.#tokenGenerator.cookieName(), jwt, this.#cookieOptions);
            return res.redirect('/todo-list')
        } catch (error) {
            console.error(error);
            return res.redirect('/login?error=oauth_github');
        }
    }

    googleAuth = async (req, res) => {

    }

    googleCallback = async () => {

    }
}

module.exports = new AuthController();