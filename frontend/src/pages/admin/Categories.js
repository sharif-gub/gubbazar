import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const emptyForm = { name: '', namebn: '', icon: '🛒', sortOrder: 0 };

export default function AdminCategories() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => API.get('/categories').then(r => r.data.categories)
  });

  const save = async () => {
    if (!form.name) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        await API.post('/categories', form);
        toast.success('Category created!');
      } else {
        await API.put(`/categories/${form._id}`, form);
        toast.success('Updated!');
      }
      qc.invalidateQueries(['categories']);
      setModal(null);
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete?')) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success('Deleted');
      qc.invalidateQueries(['categories']);
    } catch { toast.error('Failed'); }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontFamily: 'inherit' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Categories ({categories?.length || 0})</h1>
        <button onClick={() => { setForm(emptyForm); setModal('add'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: 'white', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
          <FiPlus /> Add Category
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {categories?.map(cat => (
          <div key={cat._id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>{cat.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</div>
              {cat.namebn && <div style={{ fontSize: 12, color: '#6b7280', fontFamily: 'Hind Siliguri' }}>{cat.namebn}</div>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => { setForm(cat); setModal('edit'); }} style={{ padding: 6, background: '#eff6ff', color: '#3b82f6', borderRadius: 6 }}>
                <FiEdit2 size={13} />
              </button>
              <button onClick={() => deleteCategory(cat._id)} style={{ padding: 6, background: '#fef2f2', color: '#ef4444', borderRadius: 6 }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>{modal === 'add' ? 'Add Category' : 'Edit Category'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none' }}><FiX /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Name (English) *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              <input placeholder="নাম (Bengali)" value={form.namebn} onChange={e => setForm(f => ({ ...f, namebn: e.target.value }))} style={{ ...inputStyle, fontFamily: 'Hind Siliguri, sans-serif' }} />
              <input placeholder="Icon emoji 🛒" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} style={inputStyle} />
              <input type="number" placeholder="Sort Order" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: '#16a34a', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 13, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
