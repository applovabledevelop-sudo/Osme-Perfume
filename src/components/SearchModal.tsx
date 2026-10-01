import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularSearches = ['Noir Intense', 'Royal Oud', 'Bloom Essence', 'Saffron', 'Cedarwood', 'Vanilla'];

  const filtered = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.fragranceFamily.toLowerCase().includes(q) ||
          p.topNotes.toLowerCase().includes(q) ||
          p.heartNotes.toLowerCase().includes(q) ||
          p.baseNotes.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-[#141312]/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl bg-[#FAF7F2] rounded-xl shadow-2xl border border-[#E8E2D7] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D7] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#C5A059] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fragrances, olfactory notes, collections..."
            className="w-full text-sm sm:text-base text-[#141312] bg-transparent focus:outline-none placeholder:text-[#A09A90]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#A09A90] hover:text-[#141312] text-xs p-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7A756D] hover:text-[#141312] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-1.5 text-xs text-[#7A756D] font-medium uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Popular Fragrance Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-white border border-[#E8E2D7] text-xs text-[#252320] rounded-full hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="font-serif text-lg text-[#141312]">No fragrances found</p>
              <p className="text-xs text-[#7A756D]">
                Try searching for notes like "Amber", "Rose", "Oud" or "Fresh".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-[#7A756D] uppercase tracking-wider">
                Found {filtered.length} fragrance{filtered.length > 1 ? 's' : ''}
              </div>
              <div className="divide-y divide-[#E8E2D7]">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="py-3 flex items-center justify-between hover:bg-white px-2 rounded cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images?.[0] || '/images/hero_perfume.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded bg-[#FAF7F2]"
                      />
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#141312] group-hover:text-[#C5A059] transition-colors">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-[#7A756D]">
                          {product.collection} • {product.fragranceFamily} • ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A09A90] group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
