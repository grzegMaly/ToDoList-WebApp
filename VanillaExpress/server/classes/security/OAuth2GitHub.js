const OAuth2Base = require('./OAuth2Base');
const ClientOAuth2 = require("client-oauth2");

class OAuth2GitHub extends OAuth2Base {

    _providerInstance;

    constructor() {
        super();
        this._setUpProvider();
    }

    _setUpProvider = () => {
        this._providerInstance = new ClientOAuth2({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            accessTokenUri: 'https://github.com/login/oauth/access_token',
            authorizationUri: 'https://github.com/login/oauth/authorize',
            redirectUri: 'http://localhost:5000/api/v1/auth/oauth2/github/callback',
            scopes: ['read:user', 'user:email'],
        });
    }

    providerCallback = async (req, res) => {
        try {

            this._validateState(req, res);

            const token = await this._providerInstance.code.getToken(req.originalUrl);
            const profile = await this._getProfile(token.accessToken);

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

    _getProfile = async (accessToken) => {

        const headers = {Authorization: `Bearer ${accessToken}`, 'User-Agent': 'todo-app'}

        const user = await fetch('https://api.github.com/user', {headers}).then(res => res.json());
        const emails = await fetch('https://api.github.com/user/emails', {headers}).then(res => res.json());
        const primaryEmail = Array.isArray(emails) ? (emails.find(e => e.primary)?.email || emails[0]?.email) : null;

        return {
            provider: 'github',
            providerId: String(user.id),
            username: user.name || user.login,
            email: primaryEmail,
        }
    }
}

module.exports = Object.freeze(new OAuth2GitHub());