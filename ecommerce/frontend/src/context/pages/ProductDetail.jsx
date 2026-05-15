// src/pages/ProductDetail.jsx — Responsive

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.data.product))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/products/${id}/reviews`, review);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.data.product);
      setReview({ rating: 5, comment: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20 px-4">
      <div className="text-5xl mb-4">😕</div>
      <p className="text-gray-500">Product not found.</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
        {/* Image */}
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
          {product.image?.url ? (
            <img src={product.image.url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl sm:text-8xl">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="badge bg-orange-100 text-orange-700 self-start">{product.category}</span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-2 leading-tight">
            {product.title}
          </h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mt-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.round(product.averageRating) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
          </div>

          <p className="text-2xl sm:text-3xl font-bold text-brand-600 mt-3 sm:mt-4">
            {product.price?.toLocaleString()} FCFA
          </p>

          <p className="text-gray-600 mt-3 sm:mt-4 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          <div className="mt-3">
            <span className={`badge ${product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5 sm:mt-6">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden self-start">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-gray-50 transition font-bold text-gray-700">−</button>
                <span className="px-4 py-2.5 border-x border-gray-200 font-medium min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2.5 hover:bg-gray-50 transition font-bold text-gray-700">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`btn-primary flex-1 py-2.5 ${added ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 sm:mt-14">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-800 mb-5 sm:mb-6">
          Customer Reviews ({product.numReviews})
        </h2>

        {/* Write review */}
        {user && user.role === "client" && (
          <div className="card p-5 sm:p-6 mb-5 sm:mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Rating</label>
                <select className="input mt-1" value={review.rating}
                  onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Comment</label>
                <textarea className="input mt-1 resize-none" rows={3} value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Review list */}
        <div className="space-y-3 sm:space-y-4">
          {product.reviews?.length === 0 ? (
            <p className="text-gray-400">No reviews yet. Be the first!</p>
          ) : (
            product.reviews?.map((r, i) => (
              <div key={i} className="card p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{r.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className={`w-3.5 h-3.5 ${j < r.rating ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-3 text-sm sm:text-base">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
