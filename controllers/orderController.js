const Order = require('../models/order');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Product = require('../models/product');

//Create Order (NON-admin only)
module.exports.createOrder = async (req, res) => {
  const { userId, products } = req.body;

  try {
    const user = await User.findById(userId);
    // Check if user is admin
    if (user.isAdmin) {
      return res.status(403).json({ error: 'Admin cannot create an order' });
    }

    let totalPrice = 0;
    const orderProducts = [];

    for (const product of products) {
      const { name, quantity } = product;
      const orderData = await Product.findOne({ name: name });
      if (!orderData) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const subtotal = orderData.price * quantity;
      totalPrice += subtotal;

      orderProducts.push({
        name: name,
        quantity: quantity,
        purchasedOn: new Date()
      });
    }

    const newOrder = new Order({
      userId: userId,
      products: orderProducts,
      totalPrice: totalPrice
    });

    await newOrder.save();

    res.status(200).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create an order' });
  }
};




//Retrieve All Orders (admin only)
module.exports.retrieveOrder = (req, res) => {
        const token = req.headers.authorization;
  
    // Verify the token and check if the user is an admin
    const trimmedToken = token.trim();


    // Verify the token
    jwt.verify(trimmedToken, 'gelca', (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        const isAdmin = decoded.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admin can access' });
        }
    Order.find()
    .then(Order => {
      res.send(Order);
    })
    .catch(err => {
      res.send(err);
    });
    })
 }

//Retrieve Authenticated User's Orders (NON-admin only)
module.exports.retrieveUserOrders = (req, res) => {
  const userId = req.body.userId;

  User.findById(userId)
    .then(user => {
      // Check if user is admin
      if (user.isAdmin) {
        return res.status(403).json({ error: 'Admin cannot retrieve user orders' });
      }

      Order.find({ userId })
        .then(orders => {
          res.send(orders);
        })
        .catch(err => {
          res.status(500).send(err);
          
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
