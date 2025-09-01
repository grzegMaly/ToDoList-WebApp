const OAuth2Base = require('./OAuth2Base');
const ClientOAuth2 = require("client-oauth2");

class OAuth2Google extends OAuth2Base {

    _providerInstance;

    constructor() {
        super();
        this._setUpProvider();
    }

    _setUpProvider = () => {
        this._providerInstance = new ClientOAuth2({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            accessTokenUri: 'https://oauth2.googleapis.com/token',
            authorizationUri: 'https://accounts.google.com/o/oauth2/v2/auth',
            redirectUri: 'http://localhost:5000/api/v1/auth/oauth2/google/callback',
            scopes: ['openid', 'email', 'profile'],
        });
    }

    providerCallback = async (req, res) => {
        try {

            this._validateState(req, res);

            const token = await this._providerInstance.code.getToken(req.originalUrl);
            const profile = await this._getProfile(token.accessToken)

            if (!profile.email) {
                return res.redirect("/login?error=email_not_found");
            }

            res.profile = profile;
            await this._sendSuccess(res);
        } catch (error) {
            console.error(error);
            return res.redirect('/login?error=oauth_github');
        }
    }

    _getProfile = async (authToken) => {

        const headers = {Authorization: `Bearer ${authToken}`, "User-Agent": 'todo-app'}
        const data = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {headers}).then(r => r.json());

        return {
            provider: 'google',
            providerId: data.sub,
            username: data.name,
            email: data.email
        }
    };
}

module.exports = Object.freeze(new OAuth2Google());