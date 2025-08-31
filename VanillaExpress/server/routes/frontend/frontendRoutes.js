const router = require('express').Router();

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');

router.use('/', pageRoutes);
router.use('/', authRoutes);

/**@type {import('express').Router}*/
module.exports = router;