import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  Share2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Minus,
  Maximize2,
  X,
  MessageSquare
} from 'lucide-react';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { fetchReviews, submitReview } from '../services/db';

interface ProductDetailPageProps {
  product: Product;
  navigate: (route: string) => void;
  onOpenAuth: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  navigate,
  onOpenAuth,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.size || product.size || '50ml'
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0] || '/images/hero_perfume.jpg'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'notes' | 'ingredients' | 'shipping' | 'reviews'>('desc');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setSelectedSize(product.variants?.[0]?.size || product.size || '50ml');
    setSelectedImage(product.images?.[0] || '/images/hero_perfume.jpg');
    setQuantity(1);

    const loadReviews = async () => {
      try {
        const revs = await fetchReviews(product.id);
        setReviews(revs);
      } catch (e) {
        console.warn('Reviews load error:', e);
      }
    };
    loadReviews();
  }, [product]);

  const isLiked = isInWishlist(product.id);

  // Variant matching
  let activePrice = product.price;
  let activeStock = product.stock;
  let activeSku = product.sku;
  let activeCompareAt = product.compareAtPrice;

  if (product.variants && product.variants.length > 0) {
    const matched = product.variants.find((v) => v.size === selectedSize);
    if (matched) {
      activePrice = matched.price;
      activeStock = matched.stock;
      activeSku = matched.sku;
      if (matched.compareAtPrice) activeCompareAt = matched.compareAtPrice;
    }
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch {}
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!newTitle.trim() || !newComment.trim()) return;

    setReviewLoading(true);
    try {
      const revId = await submitReview({
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Fragrance Enthusiast',
        userEmail: user.email || '',
        rating: newRating,
        title: newTitle,
        comment: newComment,
        verifiedPurchase: true,
        approved: true,
      });

      const newRev: Review = {
        id: revId,
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || 'Fragrance Enthusiast',
        userEmail: user.email || '',
        rating: newRating,
        title: newTitle,
        comment: newComment,
        verifiedPurchase: true,
        approved: true,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => [newRev, ...prev]);
      setShowReviewForm(false);
      setReviewSuccess(true);
      setNewTitle('');
      setNewComment('');
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#7A756D] mb-6">
          <button type="button" onClick={() => navigate('/')} className="hover:text-[#141312]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => navigate('/shop')} className="hover:text-[#141312]">Shop</button>
          <span>/</span>
          <button type="button" onClick={() => navigate(`/shop?collection=${product.collectionId}`)} className="hover:text-[#141312]">{product.collection}</button>
          <span>/</span>
          <span className="text-[#141312] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-10 shadow-sm">
          {/* Left: Gallery & Hero Flacon */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D7] group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#141312] hover:bg-[#141312] hover:text-[#E2C98D] transition-colors shadow-sm"
                title="View Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.newArrival && (
                  <span className="bg-[#141312] text-[#E2C98D] text-[10px] tracking-[0.2em] font-bold px-2.5 py-1 rounded">
                    NEW ARRIVAL
                  </span>
                )}
                {product.bestSeller && (
                  <span className="bg-[#C5A059] text-[#141312] text-[10px] tracking-[0.2em] font-bold px-2.5 py-1 rounded">
                    BEST SELLER
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30'
                        : 'border-[#E8E2D7] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Buy Box & Accords */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[#C5A059] uppercase tracking-[0.25em] font-semibold">
                  <span>{product.collection} • {product.category}</span>
                  <span className="text-[#7A756D] tracking-normal capitalize">{product.gender}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#141312] mt-1">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-[#E8E2D7]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#7A756D] font-medium">
                    {product.rating?.toFixed(1) || '5.0'} ({reviews.length > 0 ? reviews.length : (product.reviewCount || 12)} verified reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-serif text-3xl font-bold text-[#141312]">
                  ${activePrice.toFixed(2)}
                </span>
                {activeCompareAt && activeCompareAt > activePrice && (
                  <span className="text-base text-[#A09A90] line-through">
                    ${activeCompareAt.toFixed(2)}
                  </span>
                )}
                {activeCompareAt && activeCompareAt > activePrice && (
                  <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">
                    Save ${(activeCompareAt - activePrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Scent Pyramid Capsule */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D7] space-y-2">
                <div className="text-[11px] font-bold tracking-wider text-[#C5A059] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Scent Pyramid</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-[#E8E2D7]">
                    <span className="font-semibold text-[#141312] block text-[10px] uppercase text-[#A09A90]">
                      Top Notes
                    </span>
                    <span className="text-[#252320] text-[11px]">{product.topNotes}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#E8E2D7]">
                    <span className="font-semibold text-[#141312] block text-[10px] uppercase text-[#A09A90]">
                      Heart Notes
                    </span>
                    <span className="text-[#252320] text-[11px]">{product.heartNotes}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-[#E8E2D7]">
                    <span className="font-semibold text-[#141312] block text-[10px] uppercase text-[#A09A90]">
                      Base Notes
                    </span>
                    <span className="text-[#252320] text-[11px]">{product.baseNotes}</span>
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#141312]">Select Flacon Size:</span>
                    <span className="text-[#7A756D]">SKU: {activeSku}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedSize(v.size)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedSize === v.size
                            ? 'border-[#141312] bg-[#FAF7F2] ring-1 ring-[#141312]'
                            : 'border-[#E8E2D7] bg-white hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#141312]">{v.size}</div>
                        <div className="text-xs text-[#C5A059] font-serif font-semibold mt-0.5">
                          ${v.price.toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Status */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#E8E2D7] rounded-lg bg-[#FAF7F2]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#7A756D] hover:text-[#141312]"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-[#141312]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                      disabled={quantity >= activeStock}
                      className="p-2 text-[#7A756D] hover:text-[#141312] disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Stock status indicator */}
                  <div className="text-xs">
                    {activeStock <= 0 ? (
                      <span className="text-rose-600 font-semibold">Temporarily Out of Stock</span>
                    ) : activeStock <= (product.lowStockThreshold || 10) ? (
                      <span className="text-amber-600 font-semibold">
                        Only {activeStock} flacons remaining in atelier
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready for Immediate Dispatch
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={activeStock <= 0}
                  className="flex-1 py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-md disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO SHOPPING BAG</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={activeStock <= 0}
                  className="flex-1 py-3.5 bg-[#C5A059] text-[#141312] hover:bg-[#D4AF37] text-xs tracking-widest font-bold rounded-lg transition-colors shadow-md disabled:opacity-50 text-center"
                >
                  BUY NOW
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded-lg border transition-colors flex items-center justify-center ${
                    isLiked
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-[#E8E2D7] bg-white text-[#141312] hover:border-[#C5A059]'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3.5 rounded-lg border border-[#E8E2D7] bg-white text-[#141312] hover:border-[#C5A059] transition-colors relative"
                  title="Share Fragrance"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedShare && (
                    <span className="absolute -top-8 right-0 bg-[#141312] text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Guarantees & Perks */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F4EFE6] text-xs text-[#7A756D]">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                  <span>Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-[#C5A059]" />
                  <span>Complimentary 2ml sample vial included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-10 shadow-sm">
          {/* Tab Headers */}
          <div className="flex border-b border-[#E8E2D7] overflow-x-auto space-x-8 text-xs font-semibold tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`pb-3 border-b-2 uppercase transition-colors whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'border-[#C5A059] text-[#141312]'
                  : 'border-transparent text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              Description & Inspiration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`pb-3 border-b-2 uppercase transition-colors whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'border-[#C5A059] text-[#141312]'
                  : 'border-transparent text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              Fragrance Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 border-b-2 uppercase transition-colors whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'border-[#C5A059] text-[#141312]'
                  : 'border-transparent text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              Ingredients & Formulations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 uppercase transition-colors whitespace-nowrap ${
                activeTab === 'shipping'
                  ? 'border-[#C5A059] text-[#141312]'
                  : 'border-transparent text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              Shipping & Returns
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 uppercase transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'reviews'
                  ? 'border-[#C5A059] text-[#141312]'
                  : 'border-transparent text-[#7A756D] hover:text-[#141312]'
              }`}
            >
              <span>Customer Reviews</span>
              <span className="text-[10px] bg-[#FAF7F2] px-1.5 py-0.5 rounded-full border border-[#E8E2D7]">
                {reviews.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="pt-6">
            {activeTab === 'desc' && (
              <div className="prose text-xs sm:text-sm text-[#7A756D] leading-relaxed max-w-3xl space-y-4">
                <p>{product.description}</p>
                <h4 className="font-serif text-lg font-semibold text-[#141312] pt-2">
                  Atelier Notes
                </h4>
                <p>
                  Hand-blended in small micro-batches of strictly 250 bottles. Each flacon is hand-polished and individually numbered by our master perfumer before departure from our New York atelier.
                </p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    Top Phase
                  </div>
                  <div className="font-serif text-base font-semibold text-[#141312]">
                    {product.topNotes}
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    The energetic opening accord that bursts forward upon skin contact.
                  </p>
                </div>

                <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#A37F38]">
                    Heart Phase
                  </div>
                  <div className="font-serif text-base font-semibold text-[#141312]">
                    {product.heartNotes}
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    The true aromatic core that radiates for hours as body temperature warms the oils.
                  </p>
                </div>

                <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#141312]">
                    Base Phase
                  </div>
                  <div className="font-serif text-base font-semibold text-[#141312]">
                    {product.baseNotes}
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    The deep foundation of resins and woods that leaves an unforgettable sillage.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="max-w-2xl space-y-4 text-xs text-[#7A756D] leading-relaxed">
                <p>
                  <strong>Formula Breakdown:</strong> {product.ingredients || 'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Citronellol.'}
                </p>
                <p>
                  100% vegan, cruelty-free, and formulated without phthalates, synthetic dyes, or sulfates. We adhere to the highest international standards of IFRA (International Fragrance Association).
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-4 text-xs text-[#7A756D] leading-relaxed">
                <h4 className="font-serif text-base font-semibold text-[#141312]">
                  White-Glove Delivery
                </h4>
                <p>
                  All orders above $75 receive complimentary insured courier delivery. Orders placed before 2:00 PM EST ship same business day.
                </p>
                <h4 className="font-serif text-base font-semibold text-[#141312]">
                  The 30-Day Risk-Free Flacon Guarantee
                </h4>
                <p>
                  Every Luxora full-size flacon arrives accompanied by an identical complimentary 2ml sample vial. Test the fragrance on skin first; should it not harmonize with your natural chemistry, return the unopened full-size flacon for an immediate 100% refund.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D7]">
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#141312]">
                      Client Evaluations
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex text-[#C5A059]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-[#7A756D]">
                        Based on {reviews.length} authentic connoisseur evaluations
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        onOpenAuth();
                      } else {
                        setShowReviewForm(!showReviewForm);
                      }
                    }}
                    className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold tracking-wider rounded transition-colors self-start"
                  >
                    {showReviewForm ? 'CANCEL REVIEW' : 'WRITE A REVIEW'}
                  </button>
                </div>

                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded">
                    Thank you! Your fragrance evaluation has been recorded.
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8E2D7] space-y-4 max-w-xl">
                    <h4 className="font-serif text-base font-semibold text-[#141312]">
                      Share Your Olfactory Impression
                    </h4>

                    {/* Rating selector */}
                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">Rating</label>
                      <div className="flex space-x-1 text-[#C5A059]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= newRating ? 'fill-current text-[#C5A059]' : 'text-[#D8CFBE]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">
                        Evaluation Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Sillage was magnificent throughout evening"
                        className="w-full text-xs p-2.5 bg-white border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#141312] mb-1">
                        Detailed Review
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Describe how the notes developed on your skin..."
                        className="w-full text-xs p-2.5 bg-white border border-[#E8E2D7] rounded focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors disabled:opacity-50"
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Evaluation'}
                    </button>
                  </form>
                )}

                {/* Review List */}
                <div className="space-y-4 divide-y divide-[#E8E2D7]">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-[#7A756D] py-4">
                      Be the first to review {product.name}.
                    </p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="pt-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-[#141312]">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#A09A90]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex text-[#C5A059]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current text-[#C5A059]' : 'text-[#E8E2D7]'
                              }`}
                            />
                          ))}
                        </div>

                        <h5 className="font-serif font-semibold text-sm text-[#141312]">{rev.title}</h5>
                        <p className="text-xs text-[#7A756D] leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-[#141312]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#C5A059] p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
