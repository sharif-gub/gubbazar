import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = { pending: '#f97316', confirmed: '#3b82f6', processing: '#8b5cf6', packed: '#6366f1', shipped: '#06b6d4', delivered: '#16a34a', cancelled: '#ef4444' };
const statusOptions = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data } = useQuery({
    queryKey: ['admin-orders', filterStatus, page],
    queryFn: () => API.get(`/orders?${filterStatus ? `status=${filterStatus}&` : ''}page=${page}&limit=15`).then(r => r.data)
  });

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      qc.invalidateQueries(['admin-orders']);
      if (selected?._id === orderId) setSelected(prev => ({ ...prev, status }));
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Orders ({data?.total || 0})</h1>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => { setFilterStatus(''); setPage(1); }} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${!filterStatus ? '#16a34a' : '#e5e7eb'}`, background: !filterStatus ? '#16a34a' : 'white', color: !filterStatus ? 'white' : '#374151', fontSize: 12, fontWeight: 500 }}>All</button>
        {statusOptions.map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }} style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${filterStatus === s ? statusColor[s] : '#e5e7eb'}`, background: filterStatus === s ? statusColor[s] + '15' : 'white', color: filterStatus === s ? statusColor[s] : '#374151', fontSize: 12, fontWeight: 500, textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.orders?.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#16a34a' }}>{order.orderNumber}</td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: 500 }}>{order.user?.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{order.user?.phone}</div>
                </td>
                <td style={{ padding: '10px 14px' }}>{order.items?.length} items</td>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>৳{order.totalPrice}</td>
                <td style={{ padding: '10px 14px', textTransform: 'capitalize', fontSize: 12, color: '#6b7280' }}>{order.paymentMethod.replace(/_/g, ' ')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: statusColor[order.status] + '20', color: statusColor[order.status], padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} style={{ padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 12, cursor: 'pointer', background: 'white' }}>
                    {statusOptions.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data?.orders?.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No orders found</div>
      )}
    </div>
  );
}
