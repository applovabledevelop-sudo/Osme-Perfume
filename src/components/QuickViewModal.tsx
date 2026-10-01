import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewProductDetail: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewProductDetail,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.size || product.size || '50ml'
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0] || '/images/hero_perfume.jpg'
  );
  const [quantity, setQuantity] = useState(1);

  const isLiked = isInWishlist(product.id);

  // Variant matching
  let activePrice = product.price;
  let activeStock = product.stock;
  if (product.variants && product.variants.length > 0) {
    const matched = product.variants.find((v) => v.size === selectedSize);
    if (matched) {
      activePrice = matched.price;
      activeStock = matched.stock;
    }
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-[#141312]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-xl shadow-2xl border border-[#E8E2D7] overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A756D] hover:text-[#141312] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-white border border-[#E8E2D7] shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#C5A059]' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] text-[#C5A059] uppercase tracking-[0.2em] font-semibold">
                {product.collection} • {product.fragranceFamily}
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[#141312] mt-1">
                {product.name}
              </h2>
              <div className="flex items-center space-x-2 mt-1.5">
                <div className="flex text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-[#E8E2D7]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#7A756D]">({product.reviewCount || 12} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-2xl font-bold text-[#141312]">
                ${activePrice.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > activePrice && (
                <span className="text-sm text-[#A09A90] line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#7A756D] leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Fragrance Notes Pills */}
            <div className="bg-white p-3 rounded-lg border border-[#E8E2D7] text-xs space-y-1.5">
              <div className="font-semibold text-[#141312] text-[11px] uppercase tracking-wider">
                Olfactory Notes:
              </div>
              <div className="text-[11px] text-[#7A756D]">
                <strong className="text-[#141312]">Top:</strong> {product.topNotes}
              </div>
              <div className="text-[11px] text-[#7A756D]">
                <strong className="text-[#141312]">Heart:</strong> {product.heartNotes}
              </div>
              <div className="text-[11px] text-[#7A756D]">
                <strong className="text-[#141312]">Base:</strong> {product.baseNotes}
              </div>
            </div>

            {/* Size Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#141312] mb-1.5">
                  Flacon Volume:
                </label>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedSize(v.size)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                        selectedSize === v.size
                          ? 'bg-[#141312] text-[#E2C98D] border-[#141312]'
                          : 'bg-white text-[#141312] border-[#D8CFBE] hover:border-[#C5A059]'
                      }`}
                    >
                      {v.size} — ${v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-wider font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  isLiked
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-[#D8CFBE] bg-white text-[#141312] hover:border-[#C5A059]'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewProductDetail(product);
              }}
              className="w-full text-center text-xs text-[#C5A059] font-medium hover:underline flex items-center justify-center space-x-1 pt-1"
            >
              <span>View full sensory details & ingredients</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
