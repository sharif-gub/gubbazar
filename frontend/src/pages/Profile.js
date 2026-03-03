import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const changePwd = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/change-password', pwdForm);
      toast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' };

  return (
    <div className="container" style={{ padding: '24px 16px', maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>My Profile</h1>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 28 }}>
            {user?.name[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>{user?.email}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
          <button type="submit" disabled={saving} style={{ background: '#16a34a', color: 'white', padding: '12px', borderRadius: 8, fontWeight: 600 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Change Password</h3>
        <form onSubmit={changePwd} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="password" placeholder="Current Password" value={pwdForm.currentPassword} onChange={e => setPwdForm(f => ({ ...f, currentPassword: e.target.value }))} style={inputStyle} />
          <input type="password" placeholder="New Password (min 6)" value={pwdForm.newPassword} onChange={e => setPwdForm(f => ({ ...f, newPassword: e.target.value }))} minLength={6} style={inputStyle} />
          <button type="submit" style={{ background: '#1f2937', color: 'white', padding: '12px', borderRadius: 8, fontWeight: 600 }}>Change Password</button>
        </form>
      </div>
    </div>
  );
}
