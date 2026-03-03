import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';

const steps = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
const statusColor = { pending: '#f97316', confirmed: '#3b82f6', processing: '#8b5cf6', packed: '#6366f1', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => API.get(`/orders/${id}`).then(r => r.data.order)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;
  if (!order) return <div style={{ textAlign: 'center', padding: 60 }}>Order not found</div>;

  const currentStep = order.status === 'cancelled' ? -1 : steps.indexOf(order.status);

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24, fontSize: 14, color: '#6b7280' }}>
        <Link to="/orders" style={{ color: '#16a34a' }}>← My Orders</Link>
        <span>/</span>
        <span>{order.orderNumber}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div>
          {/* Status tracker */}
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Order Status</h2>
              <span style={{ background: statusColor[order.status] + '20', color: statusColor[order.status], padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: 'capitalize' }}>
                {order.status}
              </span>
            </div>
            {order.status !== 'cancelled' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {steps.map((step, i) => (
                  <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= currentStep ? '#16a34a' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i <= currentStep ? 'white' : '#9ca3af', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                        {i <= currentStep ? '✓' : i + 1}
                      </div>
                      {i < steps.length - 1 && <div style={{ width: 2, height: 24, background: i < currentStep ? '#16a34a' : '#e5e7eb' }} />}
                    </div>
                    <div style={{ paddingTop: 4, paddingBottom: 16 }}>
                      <div style={{ fontWeight: i <= currentStep ? 600 : 400, fontSize: 14, textTransform: 'capitalize', color: i <= currentStep ? '#1f2937' : '#9ca3af' }}>{step}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#fef2f2', borderRadius: 10, padding: 16, color: '#dc2626', fontWeight: 600 }}>❌ This order was cancelled</div>
            )}
          </div>

          {/* Delivery address */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📍 Delivery Address</h3>
            <div style={{ fontSize: 14, color: '#4b5563', lineHeight: 2 }}>
              <div><strong>{order.shippingAddress.name}</strong></div>
              <div>📞 {order.shippingAddress.phone}</div>
              <div>{order.shippingAddress.street && `${order.shippingAddress.street}, `}{order.shippingAddress.area}, {order.shippingAddress.city}</div>
            </div>
          </div>
        </div>

        <div>
          {/* Items */}
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📦 Order Items</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                <img src={item.image || 'https://via.placeholder.com/60'} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>per {item.unit} × {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>৳{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>💰 Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Subtotal</span><span>৳{order.itemsPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
                <span>Delivery</span><span style={{ color: order.shippingPrice === 0 ? '#16a34a' : 'inherit' }}>{order.shippingPrice === 0 ? 'FREE' : `৳${order.shippingPrice}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, paddingTop: 10, borderTop: '1px solid #f3f4f6' }}>
                <span>Total</span><span style={{ color: '#16a34a' }}>৳{order.totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Payment</span>
                <span style={{ textTransform: 'capitalize' }}>{order.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#6b7280' }}>Order Date</span>
                <span>{new Date(order.createdAt).toLocaleDateString('en-BD')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
