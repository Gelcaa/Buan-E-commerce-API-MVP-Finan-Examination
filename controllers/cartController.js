const Cart = require('../models/cart');
const User = require('../models/user');
const Product = require('../models/product');

//Add to Cart - Added Products
//Subtotal for each item and Total price for all items
module.exports.addToCart = async (req, res) => {
  const { userId, products } = req.body;

  try {
    let cartItem = await Cart.findOne({ userId: userId });

    if (!cartItem) {
      cartItem = new Cart({
        userId: userId,
        cart: []
      });
    }

    for (const product of products) {
      const { name, quantity } = product;
      const existingProduct = cartItem.cart.find(p => p.name === name);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        const newProduct = {
          name: name,
          quantity: quantity,
          subtotal: 0
        };

        const productData = await Product.findOne({ name: name });
        if (!productData) {
          return res.status(404).json({ error: 'Product not found' });
        }
        //Compute subtotal
        newProduct.subtotal = productData.price * quantity;
        cartItem.cart.push(newProduct);
      }
    }
    //Compute total price for all items
    cartItem.totalPrice = cartItem.cart.reduce((total, p) => total + p.subtotal, 0);
    await cartItem.save();

    res.status(200).json({ message: 'Added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add' });
  }
};


//Add to Cart - Change product quantities
module.exports.updateQuantity = async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedQuantity = await Cart.findOneAndUpdate(
      { 'cart._id': cartId },
      { $set: { 'cart.$.quantity': quantity } },
      { new: true }
    );

    if (!updatedQuantity) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    const newQuantity = updatedQuantity.cart.find(p => p._id.toString() === cartId);
    const productSchema = await Product.findOne({ name: newQuantity.name });
    if (!productSchema) {
      return res.status(404).json({ error: 'Product not found' });
    }
    newQuantity.subtotal = productSchema.price * newQuantity.quantity;
    updatedQuantity.totalPrice = updatedQuantity.cart.reduce((total, p) => total + p.subtotal, 0);

    await updatedQuantity.save();

    res.send(updatedQuantity);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};



//Add to Cart - Remove products from cart
module.exports.removeCart = (req, res) => {
  const { cartId } = req.params;

  Cart.findByIdAndRemove(cartId)
  
    .then(removedCart => {
      if (!removedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json({ message: 'Cart has been removed', cart: removedCart });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};


