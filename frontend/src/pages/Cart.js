import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = total >= 500 ? 0 : 60;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>Add some products to get started</p>
        <Link to="/products" className="btn btn-primary" style={{ fontSize: 15 }}>
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} style={{ color: '#ef4444', fontSize: 13, background: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <FiTrash2 size={14} /> Clear All
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Items */}
        <div style={{ gridColumn: '1 / span 2' }}>
          {items.map(item => {
            const price = item.discountPrice > 0 ? item.discountPrice : item.price;
            return (
              <div key={item._id} className="card" style={{ display: 'flex', gap: 16, padding: 16, marginBottom: 12 }}>
                <Link to={`/products/${item.slug}`}>
                  <img src={item.images?.[0] || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item.slug}`}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }} className="line-clamp-1">{item.name}</h3>
                  </Link>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>per {item.unit}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ padding: '6px 12px', background: '#f9fafb' }}><FiMinus size={13} /></button>
                      <span style={{ padding: '6px 14px', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ padding: '6px 12px', background: '#f9fafb' }}><FiPlus size={13} /></button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>৳{price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item._id)} style={{ color: '#ef4444', background: 'none' }}><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {items.map(item => {
              const price = item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4b5563' }}>
                  <span className="line-clamp-1" style={{ maxWidth: '60%' }}>{item.name} × {item.quantity}</span>
                  <span>৳{price * item.quantity}</span>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>Subtotal</span><span>৳{total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
            </div>
            {total < 500 && (
              <div style={{ background: '#fff7ed', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                💡 Add ৳{500 - total} more for free delivery
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
              <span>Total</span><span>৳{total + shipping}</span>
            </div>
          </div>
          <button onClick={() => navigate(user ? '/checkout' : '/login?redirect=checkout')} style={{ width: '100%', background: '#16a34a', color: 'white', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 20, cursor: 'pointer' }}>
            Proceed to Checkout →
          </button>
          <Link to="/products" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, color: '#6b7280', fontSize: 13 }}>
            <FiArrowLeft size={13} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
