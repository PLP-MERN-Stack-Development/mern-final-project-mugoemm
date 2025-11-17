const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// create order
router.post('/', auth, async (req, res) => {
  const { items, shippingAddress } = req.body;
  if(!items || !items.length) return res.status(400).json({ error: 'No items' });
  let total = 0;
  const populatedItems = [];
  for(const it of items){
    const p = await Product.findById(it.product);
    if(!p) return res.status(400).json({ error: 'Invalid product ' + it.product });
    populatedItems.push({ product: p._id, qty: it.qty, price: p.price });
    total += p.price * it.qty;
  }
  const order = new Order({ user: req.user._id, items: populatedItems, total, shippingAddress });
  await order.save();
  res.status(201).json(order);
});

// get user's orders
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
});

module.exports = router;
