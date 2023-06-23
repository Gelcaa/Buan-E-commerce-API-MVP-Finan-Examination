const mongoose=require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
  type: String,
   required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("product", productSchema);