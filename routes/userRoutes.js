
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { createUserController, loginUser,setAsAdmin } = userController;


router.post('/registration', createUserController);
router.post('/login', loginUser);
router.post('/setAsAdmin', setAsAdmin);


module.exports = router;
