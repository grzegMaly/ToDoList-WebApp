const router = require('express').Router();
const viewController = require('../../../controllers/ViewsController');

router.get('/', viewController.getHomePage);
router.get('/todo-list', viewController.getMainPage);
router.get('/error', viewController.getErrorPage);

/**@type {import('express').Router}*/
module.exports = router;