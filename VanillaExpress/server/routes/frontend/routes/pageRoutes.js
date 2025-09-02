const router = require('express').Router();
const viewController = require('../../../controllers/ViewsController');
const authController = require('../../../controllers/AuthController');

router.get('/', viewController.getHomePage);
router.get('/todo-list', authController.protectPage, viewController.getMainPage);
router.get('/error', viewController.getErrorPage);

/**@type {import('express').Router}*/
module.exports = router;