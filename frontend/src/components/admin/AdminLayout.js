import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi';

const navItems = [
  { path: '/admin', icon: <FiGrid />, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: <FiShoppingBag />, label: 'Products' },
  { path: '/admin/orders', icon: <FiPackage />, label: 'Orders' },
  { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
  { path: '/admin/categories', icon: <FiTag />, label: 'Categories' }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <>
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #374151' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 28 }}>🛒</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>GhorerBazar</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Admin Panel</div>
            </div>
          )}
        </div>
      </div>
      <nav style={{ padding: '12px 0', flex: 1 }}>
        {navItems.map(item => (
          <Link key={item.path} to={item.path} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
            color: isActive(item.path, item.exact) ? '#4ade80' : '#9ca3af',
            background: isActive(item.path, item.exact) ? 'rgba(74,222,128,0.1)' : 'transparent',
            borderLeft: `3px solid ${isActive(item.path, item.exact) ? '#16a34a' : 'transparent'}`,
            transition: 'all 0.2s', fontWeight: isActive(item.path, item.exact) ? 600 : 400, fontSize: 14
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #374151' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9ca3af', fontSize: 14, marginBottom: 10 }}>
          <FiHome size={16} /> {sidebarOpen && 'Go to Store'}
        </Link>
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444', background: 'none', fontSize: 14, width: '100%' }}>
          <FiLogOut size={16} /> {sidebarOpen && 'Logout'}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 64, background: '#1f2937', display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width 0.2s', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <SidebarContent />
      </div>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? 220 : 64, transition: 'margin-left 0.2s', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', color: '#6b7280', padding: 4 }}>
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right', display: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>Administrator</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
              {user?.name?.[0]}
            </div>
          </div>
        </header>
        {/* Content */}
        <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
