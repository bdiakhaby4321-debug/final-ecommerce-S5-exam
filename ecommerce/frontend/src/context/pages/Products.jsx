// src/pages/Products.jsx — Responsive

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../utils/api";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["", "Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Other"];
const SORTS = [
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const keyword  = searchParams.get("keyword")  || "";
  const category = searchParams.get("category") || "";
  const sort     = searchParams.get("sort")     || "-createdAt";
  const page     = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword)  params.set("keyword",  keyword);
      if (category) params.set("category", category);
      if (sort)     params.set("sort",     sort);
      if (page > 1) params.set("page",     page);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      const { data } = await API.get(`/products?${params}`);
      setProducts(data.data.products);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    setSearchParams(next);
    setFiltersOpen(false);
  };

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <input
          type="text"
          className="input"
          placeholder="Search products..."
          defaultValue={keyword}
          onKeyDown={(e) => { if (e.key === "Enter") setParam("keyword", e.target.value); }}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <select className="input" value={category} onChange={(e) => setParam("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
        <select className="input" value={sort} onChange={(e) => setParam("sort", e.target.value)}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (FCFA)</label>
        <div className="flex gap-2">
          <input type="number" className="input" placeholder="Min" defaultValue={minPrice}
            onBlur={(e) => setParam("minPrice", e.target.value)} />
          <input type="number" className="input" placeholder="Max" defaultValue={maxPrice}
            onBlur={(e) => setParam("maxPrice", e.target.value)} />
        </div>
      </div>
      <button onClick={() => { setSearchParams({}); setFiltersOpen(false); }} className="w-full btn-outline text-sm">
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800 mb-4 sm:mb-6">
        All Products
      </h1>

      {/* Mobile filter toggle button */}
      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="lg:hidden flex items-center gap-2 mb-4 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters & Search
        </span>
        <svg className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile filters panel */}
      {filtersOpen && (
        <div className="lg:hidden card p-4 mb-4">
          <FilterPanel />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-5">
            <FilterPanel />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-xl font-semibold text-gray-600">No products found</h2>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3 sm:mb-4">{pagination.total} products found</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center flex-wrap gap-2 mt-6 sm:mt-8">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setParam("page", i + 1)}
                      className={`w-9 h-9 rounded-lg font-medium text-sm transition ${
                        page === i + 1
                          ? "bg-brand-500 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
