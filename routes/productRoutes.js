const express = require('express');
const router = express.Router();

const productController = require('../controllers/productControllers');
const { createProductController,
    getAllProductsController,
    getActiveProductsController,
    getProductByIdController,
    updateProductController,
    archiveProductController,
} = productController;

router.post('/createProduct', createProductController);
router.get('/allProduct', getAllProductsController);
router.get('/active', getActiveProductsController);
router.get('/:productId', getProductByIdController);
router.put('/update/:productId', updateProductController);
router.delete('/archive/:productId', archiveProductController);

module.exports = router;