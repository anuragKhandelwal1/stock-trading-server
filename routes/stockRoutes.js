const express = require('express');
const router = express.Router();
const stockController = require('../controller/stockController');

router.route('/get').get(stockController.get);
router.route('/add').post(stockController.add);
router.route('/buy').post(stockController.buy);

module.exports = router;
