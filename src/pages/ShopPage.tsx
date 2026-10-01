import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search, ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { Product, CollectionItem } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  collections: CollectionItem[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  initialFilter?: string | null;
  initialCollection?: string | null;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  collections,
  onSelectProduct,
  onQuickView,
  initialFilter,
  initialCollection,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number>(200);
  const [sortBy, setSortBy] = useState<string>(
    initialFilter === 'best-sellers'
      ? 'best-selling'
      : initialFilter === 'new-arrivals'
      ? 'newest'
      : 'featured'
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique families and categories
  const fragranceFamilies = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.fragranceFamily) set.add(p.fragranceFamily);
    });
    return Array.from(set);
  }, [products]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.fragranceFamily.toLowerCase().includes(q) ||
            p.topNotes.toLowerCase().includes(q) ||
            p.baseNotes.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Collection
        if (selectedCollection !== 'all' && p.collectionId !== selectedCollection && p.collection.toLowerCase() !== selectedCollection.toLowerCase()) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Gender
        if (selectedGender !== 'all' && p.gender !== selectedGender) {
          return false;
        }

        // Fragrance family
        if (selectedFamily !== 'all' && p.fragranceFamily !== selectedFamily) {
          return false;
        }

        // In Stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Rating
        if (minRating > 0 && (p.rating || 0) < minRating) {
          return false;
        }

        // Price
        if (p.price > priceRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
        if (sortBy === 'best-selling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        if (sortBy === 'highest-rated') return (b.rating || 0) - (a.rating || 0);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    searchTerm,
    selectedCollection,
    selectedCategory,
    selectedGender,
    selectedFamily,
    inStockOnly,
    minRating,
    priceRange,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCollection('all');
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedFamily('all');
    setInStockOnly(false);
    setMinRating(0);
    setPriceRange(200);
    setSearchTerm('');
  };

  const activeFilterCount =
    (selectedCollection !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (selectedFamily !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange < 200 ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Haute Parfumerie
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141312] mt-1.5">
            The Fragrance Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#7A756D] mt-2 leading-relaxed">
            Macerated to perfection, hand-poured into crystal flacons, and formulated with uncompromised botanicals.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#E8E2D7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search bar inside boutique */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by note, name, or accord..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-[#A09A90] hover:text-[#141312] text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg text-xs font-semibold text-[#141312] flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#7A756D] hidden sm:inline">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FAF7F2] border border-[#E8E2D7] text-xs text-[#141312] font-semibold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#C5A059] cursor-pointer"
                >
                  <option value="featured">Featured Fragrances</option>
                  <option value="best-selling">Best Sellers</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="highest-rated">Highest Customer Rating</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#7A756D] absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-[#7A756D]">Active Filters:</span>
            {selectedCollection !== 'all' && (
              <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] text-xs rounded-full flex items-center gap-1.5 text-[#141312]">
                Collection: {selectedCollection}
                <X className="w-3 h-3 cursor-pointer text-[#A09A90] hover:text-black" onClick={() => setSelectedCollection('all')} />
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] text-xs rounded-full flex items-center gap-1.5 text-[#141312]">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer text-[#A09A90] hover:text-black" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {selectedGender !== 'all' && (
              <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] text-xs rounded-full flex items-center gap-1.5 text-[#141312]">
                Gender: {selectedGender}
                <X className="w-3 h-3 cursor-pointer text-[#A09A90] hover:text-black" onClick={() => setSelectedGender('all')} />
              </span>
            )}
            {selectedFamily !== 'all' && (
              <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] text-xs rounded-full flex items-center gap-1.5 text-[#141312]">
                Accord: {selectedFamily}
                <X className="w-3 h-3 cursor-pointer text-[#A09A90] hover:text-black" onClick={() => setSelectedFamily('all')} />
              </span>
            )}
            {priceRange < 200 && (
              <span className="px-2.5 py-1 bg-white border border-[#E8E2D7] text-xs rounded-full flex items-center gap-1.5 text-[#141312]">
                Under ${priceRange}
                <X className="w-3 h-3 cursor-pointer text-[#A09A90] hover:text-black" onClick={() => setPriceRange(200)} />
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#C5A059] font-semibold hover:underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#E8E2D7] shadow-sm space-y-6">
              {/* Collection Filter */}
              <div>
                <h3 className="text-xs font-bold tracking-wider text-[#141312] uppercase mb-3">
                  Olfactory Collection
                </h3>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCollection('all')}
                    className={`w-full text-left py-1 px-2 rounded transition-colors ${
                      selectedCollection === 'all'
                        ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                        : 'text-[#7A756D] hover:text-[#141312]'
                    }`}
                  >
                    All Collections
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedCollection(col.slug)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors ${
                        selectedCollection === col.slug
                          ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                          : 'text-[#7A756D] hover:text-[#141312]'
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Concentration / Category */}
              <div className="pt-4 border-t border-[#F4EFE6]">
                <h3 className="text-xs font-bold tracking-wider text-[#141312] uppercase mb-3">
                  Concentration
                </h3>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left py-1 px-2 rounded transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                        : 'text-[#7A756D] hover:text-[#141312]'
                    }`}
                  >
                    All Concentrations
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                          : 'text-[#7A756D] hover:text-[#141312]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Accord */}
              <div className="pt-4 border-t border-[#F4EFE6]">
                <h3 className="text-xs font-bold tracking-wider text-[#141312] uppercase mb-3">
                  Aromatic Accord
                </h3>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedFamily('all')}
                    className={`w-full text-left py-1 px-2 rounded transition-colors ${
                      selectedFamily === 'all'
                        ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                        : 'text-[#7A756D] hover:text-[#141312]'
                    }`}
                  >
                    All Accords
                  </button>
                  {fragranceFamilies.map((fam) => (
                    <button
                      key={fam}
                      type="button"
                      onClick={() => setSelectedFamily(fam)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors ${
                        selectedFamily === fam
                          ? 'bg-[#FAF7F2] font-semibold text-[#C5A059]'
                          : 'text-[#7A756D] hover:text-[#141312]'
                      }`}
                    >
                      {fam}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Preference */}
              <div className="pt-4 border-t border-[#F4EFE6]">
                <h3 className="text-xs font-bold tracking-wider text-[#141312] uppercase mb-2">
                  Gender
                </h3>
                <div className="flex gap-2">
                  {['all', 'unisex', 'women', 'men'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGender(g)}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded border transition-all ${
                        selectedGender === g
                          ? 'bg-[#141312] text-[#E2C98D] border-[#141312]'
                          : 'bg-white text-[#7A756D] border-[#E8E2D7] hover:border-[#C5A059]'
                      }`}
                    >
                      {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-4 border-t border-[#F4EFE6]">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold tracking-wider text-[#141312] uppercase">
                    Max Price
                  </span>
                  <span className="font-semibold text-[#C5A059]">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#A09A90] mt-1">
                  <span>$50</span>
                  <span>$200</span>
                </div>
              </div>

              {/* Stock filter toggle */}
              <div className="pt-4 border-t border-[#F4EFE6]">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#141312]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#C5A059] rounded"
                  />
                  <span>Show only in-stock flacons</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            <div className="flex justify-between items-center text-xs text-[#7A756D] mb-4">
              <span>
                Showing <strong className="text-[#141312]">{filteredProducts.length}</strong> fragrances
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E8E2D7] p-12 text-center space-y-4">
                <p className="font-serif text-2xl text-[#141312]">No fragrances match your filters</p>
                <p className="text-xs text-[#7A756D] max-w-sm mx-auto">
                  Try adjusting your price range, clearing selected accords, or removing the search keyword.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in">
          <div
            className="absolute inset-0 bg-[#141312]/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D7]">
                <h3 className="font-serif text-lg font-semibold text-[#141312]">Filter Fragrances</h3>
                <button type="button" onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#7A756D]" />
                </button>
              </div>

              {/* Mobile Filter Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase text-[11px] mb-2">Collection</label>
                  <select
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded"
                  >
                    <option value="all">All Collections</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-[11px] mb-2">Gender</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded"
                  >
                    <option value="all">All</option>
                    <option value="unisex">Unisex</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[11px] uppercase mb-1">
                    <span>Max Price</span>
                    <span>${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#C5A059]"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-[#C5A059]"
                    />
                    <span>In-Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E2D7] flex gap-2">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 border border-[#141312] text-xs font-semibold rounded text-center"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded text-center"
                >
                  Apply ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
