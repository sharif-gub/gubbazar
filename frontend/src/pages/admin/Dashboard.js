import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import API from '../../utils/api';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiClock, FiSun } from 'react-icons/fi';

function StatCard({ icon, title, value, sub, color }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#1f2937' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 20 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => API.get('/admin/stats').then(r => r.data)
  });

  if (isLoading) return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Dashboard</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="card" style={{ padding: 20, height: 100 }} className="animate-pulse" />
        ))}
      </div>
    </div>
  );

  const { stats, charts } = data || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Welcome back! Here's what's happening.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', padding: '8px 16px', borderRadius: 10, color: '#16a34a', fontSize: 14, fontWeight: 500 }}>
          <FiSun /> Today: {stats?.todayOrders || 0} orders
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<FiDollarSign />} title="Total Revenue" value={`৳${(stats?.revenue || 0).toLocaleString()}`} sub="From paid orders" color="#16a34a" />
        <StatCard icon={<FiPackage />} title="Total Orders" value={stats?.totalOrders || 0} sub={`${stats?.pendingOrders || 0} pending`} color="#3b82f6" />
        <StatCard icon={<FiUsers />} title="Total Users" value={stats?.totalUsers || 0} color="#8b5cf6" />
        <StatCard icon={<FiShoppingBag />} title="Products" value={stats?.totalProducts || 0} color="#f97316" />
        <StatCard icon={<FiClock />} title="Pending" value={stats?.pendingOrders || 0} sub="Need attention" color="#ef4444" />
        <StatCard icon={<FiSun />} title="Today Orders" value={stats?.todayOrders || 0} color="#f59e0b" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={charts?.last7Days || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="orders" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts?.last7Days || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(val) => `৳${val}`} />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🔥 Top Selling Products</h3>
          {charts?.topProducts?.map((p, i) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#f59e0b'][i] + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: ['#16a34a', '#3b82f6', '#f97316', '#8b5cf6', '#f59e0b'][i] }}>
                {i + 1}
              </span>
              <img src={p.images?.[0]} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }} className="line-clamp-1">{p.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>৳{p.price}</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{p.totalSold} sold</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>📊 Order Status</h3>
          {charts?.statusBreakdown?.map(s => (
            <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ textTransform: 'capitalize', fontSize: 14 }}>{s._id}</span>
              <span style={{ fontWeight: 700, background: '#f3f4f6', padding: '2px 10px', borderRadius: 20, fontSize: 13 }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
