import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => API.get('/users?limit=50').then(r => r.data)
  });

  const toggleStatus = async (id, isActive) => {
    try {
      await API.put(`/users/${id}`, { isActive: !isActive });
      toast.success('User status updated');
      qc.invalidateQueries(['admin-users']);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Users ({data?.total || 0})</h1>
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.users?.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{u.email}</td>
                <td style={{ padding: '10px 14px', color: '#6b7280' }}>{u.phone || '-'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: u.role === 'admin' ? '#fef3c7' : '#f3f4f6', color: u.role === 'admin' ? '#92400e' : '#374151', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: u.isActive ? '#dcfce7' : '#fef2f2', color: u.isActive ? '#166534' : '#dc2626', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {u.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#9ca3af', fontSize: 12 }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {u.role !== 'admin' && (
                    <button onClick={() => toggleStatus(u._id, u.isActive)} style={{ padding: '5px 10px', fontSize: 11, borderRadius: 6, border: `1px solid ${u.isActive ? '#fca5a5' : '#86efac'}`, background: u.isActive ? '#fef2f2' : '#f0fdf4', color: u.isActive ? '#dc2626' : '#16a34a', cursor: 'pointer' }}>
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
