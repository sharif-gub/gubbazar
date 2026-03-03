import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';

const emptyProduct = { name: '', category: '', price: '', discountPrice: '', stock: '', unit: 'piece', description: '', isFeatured: false, isOrganic: false, images: [''] };

export default function AdminProducts() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => API.get(`/products?limit=15&page=${page}${search ? `&search=${search}` : ''}&isActive=true`).then(r => r.data)
  });

  const { data: cats } = useQuery({ queryKey: ['categories'], queryFn: () => API.get('/categories').then(r => r.data.categories) });

  const openEdit = (product) => {
    setForm({ ...product, category: product.category?._id || product.category });
    setModal('edit');
  };

  const save = async () => {
    if (!form.name || !form.category || !form.price) { toast.error('Fill required fields'); return; }
    setSaving(true);
    try {
      if (modal === 'add') {
        await API.post('/products', form);
        toast.success('Product created!');
      } else {
        await API.put(`/products/${form._id}`, form);
        toast.success('Product updated!');
      }
      qc.invalidateQueries(['admin-products']);
      setModal(null);
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Deleted');
      qc.invalidateQueries(['admin-products']);
    } catch (err) {
      toast.error('Failed');
    }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontFamily: 'inherit' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Products ({data?.pagination?.total || 0})</h1>
        <button onClick={() => { setForm(emptyProduct); setModal('add'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: 'white', padding: '10px 16px', borderRadius: 8, fontWeight: 600, fontSize: 13 }}>
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ ...inputStyle, paddingLeft: 36 }} />
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.products?.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '10px 16px' }}>
                  <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 600, maxWidth: 180 }} className="line-clamp-1">{p.name}</div>
                  {p.isFeatured && <span style={{ fontSize: 10, background: '#fff7ed', color: '#92400e', padding: '1px 6px', borderRadius: 4 }}>Featured</span>}
                </td>
                <td style={{ padding: '10px 16px', color: '#6b7280' }}>{p.category?.name}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 700 }}>৳{p.discountPrice > 0 ? p.discountPrice : p.price}</div>
                  {p.discountPrice > 0 && <div style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: 11 }}>৳{p.price}</div>}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ color: p.stock > 10 ? '#16a34a' : p.stock > 0 ? '#f97316' : '#ef4444', fontWeight: 600 }}>{p.stock}</span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{ background: p.isActive ? '#dcfce7' : '#fee2e2', color: p.isActive ? '#166534' : '#dc2626', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '6px 10px', background: '#eff6ff', color: '#3b82f6', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button onClick={() => deleteProduct(p._id)} style={{ padding: '6px 10px', background: '#fef2f2', color: '#ef4444', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 16 }}>
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${page === p ? '#16a34a' : '#e5e7eb'}`, background: page === p ? '#16a34a' : 'white', color: page === p ? 'white' : '#374151', fontSize: 13, cursor: 'pointer' }}>{p}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', color: '#6b7280' }}><FiX size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Product name" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                  <option value="">Select Category</option>
                  {cats?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Unit</label>
                <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} style={inputStyle}>
                  {['piece', 'kg', 'gram', 'liter', 'ml', 'dozen', 'pack', 'bag'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Price (৳) *</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Discount Price (৳)</label>
                <input type="number" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Stock *</label>
                <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} placeholder="0" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Image URL</label>
                <input value={form.images?.[0] || ''} onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))} style={inputStyle} placeholder="https://..." />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Product description..." />
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ accentColor: '#16a34a' }} /> Featured
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={form.isOrganic} onChange={e => setForm(f => ({ ...f, isOrganic: e.target.checked }))} style={{ accentColor: '#16a34a' }} /> Organic
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={save} disabled={saving} style={{ padding: '10px 20px', background: '#16a34a', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 13, opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : (modal === 'add' ? 'Create Product' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
