const express = require('express');
const router = express.Router();

const productController = require('../controllers/orderController');
const { createOrder,
    retrieveOrder,
    retrieveUserOrders
} = productController;

router.post('/createOrder', createOrder);
router.get('/retrieveOrder', retrieveOrder);
router.get('/user', retrieveUserOrders) 
module.exports = router;