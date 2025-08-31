const router = require('express').Router();
const viewController = require('../../../controllers/ViewsController');

router.get('/login', viewController.getLoginPage);
router.get('/register', viewController.getRegisterPage);

/**@type {import('express').Router}*/
module.exports = router;