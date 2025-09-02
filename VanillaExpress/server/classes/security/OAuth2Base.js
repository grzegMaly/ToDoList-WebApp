const UserModel = require('../../models/userModel');
const TokenGenerator = require('./TokenGenerator');

class OAuth2Base {

    _tokenGenerator;

    constructor() {
        this._tokenGenerator = new TokenGenerator();
    }

    _setUpProvider = () => {}
    providerAuth = () => {
        return this._providerInstance;
    }

    _getSaveUserFromOauth2 = async (profile) => {
        let user = await UserModel.findOne({email: profile.email});
        if (!user) {
            user = await UserModel.create({
                username: profile.username,
                email: profile.email,
                loginMethod: profile.provider,
                providerId: profile.providerId
            });
        }
        return user;
    }

    generateOAuthStateCookie = (res) => {
        const state = crypto.randomUUID();
        res.cookie('oauth_state', state, {httpOnly: true, sameSite: "lax", secure: false})
        return state;
    }

    providerCallback = async (req, res) => {}

    _getProfile = async (accessToken) => {}

    _validateState = (req, res) => {
        const expected = req.cookies?.['oauth_state'];
        const received = req.query.state;
        if (!expected || expected !== received) {
            return res.redirect('error');
        }
    }

    _sendSuccess = async (res) => {

        const {profile} = res;
        delete res.profile;

        const user = await this._getSaveUserFromOauth2(profile);
        const jwt = this._tokenGenerator.signToken(user._id);
        res.clearCookie('oauth_state');
        res.cookie(this._tokenGenerator.cookieName(), jwt, this._tokenGenerator.cookieOptions);
        return res.redirect('/todo-list');
    }
}

module.exports = OAuth2Base;