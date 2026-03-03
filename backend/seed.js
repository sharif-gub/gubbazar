require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Vegetables', namebn: 'শাকসবজি', icon: '🥦', sortOrder: 1 },
  { name: 'Fruits', namebn: 'ফলমূল', icon: '🍎', sortOrder: 2 },
  { name: 'Rice & Grains', namebn: 'চাল ও শস্য', icon: '🌾', sortOrder: 3 },
  { name: 'Meat & Fish', namebn: 'মাছ ও মাংস', icon: '🐟', sortOrder: 4 },
  { name: 'Dairy & Eggs', namebn: 'দুগ্ধ ও ডিম', icon: '🥚', sortOrder: 5 },
  { name: 'Cooking Oil', namebn: 'রান্নার তেল', icon: '🫙', sortOrder: 6 },
  { name: 'Spices', namebn: 'মশলা', icon: '🌶️', sortOrder: 7 },
  { name: 'Snacks', namebn: 'স্ন্যাকস', icon: '🍪', sortOrder: 8 },
  { name: 'Beverages', namebn: 'পানীয়', icon: '🧃', sortOrder: 9 },
  { name: 'Cleaning', namebn: 'পরিষ্কার', icon: '🧹', sortOrder: 10 },
  { name: 'Personal Care', namebn: 'ব্যক্তিগত যত্ন', icon: '🧴', sortOrder: 11 },
  { name: 'Baby Care', namebn: 'শিশু যত্ন', icon: '👶', sortOrder: 12 }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ghorerbazar');
  console.log('Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  // Create admin
  await User.create({
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@ghorerbazar.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    phone: '01700000000'
  });
  console.log('✅ Admin created: admin@ghorerbazar.com / Admin@123');

  // Create categories
  const createdCats = await Category.insertMany(categories.map(c => ({ ...c, slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') })));
  console.log(`✅ ${createdCats.length} categories created`);

  const catMap = {};
  createdCats.forEach(c => catMap[c.name] = c._id);

  // Create sample products
  const products = [
    { name: 'Fresh Tomato', namebn: 'তাজা টমেটো', category: catMap['Vegetables'], price: 60, discountPrice: 50, stock: 100, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'], tags: ['fresh', 'organic'] },
    { name: 'Hilsa Fish', namebn: 'ইলিশ মাছ', category: catMap['Meat & Fish'], price: 1200, discountPrice: 1100, stock: 30, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'] },
    { name: 'Miniket Rice', namebn: 'মিনিকেট চাল', category: catMap['Rice & Grains'], price: 75, stock: 200, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'] },
    { name: 'Broccoli', namebn: 'ব্রকলি', category: catMap['Vegetables'], price: 120, stock: 50, unit: 'piece', images: ['https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'] },
    { name: 'Banana (Dozen)', namebn: 'কলা (ডজন)', category: catMap['Fruits'], price: 80, discountPrice: 70, stock: 80, unit: 'dozen', isFeatured: true, images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'] },
    { name: 'Full Cream Milk 1L', namebn: 'ফুল ক্রিম মিল্ক ১ লিটার', category: catMap['Dairy & Eggs'], price: 120, stock: 150, unit: 'liter', images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'] },
    { name: 'Country Eggs (Dozen)', namebn: 'দেশি ডিম (ডজন)', category: catMap['Dairy & Eggs'], price: 150, discountPrice: 140, stock: 200, unit: 'dozen', isFeatured: true, images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'] },
    { name: 'Soybean Oil 5L', namebn: 'সয়াবিন তেল ৫ লিটার', category: catMap['Cooking Oil'], price: 950, stock: 60, unit: 'liter', images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'] },
    { name: 'Turmeric Powder 100g', namebn: 'হলুদ গুঁড়া ১০০ গ্রাম', category: catMap['Spices'], price: 45, stock: 300, unit: 'gram', images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'] },
    { name: 'Mango (Himsagar)', namebn: 'আম (হিমসাগর)', category: catMap['Fruits'], price: 280, discountPrice: 250, stock: 40, unit: 'kg', isFeatured: true, images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400'] },
    { name: 'Rui Fish', namebn: 'রুই মাছ', category: catMap['Meat & Fish'], price: 350, stock: 50, unit: 'kg', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'] },
    { name: 'Chicken Breast 500g', namebn: 'চিকেন ব্রেস্ট ৫০০ গ্রাম', category: catMap['Meat & Fish'], price: 250, discountPrice: 230, stock: 70, unit: 'gram', isFeatured: true, images: ['https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400'] }
  ];

  for (const p of products) {
    const prod = new Product(p);
    await prod.save();
  }
  console.log(`✅ ${products.length} products created`);
  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
