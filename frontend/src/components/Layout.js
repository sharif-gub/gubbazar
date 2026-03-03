import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiHeart, FiHome, FiGrid, FiPhone } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';

function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => API.get('/categories').then(r => r.data.categories)
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* Top Bar */}
      <div style={{ background: '#15803d', color: 'white', fontSize: '13px', padding: '6px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🚚 Free delivery on orders over ৳500</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone size={12} /> 01700-000000</span>
        </div>
      </div>

      {/* Main Header */}
      <header style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, background: '#16a34a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛒</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#16a34a', lineHeight: 1 }}>GhorerBazar</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>ঘরের বাজার</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 600 }}>
            <div style={{ display: 'flex', width: '100%', border: '2px solid #16a34a', borderRadius: 10, overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="Search for vegetables, fruits, rice..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', fontSize: 14, border: 'none', outline: 'none' }}
              />
              <button type="submit" style={{ background: '#16a34a', color: 'white', padding: '0 20px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link to="/cart" style={{ position: 'relative', padding: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1f2937', gap: 2 }}>
              <div style={{ position: 'relative' }}>
                <FiShoppingCart size={22} />
                {count > 0 && (
                  <span style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{count}</span>
                )}
              </div>
              <span style={{ fontSize: 10, color: '#6b7280' }}>Cart</span>
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', padding: 8, color: '#1f2937' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>{user.name.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', background: 'white', borderRadius: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: 180, zIndex: 200 }} onClick={() => setUserMenuOpen(false)}>
                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}><FiUser size={15}/> My Profile</Link>
                    <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}><FiPackage size={15}/> My Orders</Link>
                    <Link to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}><FiHeart size={15}/> Wishlist</Link>
                    {isAdmin && <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#16a34a', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>⚙️ Admin Panel</Link>}
                    <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#ef4444', width: '100%', background: 'none', fontFamily: 'inherit', fontSize: 14 }}><FiLogOut size={15}/> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: 8, color: '#1f2937' }}>
                <FiUser size={22} />
                <span style={{ fontSize: 10, color: '#6b7280' }}>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Category Nav */}
        <div style={{ borderTop: '1px solid #f3f4f6', overflowX: 'auto', background: 'white' }}>
          <div className="container" style={{ display: 'flex', gap: 0 }}>
            {catData?.slice(0, 10).map(cat => (
              <Link key={cat._id} to={`/category/${cat._id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', whiteSpace: 'nowrap', color: '#374151', fontSize: 13, fontWeight: 500, borderBottom: '2px solid transparent', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = '#16a34a'}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}

function MobileNav() {
  const location = useLocation();
  const { count } = useCart();
  const active = (path) => location.pathname === path;

  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', display: 'none', zIndex: 100, padding: '8px 0' }} className="mobile-nav">
      <style>{`@media(max-width:768px){.mobile-nav{display:flex!important}}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        {[
          { path: '/', icon: <FiHome size={22}/>, label: 'Home' },
          { path: '/products', icon: <FiGrid size={22}/>, label: 'Shop' },
          { path: '/cart', icon: <FiShoppingCart size={22}/>, label: 'Cart', badge: count },
          { path: '/orders', icon: <FiPackage size={22}/>, label: 'Orders' },
          { path: '/profile', icon: <FiUser size={22}/>, label: 'Profile' }
        ].map(item => (
          <Link key={item.path} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 12px', color: active(item.path) ? '#16a34a' : '#9ca3af', position: 'relative' }}>
            {item.badge > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 8, background: '#ef4444', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</span>
            )}
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#1f2937', color: '#9ca3af', marginTop: 60 }}>
      <div className="container" style={{ padding: '48px 16px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>🛒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'white' }}>GhorerBazar</div>
                <div style={{ fontSize: 12 }}>ঘরের বাজার</div>
              </div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Fresh groceries delivered to your doorstep. Quality products at the best prices.</p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 12 }}>Quick Links</h4>
            {['Home', 'Products', 'Cart', 'My Orders', 'Profile'].map(l => (
              <div key={l} style={{ marginBottom: 8 }}><Link to={`/${l.toLowerCase().replace(' ', '')}`} style={{ fontSize: 13, color: '#9ca3af' }}>{l}</Link></div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 12 }}>Categories</h4>
            {['Vegetables', 'Fruits', 'Meat & Fish', 'Dairy & Eggs', 'Rice & Grains'].map(c => (
              <div key={c} style={{ marginBottom: 8 }}><Link to="/products" style={{ fontSize: 13, color: '#9ca3af' }}>{c}</Link></div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: 12 }}>Contact</h4>
            <div style={{ fontSize: 13, lineHeight: 2 }}>
              <div>📞 01700-000000</div>
              <div>📧 info@ghorerbazar.com</div>
              <div>📍 Dhaka, Bangladesh</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 8, color: 'white', fontSize: 12, fontWeight: 500 }}>Payment Methods</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['bKash', 'Nagad', 'Rocket', 'COD'].map(p => (
                    <span key={p} style={{ background: '#374151', padding: '3px 8px', borderRadius: 4, fontSize: 11 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #374151', paddingTop: 16, textAlign: 'center', fontSize: 12 }}>
          © 2024 GhorerBazar. All rights reserved. Built with ❤️ in Bangladesh
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }} className="has-bottom-nav">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
