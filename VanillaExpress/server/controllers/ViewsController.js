const path = require('path');

class ViewsController {
    #htmlPath;

    constructor() {
        this.#htmlPath = path.join(__dirname, '..', '..', 'public', 'html');
    }

    #getPage = (res, next, pageName, status = 200) => {
        const page = path.join(this.#htmlPath, pageName);
        return res.status(status)
            .sendFile(page, err => {
                if (err) {
                    next(err);
                }
            });
    }

    getLoginPage = (req, res, next) => {
        return this.#getPage(res, next,'login.html');
    }

    getRegisterPage = (req, res, next) => {
        return this.#getPage(res, next,'register.html');
    }

    getNotFoundPage = (req, res, next) => {
        return this.#getPage(res, next,  'notFoundPage.html', 404);
    }
}

module.exports = new ViewsController();