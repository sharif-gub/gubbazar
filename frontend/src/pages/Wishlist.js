import React from 'react';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => API.get('/users/wishlist').then(r => r.data.wishlist)
  });

  if (isLoading) return <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>❤️ My Wishlist ({data?.length || 0})</h1>
      {!data?.length ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💔</div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Your wishlist is empty</h2>
          <Link to="/products" style={{ color: '#16a34a', fontWeight: 600 }}>Browse Products →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
          {data.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
