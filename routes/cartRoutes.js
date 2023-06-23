const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { addToCart,
    updateQuantity,
    removeCart
} = cartController;

router.post('/add', addToCart);
router.put('/update/:cartId', updateQuantity);
router.delete('/remove/:cartId', removeCart);
module.exports = router;