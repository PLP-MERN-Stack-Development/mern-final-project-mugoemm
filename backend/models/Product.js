const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  stock: { type: Number, default: 0 },
  categories: [String],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
