const {Router} = require('express');
const status = require('../controllers/status.controller');
const router = Router();

// /api/status
router.get('/loadStatuses', status.loadStatuses);

module.exports = router;
