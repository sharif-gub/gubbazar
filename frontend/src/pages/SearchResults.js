import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => API.get(`/products?search=${encodeURIComponent(q)}&limit=24`).then(r => r.data),
    enabled: !!q
  });

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Search Results</h1>
      <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
        {data?.pagination?.total || 0} results for "<strong>{q}</strong>"
      </p>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>Searching...</div>
      ) : data?.products?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
          {data.products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No products found</h2>
          <p>Try different keywords</p>
        </div>
      )}
    </div>
  );
}
