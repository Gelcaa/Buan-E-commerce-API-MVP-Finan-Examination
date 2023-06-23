const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
   
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  purchasedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("order", orderSchema);

