const router = require('express').Router();
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes')

router.use('/v1/auth', authRoutes);
router.use('/v1/lists', listRoutes);

/**@type {import('express').Router}*/
module.exports = router;