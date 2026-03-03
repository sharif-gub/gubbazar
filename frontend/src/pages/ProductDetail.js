import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiMinus, FiPlus, FiHeart, FiStar, FiShoppingCart, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => API.get(`/products/${slug}`).then(r => r.data.product)
  });

  const product = data;
  const price = product?.discountPrice > 0 ? product.discountPrice : product?.price;

  const submitReview = async () => {
    if (!user) { toast.error('Login to leave a review'); return; }
    try {
      await API.post(`/products/${product._id}/review`, { rating, comment });
      toast.success('Review submitted!');
      refetch();
      setComment('');
    } catch (err) {
      toast.error(err.message || 'Error submitting review');
    }
  };

  if (isLoading) return (
    <div className="container" style={{ padding: '40px 16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ height: 400, background: '#e5e7eb', borderRadius: 12 }} className="animate-pulse" />
        <div>
          {[200, 100, 60, 120, 80].map((w, i) => (
            <div key={i} style={{ height: 20, background: '#e5e7eb', borderRadius: 6, width: `${w}px`, marginBottom: 16 }} className="animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return <div style={{ textAlign: 'center', padding: 80 }}>Product not found</div>;

  return (
    <div className="container" style={{ padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#6b7280', marginBottom: 24, alignItems: 'center' }}>
        <Link to="/" style={{ color: '#16a34a' }}>Home</Link> /
        <Link to="/products" style={{ color: '#16a34a' }}>Products</Link> /
        <Link to={`/category/${product.category?._id}`} style={{ color: '#16a34a' }}>{product.category?.name}</Link> /
        <span>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 40 }}>
        {/* Images */}
        <div>
          <div style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: '#f9fafb', marginBottom: 12 }}>
            <img src={product.images[activeImg] || `https://via.placeholder.com/500?text=${product.name}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {product.images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? '#16a34a' : 'transparent'}` }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 13, color: '#16a34a', marginBottom: 8 }}>{product.category?.name}</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>{product.name}</h1>
          {product.namebn && <p style={{ color: '#6b7280', marginBottom: 12, fontFamily: 'Hind Siliguri' }}>{product.namebn}</p>}

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={16} fill={s <= Math.round(product.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />)}
            </div>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#1f2937' }}>৳{price}</span>
            {product.discountPrice > 0 && (
              <>
                <span style={{ fontSize: 18, color: '#9ca3af', textDecoration: 'line-through' }}>৳{product.price}</span>
                <span style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>-{product.discountPercent}%</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Per {product.unit} {product.weight > 0 && `(${product.weight}g)`}</div>

          {/* Stock */}
          <div style={{ marginBottom: 20 }}>
            {product.stock > 0 ? (
              <span style={{ color: '#16a34a', fontSize: 14, fontWeight: 500 }}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span style={{ color: '#ef4444', fontSize: 14, fontWeight: 500 }}>✗ Out of Stock</span>
            )}
          </div>

          {/* Qty + Cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '10px 16px', background: '#f9fafb', fontSize: 18 }}><FiMinus /></button>
              <span style={{ padding: '10px 20px', fontWeight: 700, fontSize: 18 }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '10px 16px', background: '#f9fafb', fontSize: 18 }}><FiPlus /></button>
            </div>
            <button disabled={product.stock === 0} onClick={() => addToCart(product, qty)} style={{ flex: 1, background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: product.stock === 0 ? 0.5 : 1 }}>
              <FiShoppingCart /> Add to Cart
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {product.tags.map(tag => (
                <span key={tag} style={{ background: '#f3f4f6', padding: '4px 10px', borderRadius: 20, fontSize: 12, color: '#6b7280' }}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Delivery info */}
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <FiTruck color="#16a34a" size={20} style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#16a34a' }}>Fast Delivery Available</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Free delivery on orders over ৳500. Same-day delivery in Dhaka.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Product Description</h2>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.8 }}>{product.description}</p>
        </div>
      )}

      {/* Reviews */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Customer Reviews ({product.numReviews})</h2>

        {/* Add review */}
        <div style={{ background: '#f9fafb', borderRadius: 10, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Write a Review</h3>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} size={24} onClick={() => setRating(s)} fill={s <= rating ? '#f59e0b' : 'none'} color="#f59e0b" style={{ cursor: 'pointer' }} />
            ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..." rows={3} style={{ width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, resize: 'vertical', fontSize: 14, marginBottom: 10, fontFamily: 'inherit' }} />
          <button onClick={submitReview} style={{ background: '#16a34a', color: 'white', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>Submit Review</button>
        </div>

        {/* Review list */}
        {product.reviews?.length > 0 ? product.reviews.map((r, i) => (
          <div key={i} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
              {[1,2,3,4,5].map(s => <FiStar key={s} size={14} fill={s <= r.rating ? '#f59e0b' : 'none'} color="#f59e0b" />)}
            </div>
            <p style={{ fontSize: 13, color: '#4b5563' }}>{r.comment}</p>
          </div>
        )) : (
          <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: 20 }}>No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
