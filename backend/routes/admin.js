const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueAgg,
      pendingOrders,
      todayOrders
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    const revenue = revenueAgg[0]?.total || 0;

    // Last 7 days orders chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const count = await Order.countDocuments({ createdAt: { $gte: start, $lte: end } });
      const rev = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]);
      last7Days.push({
        date: start.toLocaleDateString('en-BD', { weekday: 'short' }),
        orders: count,
        revenue: rev[0]?.total || 0
      });
    }

    // Top products
    const topProducts = await Product.find({ isActive: true }).sort('-totalSold').limit(5).select('name totalSold price images');

    // Order status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: { totalOrders, totalUsers, totalProducts, revenue, pendingOrders, todayOrders },
      charts: { last7Days, topProducts, statusBreakdown }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
