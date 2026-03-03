import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';

export default function ProductList() {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || '-createdAt',
    featured: searchParams.get('featured') || '',
    organic: '',
    inStock: '',
    minPrice: '',
    maxPrice: '',
    page: 1
  });

  const queryParams = new URLSearchParams({
    ...(categoryId && { category: categoryId }),
    ...(filters.sort && { sort: filters.sort }),
    ...(filters.featured && { featured: filters.featured }),
    ...(filters.organic && { organic: filters.organic }),
    ...(filters.inStock && { inStock: filters.inStock }),
    ...(filters.minPrice && { minPrice: filters.minPrice }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
    page: filters.page,
    limit: 20
  }).toString();

  const { data, isLoading } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => API.get(`/products?${queryParams}`).then(r => r.data)
  });

  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: () => API.get('/categories').then(r => r.data.categories) });

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating', label: 'Top Rated' },
    { value: '-totalSold', label: 'Best Selling' }
  ];

  const Skeleton = () => (
    <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ height: 180, background: '#e5e7eb' }} className="animate-pulse" />
      <div style={{ padding: 12 }}>
        <div style={{ height: 12, background: '#e5e7eb', borderRadius: 6, marginBottom: 8 }} className="animate-pulse" />
        <div style={{ height: 16, background: '#e5e7eb', borderRadius: 6, marginBottom: 8, width: '80%' }} className="animate-pulse" />
        <div style={{ height: 20, background: '#e5e7eb', borderRadius: 6, width: '50%' }} className="animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>{categoryId ? catData?.find(c => c._id === categoryId)?.name || 'Category' : 'All Products'}</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{data?.pagination?.total || 0} products found</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filters.sort} onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, background: 'white', cursor: 'pointer' }}>
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', fontSize: 13 }}>
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={{ background: 'white', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Price Range</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="Min ৳" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} style={{ flex: 1, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
                <input type="number" placeholder="Max ৳" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} style={{ flex: 1, padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8 }}>Options</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { key: 'inStock', label: 'In Stock Only' },
                  { key: 'organic', label: 'Organic Only' },
                  { key: 'featured', label: 'Featured Only' }
                ].map(o => (
                  <label key={o.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={filters[o.key] === 'true'} onChange={e => setFilters(f => ({ ...f, [o.key]: e.target.checked ? 'true' : '' }))} />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setFilters({ sort: '-createdAt', featured: '', organic: '', inStock: '', minPrice: '', maxPrice: '', page: 1 })} style={{ marginTop: 12, color: '#ef4444', fontSize: 13, background: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiX size={13} /> Clear Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
        {isLoading ? (
          Array(8).fill(0).map((_, i) => <Skeleton key={i} />)
        ) : data?.products?.length > 0 ? (
          data.products.map(p => <ProductCard key={p._id} product={p} />)
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination?.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setFilters(f => ({ ...f, page: p }))} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${filters.page === p ? '#16a34a' : '#e5e7eb'}`, background: filters.page === p ? '#16a34a' : 'white', color: filters.page === p ? 'white' : '#374151', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
