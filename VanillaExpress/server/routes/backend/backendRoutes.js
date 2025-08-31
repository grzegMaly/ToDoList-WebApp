const router = require('express').Router();
const authRoutes = require('./routes/authRoutes');

router.use('/v1/auth', authRoutes);

/**@type {import('express').Router}*/
module.exports = router;