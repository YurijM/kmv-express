const {Router} = require('express');
const route = require('../controllers/route.controller');
const router = Router();

// /api/route
router.get('/loadRoutes', route.loadRoutes);
router.get('/updateStatus', route.updateStatus);

module.exports = router;
