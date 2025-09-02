const router = require('express').Router();
const listController = require('../../../controllers/ListController');
const authController = require('../../../controllers/AuthController');

router.use(authController.protectRoute)
router.route('/')
    .get(listController.getUserListDocs)
    .post(listController.createListDocument);

router.route('/:listId')
    .put(listController.updateListDoc)
    .delete(listController.deleteListDoc);

/**@type {import('express').Router}*/
module.exports = router;