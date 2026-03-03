const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

router.get('/run', async (req, res) => {
  // Security check
  if (req.query.secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const db = mongoose.connection.db;

    // Clear existing
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});

    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    await db.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@ghorerbazar.com',
      phone: '01700000000',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      addresses: [],
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create categories
    const cats = await db.collection('categories').insertMany([
      { name: 'Vegetables', namebn: 'শাকসবজি', slug: 'vegetables', icon: '🥦', isActive: true, sortOrder: 1, createdAt: new Date() },
      { name: 'Fruits', namebn: 'ফলমূল', slug: 'fruits', icon: '🍎', isActive: true, sortOrder: 2, createdAt: new Date() },
      { name: 'Rice & Grains', namebn: 'চাল ও শস্য', slug: 'rice-grains', icon: '🌾', isActive: true, sortOrder: 3, createdAt: new Date() },
      { name: 'Meat & Fish', namebn: 'মাছ ও মাংস', slug: 'meat-fish', icon: '🐟', isActive: true, sortOrder: 4, createdAt: new Date() },
      { name: 'Dairy & Eggs', namebn: 'দুগ্ধ ও ডিম', slug: 'dairy-eggs', icon: '🥚', isActive: true, sortOrder: 5, createdAt: new Date() },
      { name: 'Cooking Oil', namebn: 'রান্নার তেল', slug: 'cooking-oil', icon: '🫙', isActive: true, sortOrder: 6, createdAt: new Date() },
      { name: 'Spices', namebn: 'মশলা', slug: 'spices', icon: '🌶️', isActive: true, sortOrder: 7, createdAt: new Date() },
      { name: 'Snacks', namebn: 'স্ন্যাকস', slug: 'snacks', icon: '🍪', isActive: true, sortOrder: 8, createdAt: new Date() },
      { name: 'Beverages', namebn: 'পানীয়', slug: 'beverages', icon: '🧃', isActive: true, sortOrder: 9, createdAt: new Date() },
      { name: 'Personal Care', namebn: 'ব্যক্তিগত যত্ন', slug: 'personal-care', icon: '🧴', isActive: true, sortOrder: 10, createdAt: new Date() },
      { name: 'Cleaning', namebn: 'পরিষ্কার', slug: 'cleaning', icon: '🧹', isActive: true, sortOrder: 11, createdAt: new Date() },
      { name: 'Baby Care', namebn: 'শিশু যত্ন', slug: 'baby-care', icon: '👶', isActive: true, sortOrder: 12, createdAt: new Date() },
    ]);

    const catIds = cats.insertedIds;

    // Create products
    await db.collection('products').insertMany([
      { name: 'Fresh Tomato', namebn: 'তাজা টমেটো', slug: 'fresh-tomato-' + Date.now(), category: catIds[0], price: 60, discountPrice: 50, discountPercent: 17, stock: 120, unit: 'kg', isFeatured: true, isOrganic: true, isActive: true, images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'], rating: 4.5, numReviews: 28, totalSold: 150, tags: ['fresh', 'organic'], description: 'Farm-fresh tomatoes harvested daily.', reviews: [], createdAt: new Date() },
      { name: 'Hilsa Fish', namebn: 'ইলিশ মাছ', slug: 'hilsa-fish-' + Date.now(), category: catIds[3], price: 1200, discountPrice: 1100, discountPercent: 8, stock: 20, unit: 'kg', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'], rating: 4.8, numReviews: 45, totalSold: 89, tags: ['fish'], description: 'The national fish of Bangladesh.', reviews: [], createdAt: new Date() },
      { name: 'Miniket Rice', namebn: 'মিনিকেট চাল', slug: 'miniket-rice-' + Date.now(), category: catIds[2], price: 75, discountPrice: 0, stock: 300, unit: 'kg', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'], rating: 4.3, numReviews: 67, totalSold: 220, tags: ['rice'], description: 'Premium quality Miniket rice.', reviews: [], createdAt: new Date() },
      { name: 'Country Eggs', namebn: 'দেশি ডিম', slug: 'country-eggs-' + Date.now(), category: catIds[4], price: 150, discountPrice: 140, discountPercent: 7, stock: 200, unit: 'dozen', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], rating: 4.6, numReviews: 89, totalSold: 310, tags: ['eggs', 'protein'], description: 'Fresh country eggs from free-range hens.', reviews: [], createdAt: new Date() },
      { name: 'Banana Dozen', namebn: 'কলা (ডজন)', slug: 'banana-dozen-' + Date.now(), category: catIds[1], price: 80, discountPrice: 70, discountPercent: 13, stock: 60, unit: 'dozen', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'], rating: 4.2, numReviews: 34, totalSold: 180, tags: ['fruit'], description: 'Fresh ripe bananas.', reviews: [], createdAt: new Date() },
      { name: 'Chicken Breast 500g', namebn: 'চিকেন ব্রেস্ট', slug: 'chicken-breast-' + Date.now(), category: catIds[3], price: 250, discountPrice: 230, discountPercent: 8, stock: 40, unit: '500g', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'], rating: 4.4, numReviews: 52, totalSold: 145, tags: ['chicken', 'protein'], description: 'Fresh boneless chicken breast.', reviews: [], createdAt: new Date() },
      { name: 'Mango Himsagar', namebn: 'আম (হিমসাগর)', slug: 'mango-himsagar-' + Date.now(), category: catIds[1], price: 280, discountPrice: 250, discountPercent: 11, stock: 35, unit: 'kg', isFeatured: true, isActive: true, images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400'], rating: 4.9, numReviews: 112, totalSold: 267, tags: ['mango', 'seasonal'], description: 'The king of mangoes — sweet and aromatic.', reviews: [], createdAt: new Date() },
      { name: 'Full Cream Milk 1L', namebn: 'ফুল ক্রিম মিল্ক', slug: 'full-cream-milk-' + Date.now(), category: catIds[4], price: 120, discountPrice: 0, stock: 100, unit: '1 liter', isActive: true, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'], rating: 4.5, numReviews: 41, totalSold: 198, tags: ['milk', 'dairy'], description: 'Pure full cream pasteurized milk.', reviews: [], createdAt: new Date() },
      { name: 'Soybean Oil 5L', namebn: 'সয়াবিন তেল', slug: 'soybean-oil-' + Date.now(), category: catIds[5], price: 950, discountPrice: 0, stock: 80, unit: '5 liter', isActive: true, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'], rating: 4.1, numReviews: 23, totalSold: 95, tags: ['oil', 'cooking'], description: 'Premium quality soybean cooking oil.', reviews: [], createdAt: new Date() },
      { name: 'Turmeric Powder 100g', namebn: 'হলুদ গুঁড়া', slug: 'turmeric-powder-' + Date.now(), category: catIds[6], price: 45, discountPrice: 0, stock: 500, unit: '100g', isActive: true, images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'], rating: 4.3, numReviews: 56, totalSold: 340, tags: ['spice', 'turmeric'], description: 'Pure turmeric powder with high curcumin.', reviews: [], createdAt: new Date() },
      { name: 'Potato', namebn: 'আলু', slug: 'potato-' + Date.now(), category: catIds[0], price: 35, discountPrice: 30, discountPercent: 14, stock: 500, unit: 'kg', isActive: true, images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400'], rating: 4.1, numReviews: 44, totalSold: 420, tags: ['vegetable'], description: 'Fresh potatoes, versatile ingredient.', reviews: [], createdAt: new Date() },
      { name: 'Onion', namebn: 'পেঁয়াজ', slug: 'onion-' + Date.now(), category: catIds[0], price: 55, discountPrice: 50, discountPercent: 9, stock: 400, unit: 'kg', isActive: true, images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'], rating: 4.0, numReviews: 31, totalSold: 380, tags: ['vegetable'], description: 'Fresh onions, essential for every kitchen.', reviews: [], createdAt: new Date() },
    ]);

    res.json({
      success: true,
      message: '🎉 Database seeded successfully!',
      results: {
        admin: '✅ admin@ghorerbazar.com / Admin@123',
        categories: '✅ 12 categories created',
        products: '✅ 12 products created'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
