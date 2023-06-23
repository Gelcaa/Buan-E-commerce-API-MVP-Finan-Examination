const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cart: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      subtotal: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  purchasedOn: {
    type: Date,
    required: true
  }
});
module.exports = mongoose.model("cart", cartSchema);