# GhorerBazar - Full Stack Grocery E-Commerce

A complete grocery delivery platform (React + Node.js + MongoDB) deployable on Vercel.

## 🚀 Tech Stack
- **Frontend**: React 18, Tailwind CSS, React Router v6, React Query
- **Backend**: Node.js, Express.js, JWT Auth
- **Database**: MongoDB Atlas (with Mongoose)
- **Payment**: SSLCommerz / bKash integration ready
- **Deployment**: Vercel (frontend + serverless backend)

## 📁 Project Structure
```
ghorerbazar/
├── frontend/          # React app
├── backend/           # Express API
├── vercel.json        # Vercel deployment config
└── README.md
```

## 🛠️ Local Setup

### 1. Clone & Install
```bash
# Backend
cd backend
npm install
cp .env.example .env  # Fill in your values

# Frontend
cd ../frontend
npm install
```

### 2. Environment Variables (backend/.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ghorerbazar
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_EMAIL=admin@ghorerbazar.com
ADMIN_PASSWORD=Admin@123
```

### 3. Seed Database
```bash
cd backend
npm run seed
```

### 4. Run Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## 🌐 Vercel Deployment

### Deploy Backend (API)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `backend`
4. Add all env variables
5. Deploy → note the API URL

### Deploy Frontend
1. Import frontend folder in Vercel
2. Set env: `REACT_APP_API_URL=https://your-backend.vercel.app`
3. Deploy

## 📱 Mobile App (React Native / Capacitor)
The frontend is PWA-ready. To build as a mobile app:
```bash
cd frontend
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap add ios
npm run build
npx cap sync
```

## 🔑 Admin Panel
- URL: `http://localhost:3000/admin`
- Default: admin@ghorerbazar.com / Admin@123
- Change after first login!

## 📊 Features
- ✅ Product catalog with categories
- ✅ Search & filter
- ✅ Shopping cart & wishlist
- ✅ User auth (JWT)
- ✅ Order management
- ✅ Admin dashboard
- ✅ Product CRUD
- ✅ Order status tracking
- ✅ Mobile responsive (PWA)
- ✅ Bangladesh phone auth ready
