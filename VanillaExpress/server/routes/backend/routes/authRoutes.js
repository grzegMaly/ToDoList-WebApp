const router = require('express').Router()
const authController = require('../../../controllers/AuthController');
const oauthRoutes = require('./oauth/oauth2');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authController.me)
router.use('/oauth2', oauthRoutes);

/**@type {import('express').Router}*/
module.exports = router;