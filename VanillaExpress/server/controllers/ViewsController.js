const path = require('path');

class ViewsController {
    #htmlPath;

    constructor() {
        this.#htmlPath = path.join(__dirname, '..', '..', 'public', 'html');
    }

    #getPage = (res, next, pageName, status = 200) => {
        const page = `${pageName}.html`
        const html = path.join(this.#htmlPath, page);
        return res.status(status)
            .sendFile(html, err => {
                if (err) {
                    next(err);
                }
            });
    }

    getLoginPage = (req, res, next) => {
        return this.#getPage(res, next,'login');
    }

    getRegisterPage = (req, res, next) => {
        return this.#getPage(res, next,'register');
    }

    getHomePage = (req, res, next) => {
        return this.#getPage(res, next, 'homePage');
    }

    getMainPage = (req, res, next) => {
        return this.#getPage(res, next, 'todoPage');
    }

    getNotFoundPage = (req, res, next) => {
        return this.#getPage(res, next,  'notFoundPage', 404);
    }

    getErrorPage = (req, res, next) => {
        return this.#getPage(res, next, 'errorPage')
    }
}

module.exports = new ViewsController();