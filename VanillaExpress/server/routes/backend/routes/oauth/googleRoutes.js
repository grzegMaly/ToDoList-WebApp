const router = require('express').Router();
const authController = require('../../../../controllers/AuthController');

router.get("/", authController.googleAuth);
router.get("/callback", authController.googleCallback);

/**@type {import('express').Router}*/
module.exports = router;