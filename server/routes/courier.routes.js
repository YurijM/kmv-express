const {Router} = require('express');
const courier = require('../controllers/courier.controller');
const router = Router();

// /api/courier
router.get('/add', courier.add);
router.get('/login', courier.login);
router.get('/getCourier', courier.getCourier);

module.exports = router;
