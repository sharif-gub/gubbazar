const mongoose = require('mongoose');
const slugify = require('slugify');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  namebn: { type: String, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, default: '' },
  unit: { type: String, default: 'piece', enum: ['piece', 'kg', 'gram', 'liter', 'ml', 'dozen', 'pack', 'bag'] },
  weight: { type: Number, default: 0 }, // in grams
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  minOrder: { type: Number, default: 1 },
  maxOrder: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  tags: [String],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.discountPrice > 0 && this.price > 0) {
    this.discountPercent = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

productSchema.methods.addReview = function(userId, userName, rating, comment) {
  const existingIdx = this.reviews.findIndex(r => r.user.toString() === userId.toString());
  if (existingIdx >= 0) {
    this.reviews[existingIdx].rating = rating;
    this.reviews[existingIdx].comment = comment;
  } else {
    this.reviews.push({ user: userId, name: userName, rating, comment });
  }
  this.numReviews = this.reviews.length;
  this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.numReviews;
};

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
