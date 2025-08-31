const router = require('express').Router();
const authController = require('../../../../controllers/AuthController');

router.get("/", authController.githubAuth);
router.get("/callback", authController.githubCallback);

/**@type {import('express').Router}*/
module.exports = router;