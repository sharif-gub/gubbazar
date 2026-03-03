const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://ghorerbazar.vercel.app'
  ],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/seed', require('./routes/seed'));
```
5. Click **"Commit changes"**

### Step 3 — Add SEED_SECRET to Vercel

1. Go to Vercel → your **backend project** → **Settings** → **Environment Variables**
2. Add:

| NAME | VALUE |
|------|-------|
| `SEED_SECRET` | `myseedkey123` |

3. Click **Save** → Go to **Deployments** → **Redeploy**

### Step 4 — Run the Seed by Visiting a URL

Once redeployed, open your browser and visit:
```
https://your-backend.vercel.app/api/seed/run?secret=myseedkey123


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// DB Connection
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sharifur:<sharifur_rahman>@cluster0.zugruoh.mongodb.net/?appName=Cluster0')
  .then(() => {
    console.log('✅ MongoDB Connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
```

6. Click **"Commit changes"**

---

### Step 3 — Check Your Environment Variables on Vercel

1. Go to **vercel.com** → click your **backend project**
2. Go to **Settings** → **Environment Variables**
3. Make sure ALL of these exist:

| NAME | VALUE |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ghorerbazar` |
| `JWT_SECRET` | `ghorerbazar_secret_key_2024` |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `ADMIN_EMAIL` | `admin@ghorerbazar.com` |
| `ADMIN_PASSWORD` | `Admin@123` |
| `SEED_SECRET` | `myseedkey123` |

> ⚠️ If `MONGODB_URI` is wrong or missing, you'll get NOT_FOUND or 500 errors

---

### Step 4 — Redeploy the Backend

1. Vercel → backend project → **"Deployments"** tab
2. Click the **three dots `...`** on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

### Step 5 — Test Your Backend is Working

Once redeployed, open your browser and visit these URLs one by one:

**Test 1 — Health check:**
```
https://your-backend.vercel.app/api/health
