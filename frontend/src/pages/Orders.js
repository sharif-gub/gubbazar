import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';

const statusColor = {
  pending: { bg: '#fff7ed', color: '#92400e', label: '⏳ Pending' },
  confirmed: { bg: '#eff6ff', color: '#1d4ed8', label: '✅ Confirmed' },
  processing: { bg: '#f0fdf4', color: '#166534', label: '⚙️ Processing' },
  packed: { bg: '#faf5ff', color: '#7c3aed', label: '📦 Packed' },
  shipped: { bg: '#ecfeff', color: '#0e7490', label: '🚚 Shipped' },
  delivered: { bg: '#f0fdf4', color: '#166534', label: '✅ Delivered' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', label: '❌ Cancelled' }
};

export default function Orders() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => API.get('/orders/my').then(r => r.data.orders)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading orders...</div>;

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Orders</h1>
      {!data?.length ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No orders yet</h2>
          <Link to="/products" style={{ color: '#16a34a', fontWeight: 600 }}>Start Shopping →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.map(order => {
            const s = statusColor[order.status] || statusColor.pending;
            return (
              <Link key={order._id} to={`/orders/${order._id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    {order.items.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                    ))}
                    {order.items.length > 3 && <div style={{ width: 50, height: 50, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#6b7280' }}>+{order.items.length - 3}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{order.orderNumber}</span>
                      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      {order.items.length} item(s) · ৳{order.totalPrice} · {order.paymentMethod.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
