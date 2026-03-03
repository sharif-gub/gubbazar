import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiStar } from 'react-icons/fi';

function HeroBanner() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)', color: 'white', padding: '48px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
        <div className="fade-in">
          <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 16 }}>
            🎉 New User? Get 10% OFF
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Fresh Groceries<br />Delivered in<br /><span style={{ color: '#bbf7d0' }}>2 Hours!</span>
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>
            Order fresh vegetables, fruits, meat & more from local farms directly to your door in Dhaka.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/products" className="btn" style={{ background: 'white', color: '#16a34a', fontWeight: 700, fontSize: 15 }}>
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?featured=true" className="btn" style={{ border: '2px solid white', color: 'white' }}>
              Today's Deals
            </Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 120, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
          {['🥦', '🍅', '🐟', '🥕', '🧅', '🍋'].map((e, i) => (
            <span key={i} style={{ fontSize: 'clamp(30px, 5vw, 60px)', animation: `pulse ${1.5 + i * 0.2}s ease-in-out infinite` }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Delivery within 2-4 hours' },
    { icon: <FiShield />, title: '100% Fresh', desc: 'Quality guaranteed' },
    { icon: <FiClock />, title: '24/7 Support', desc: 'Always here to help' },
    { icon: <FiStar />, title: 'Best Prices', desc: 'Fair prices daily' }
  ];
  return (
    <div style={{ background: 'white', padding: '24px 0', borderBottom: '1px solid #f3f4f6' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <div style={{ width: 44, height: 44, background: '#dcfce7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: 20 }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => API.get('/categories').then(r => r.data.categories)
  });

  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => API.get('/products?featured=true&limit=8').then(r => r.data)
  });

  const { data: newData } = useQuery({
    queryKey: ['new-products'],
    queryFn: () => API.get('/products?sort=-createdAt&limit=8').then(r => r.data)
  });

  return (
    <div>
      <HeroBanner />
      <Features />

      {/* Promo Banners */}
      <div className="container" style={{ padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)', emoji: '🐟', title: 'Fresh Fish', sub: 'Daily catch available', cta: 'Meat & Fish' },
            { bg: 'linear-gradient(135deg, #dcfce7, #16a34a)', emoji: '🥦', title: 'Organic Veggies', sub: 'Farm fresh daily', cta: 'Vegetables' },
            { bg: 'linear-gradient(135deg, #fee2e2, #ef4444)', emoji: '🍎', title: 'Seasonal Fruits', sub: 'Best prices guaranteed', cta: 'Fruits' }
          ].map((b, i) => (
            <div key={i} style={{ background: b.bg, borderRadius: 16, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{b.title}</h3>
                <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 12 }}>{b.sub}</p>
                <Link to="/products" style={{ background: 'white', color: '#1f2937', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                  Shop Now →
                </Link>
              </div>
              <span style={{ fontSize: 60 }}>{b.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {catData && (
        <div className="container" style={{ padding: '0 16px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Shop by Category</h2>
            <Link to="/products" style={{ color: '#16a34a', fontSize: 14, fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
            {catData.slice(0, 12).map(cat => (
              <Link key={cat._id} to={`/category/${cat._id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px', background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.2s', textAlign: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = '#16a34a'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; }}
              >
                <span style={{ fontSize: 32 }}>{cat.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featuredData?.products?.length > 0 && (
        <div style={{ background: '#f0fdf4', padding: '32px 0' }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700 }}>🔥 Featured Products</h2>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Handpicked quality items</p>
              </div>
              <Link to="/products?featured=true" style={{ color: '#16a34a', fontSize: 14, fontWeight: 500 }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {featuredData.products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {newData?.products?.length > 0 && (
        <div className="container" style={{ padding: '32px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>🆕 New Arrivals</h2>
              <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Fresh additions to our store</p>
            </div>
            <Link to="/products?sort=-createdAt" style={{ color: '#16a34a', fontSize: 14, fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {newData.products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {/* App Download Banner */}
      <div style={{ background: '#1f2937', color: 'white', padding: '48px 0', margin: '32px 0 0' }}>
        <div className="container" style={{ textAlign: 'center', padding: '0 16px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>📱 Get the GhorerBazar App</h2>
          <p style={{ color: '#9ca3af', marginBottom: 24 }}>Shop faster, track orders & get exclusive app-only deals</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{ background: '#374151', color: 'white', padding: '12px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, opacity: 0.7 }}>GET IT ON</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Google Play</div>
              </div>
            </a>
            <a href="#" style={{ background: '#374151', color: 'white', padding: '12px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🍎</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, opacity: 0.7 }}>DOWNLOAD ON THE</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>App Store</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
