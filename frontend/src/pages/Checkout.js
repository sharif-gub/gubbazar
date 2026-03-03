import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'cash_on_delivery', label: 'Cash on Delivery', emoji: '💵' },
  { id: 'bkash', label: 'bKash', emoji: '📱' },
  { id: 'nagad', label: 'Nagad', emoji: '📲' },
  { id: 'rocket', label: 'Rocket', emoji: '🚀' }
];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = total >= 500 ? 0 : 60;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    area: '',
    city: 'Dhaka',
    paymentMethod: 'cash_on_delivery',
    note: ''
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const submit = async () => {
    if (!form.name || !form.phone || !form.area) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { name: form.name, phone: form.phone, street: form.street, area: form.area, city: form.city },
        paymentMethod: form.paymentMethod,
        note: form.note
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' };

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Delivery form */}
        <div>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📍 Delivery Address</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Full Name *" value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
              <input placeholder="Phone Number *" value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} />
              <input placeholder="Area / Thana *" value={form.area} onChange={e => set('area', e.target.value)} style={inputStyle} />
              <input placeholder="Street Address" value={form.street} onChange={e => set('street', e.target.value)} style={inputStyle} />
              <select value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle}>
                {['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>💳 Payment Method</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {paymentMethods.map(pm => (
                <label key={pm.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `2px solid ${form.paymentMethod === pm.id ? '#16a34a' : '#e5e7eb'}`, borderRadius: 10, cursor: 'pointer', background: form.paymentMethod === pm.id ? '#f0fdf4' : 'white' }}>
                  <input type="radio" name="payment" value={pm.id} checked={form.paymentMethod === pm.id} onChange={() => set('paymentMethod', pm.id)} style={{ accentColor: '#16a34a' }} />
                  <span style={{ fontSize: 18 }}>{pm.emoji}</span>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📝 Special Instructions</h2>
            <textarea placeholder="Any special delivery instructions..." value={form.note} onChange={e => set('note', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ padding: 24, position: 'sticky', top: 80 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📦 Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {items.map(item => {
                const price = item.discountPrice > 0 ? item.discountPrice : item.price;
                return (
                  <div key={item._id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={item.images?.[0]} alt={item.name} style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }} className="line-clamp-1">{item.name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>×{item.quantity}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>৳{price * item.quantity}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Subtotal</span><span>৳{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Delivery</span><span style={{ color: shipping === 0 ? '#16a34a' : 'inherit' }}>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                <span>Total</span><span style={{ color: '#16a34a' }}>৳{total + shipping}</span>
              </div>
            </div>
            <button onClick={submit} disabled={loading} style={{ width: '100%', background: '#16a34a', color: 'white', padding: 14, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 20, opacity: loading ? 0.7 : 1 }}>
              {loading ? '⏳ Placing Order...' : '✅ Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
