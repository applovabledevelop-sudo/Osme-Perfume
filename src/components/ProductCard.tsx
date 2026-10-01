import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || '/images/hero_perfume.jpg';
  const secondaryImage = product.images?.[1] || primaryImage;

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-[#E8E2D7] hover:border-[#C5A059]/60 transition-all duration-300 hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#FAF7F2] cursor-pointer" onClick={() => onSelectProduct?.(product)}>
        <img
          src={primaryImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            secondaryImage !== primaryImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {secondaryImage !== primaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.newArrival && (
            <span className="bg-[#141312] text-[#E2C98D] text-[9px] tracking-[0.2em] font-bold px-2 py-0.5 rounded uppercase">
              NEW
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-[#C5A059] text-[#141312] text-[9px] tracking-[0.2em] font-bold px-2 py-0.5 rounded uppercase">
              BEST SELLER
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-700 text-white text-[9px] tracking-wider font-bold px-2 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
              isLiked
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/80 text-[#141312] hover:bg-[#141312] hover:text-[#E2C98D]'
            }`}
            title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2 rounded-full bg-white/80 backdrop-blur-md text-[#141312] hover:bg-[#141312] hover:text-[#E2C98D] transition-colors shadow-sm opacity-0 group-hover:opacity-100"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hover Add to Bag Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-2 bg-[#FAF7F2] text-[#141312] hover:bg-[#C5A059] hover:text-white text-xs tracking-wider font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Collection */}
          <div className="flex items-center justify-between text-[11px] text-[#A09A90] uppercase tracking-wider mb-1">
            <span>{product.collection || product.fragranceFamily}</span>
            <span>{product.size || '50ml'}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct?.(product)}
            className="font-serif text-base font-semibold text-[#141312] hover:text-[#C5A059] transition-colors cursor-pointer truncate"
          >
            {product.name}
          </h3>

          {/* Fragrance Short Notes */}
          <p className="text-[11px] text-[#7A756D] line-clamp-1 mt-0.5">
            {product.shortDescription || product.topNotes}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-2">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-current text-[#C5A059]'
                      : 'text-[#E8E2D7]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#7A756D] font-medium">
              ({product.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="mt-3 pt-2.5 border-t border-[#F4EFE6] flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-lg font-semibold text-[#141312]">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-[#A09A90] line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <span className="text-[10px] tracking-wider text-[#C5A059] font-medium uppercase">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};
