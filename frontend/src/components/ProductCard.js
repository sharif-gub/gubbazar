import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Login to add to wishlist'); return; }
    try {
      await API.post(`/users/wishlist/${product._id}`);
      toast.success('Wishlist updated');
    } catch {}
  };

  return (
    <div className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      {/* Discount badge */}
      {hasDiscount && (
        <div style={{ position: 'absolute', top: 8, left: 8, background: '#ef4444', color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, zIndex: 1 }}>
          -{product.discountPercent}%
        </div>
      )}
      {/* Wishlist */}
      <button onClick={toggleWishlist} style={{ position: 'absolute', top: 8, right: 8, background: 'white', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 1, color: '#ef4444' }}>
        <FiHeart size={14} />
      </button>

      <Link to={`/products/${product.slug}`}>
        <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f9fafb' }}>
          <img
            src={product.images?.[0] || `https://via.placeholder.com/300x300?text=${product.name}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = ''}
          />
        </div>
      </Link>

      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: 11, color: '#16a34a', marginBottom: 4 }}>{product.category?.name}</div>
        <Link to={`/products/${product.slug}`}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 4 }} className="line-clamp-2">{product.name}</h3>
        </Link>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <FiStar size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: 12, color: '#6b7280' }}>{product.rating?.toFixed(1)} ({product.numReviews})</span>
          </div>
        )}

        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>per {product.unit}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#1f2937' }}>৳{price}</span>
            {hasDiscount && <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through', marginLeft: 6 }}>৳{product.price}</span>}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            style={{
              background: product.stock > 0 ? '#16a34a' : '#e5e7eb',
              color: product.stock > 0 ? 'white' : '#9ca3af',
              borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600
            }}
          >
            <FiShoppingCart size={14} />
            {product.stock > 0 ? 'Add' : 'Out'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <div style={{ fontSize: 11, color: '#f97316', marginTop: 6 }}>⚠️ Only {product.stock} left</div>
        )}
      </div>
    </div>
  );
}
