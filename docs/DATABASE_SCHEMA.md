# GhorerBazar Database Schema

## MongoDB Collections

### users
```
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, required),
  phone: String (unique, sparse),
  password: String (hashed, select:false),
  avatar: String,
  role: "user" | "admin",
  addresses: [{
    label: String,
    street: String,
    area: String,
    city: String,
    phone: String,
    isDefault: Boolean
  }],
  wishlist: [ObjectId -> products],
  isActive: Boolean,
  lastLogin: Date,
  createdAt, updatedAt
}
```

### categories
```
{
  _id: ObjectId,
  name: String (unique, required),
  namebn: String (Bengali),
  slug: String (unique, auto-generated),
  image: String,
  icon: String (emoji),
  parent: ObjectId -> categories (null for root),
  isActive: Boolean,
  sortOrder: Number,
  createdAt, updatedAt
}
```

### products
```
{
  _id: ObjectId,
  name: String (required),
  namebn: String,
  slug: String (unique, auto-generated),
  description: String,
  category: ObjectId -> categories (required),
  brand: String,
  unit: "piece"|"kg"|"gram"|"liter"|"ml"|"dozen"|"pack"|"bag",
  weight: Number (grams),
  images: [String],
  price: Number (required),
  discountPrice: Number,
  discountPercent: Number (auto-calculated),
  stock: Number (required),
  minOrder: Number,
  maxOrder: Number,
  isActive: Boolean,
  isFeatured: Boolean,
  isOrganic: Boolean,
  tags: [String],
  reviews: [{
    user: ObjectId,
    name: String,
    rating: 1-5,
    comment: String,
    createdAt: Date
  }],
  rating: Number (avg),
  numReviews: Number,
  totalSold: Number,
  createdAt, updatedAt
}
// Index: text index on name, description, tags
```

### orders
```
{
  _id: ObjectId,
  orderNumber: String (auto: GB001001),
  user: ObjectId -> users (required),
  items: [{
    product: ObjectId,
    name: String,
    image: String,
    price: Number,
    quantity: Number,
    unit: String
  }],
  shippingAddress: {
    name, phone, street, area, city
  },
  paymentMethod: "cash_on_delivery"|"bkash"|"nagad"|"rocket"|"card"|"sslcommerz",
  paymentStatus: "pending"|"paid"|"failed"|"refunded",
  paymentResult: { id, status, update_time, val_id },
  itemsPrice: Number,
  shippingPrice: Number,
  discountAmount: Number,
  totalPrice: Number,
  couponCode: String,
  status: "pending"|"confirmed"|"processing"|"packed"|"shipped"|"delivered"|"cancelled",
  statusHistory: [{ status, note, updatedAt }],
  deliverySlot: { date, slot },
  note: String,
  isDelivered: Boolean,
  deliveredAt: Date,
  createdAt, updatedAt
}
```

## Relationships
- User → Orders (1:Many)
- User → Wishlist → Products (M:N)
- Product → Category (Many:1)
- Order → Products (M:N via items)
- Category → Category (Parent:Child)
