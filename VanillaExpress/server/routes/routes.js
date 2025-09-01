const router = require('express').Router();

const frontendRoutes = require("./frontend/frontendRoutes");
const backendRoutes = require("./backend/backendRoutes");
const viewController = require('../controllers/ViewsController');

router.use('/', frontendRoutes);
router.use('/api', backendRoutes);
router.use((req, res, next) => {
    console.log(req.originalUrl);
    if (req.path.startsWith('/api')) {
        return res.status(404)
            .json({
                status: 404,
                message: "Not found",
            });
    }
    return viewController.getNotFoundPage(req, res, next);
});

/**@type {import('express').Router}*/
module.exports = router;