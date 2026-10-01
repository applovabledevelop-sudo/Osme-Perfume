import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Award,
  Clock,
  Gift,
  Star,
  ChevronRight
} from 'lucide-react';
import { Product, CollectionItem, BlogPost } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useSettings } from '../context/SettingsContext';

interface HomePageProps {
  products: Product[];
  collections: CollectionItem[];
  blogPosts: BlogPost[];
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  collections,
  blogPosts,
  onSelectProduct,
  onQuickView,
  navigate,
}) => {
  const { settings } = useSettings();

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const featuredFragrances = products.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="w-full">
      {/* ===================================================
          SECTION 1 — HERO
          Matching prompt & reference image structure
      =================================================== */}
      <section className="relative overflow-hidden bg-[#FAF7F2] py-12 lg:py-20 border-b border-[#E8E2D7]">
        {/* Subtle decorative gold blur behind bottle */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8 z-10">
              {/* Small Tagline */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#F4EFE6] border border-[#E8E2D7] rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-semibold tracking-[0.25em] text-[#C5A059] uppercase">
                  {settings.heroSubtitle || 'SCENT YOUR STORY'}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#141312] font-normal leading-[1.08] tracking-tight">
                {settings.heroTitle ? (
                  settings.heroTitle.split('\n').map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="block">Elegance</span>
                    <span className="block italic text-[#C5A059]">in Every Note</span>
                  </>
                )}
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-[#7A756D] leading-relaxed max-w-xl">
                {settings.heroDescription ||
                  'Discover luxury fragrances crafted to inspire, captivate, and leave a lasting impression. Hand-blended using rare botanical absolutes and precious resins.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="px-8 py-3.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-[0.2em] font-semibold rounded transition-all duration-300 shadow-md flex items-center space-x-2"
                >
                  <span>{settings.heroButtonText || 'SHOP NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/collections')}
                  className="px-8 py-3.5 bg-transparent border border-[#141312] text-[#141312] hover:bg-[#141312] hover:text-[#FAF7F2] text-xs tracking-[0.2em] font-semibold rounded transition-all duration-300"
                >
                  EXPLORE COLLECTIONS
                </button>
              </div>

              {/* Three Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#E8E2D7]">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-white border border-[#E8E2D7] text-[#C5A059] shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider text-[#141312]">
                      {settings.feature1Title || 'PREMIUM QUALITY'}
                    </div>
                    <div className="text-[11px] text-[#7A756D] mt-0.5">
                      {settings.feature1Subtitle || 'Finest ingredients'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-white border border-[#E8E2D7] text-[#C5A059] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider text-[#141312]">
                      {settings.feature2Title || 'LONG LASTING'}
                    </div>
                    <div className="text-[11px] text-[#7A756D] mt-0.5">
                      {settings.feature2Subtitle || 'Fragrance that stays'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded bg-white border border-[#E8E2D7] text-[#C5A059] shrink-0">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-wider text-[#141312]">
                      {settings.feature3Title || 'BEAUTIFUL GIFTING'}
                    </div>
                    <div className="text-[11px] text-[#7A756D] mt-0.5">
                      {settings.feature3Subtitle || 'Perfect for every occasion'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Bottle Showcase */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src={settings.heroImage || '/images/hero_perfume.jpg'}
                  alt="Luxora Haute Parfumerie Hero Flacon"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Floating Luxury Badge */}
                <div className="absolute top-5 right-5 bg-[#141312]/90 backdrop-blur-md text-[#E2C98D] px-4 py-2.5 rounded-lg border border-[#C5A059]/40 shadow-xl text-center">
                  <span className="block text-[9px] tracking-[0.25em] font-bold uppercase text-[#C5A059]">
                    {settings.heroBadge || 'NEW ARRIVAL'}
                  </span>
                  <span className="block text-xs font-serif italic text-white mt-0.5">
                    Discover Now
                  </span>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 inset-x-5 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E8E2D7] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] tracking-wider text-[#C5A059] font-bold uppercase">
                      Signature Flacon
                    </span>
                    <h4 className="font-serif text-base font-semibold text-[#141312]">
                      Amber Imperial • Extrait
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="p-2 bg-[#141312] text-[#E2C98D] rounded-full hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 2 — BENEFITS BAR
          Matching prompt specifications
      =================================================== */}
      <section className="bg-white py-8 border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center space-x-3.5 p-3 rounded-lg hover:bg-[#FAF7F2] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center text-[#C5A059] shrink-0">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#141312]">FREE SHIPPING</h4>
                <p className="text-[11px] text-[#7A756D] mt-0.5">On orders over $75</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3 rounded-lg hover:bg-[#FAF7F2] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center text-[#C5A059] shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#141312]">EASY RETURNS</h4>
                <p className="text-[11px] text-[#7A756D] mt-0.5">30-day return policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3 rounded-lg hover:bg-[#FAF7F2] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center text-[#C5A059] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#141312]">SECURE PAYMENT</h4>
                <p className="text-[11px] text-[#7A756D] mt-0.5">100% safe & secure</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-3 rounded-lg hover:bg-[#FAF7F2] transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D7] flex items-center justify-center text-[#C5A059] shrink-0">
                <Headphones className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#141312]">DEDICATED SUPPORT</h4>
                <p className="text-[11px] text-[#7A756D] mt-0.5">We're here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 3 — SHOP BY SCENT
          Floral, Oud, Fresh, Oriental, Woody
      =================================================== */}
      <section className="py-16 lg:py-24 bg-[#FAF7F2] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
              Olfactory Families
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141312] mt-2">
              {settings.shopByScentTitle || 'Find Your Signature Scent'}
            </h2>
            <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.slice(0, 4).map((col) => (
              <div
                key={col.id}
                onClick={() => navigate(`/shop?collection=${col.slug}`)}
                className="group relative h-96 rounded-xl overflow-hidden cursor-pointer shadow-md border border-[#E8E2D7]"
              >
                <img
                  src={col.image || '/images/hero_perfume.jpg'}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-[#141312]/30 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
                  <span className="text-[10px] tracking-[0.25em] text-[#E2C98D] uppercase font-bold block">
                    Collection
                  </span>
                  <h3 className="font-serif text-2xl font-medium tracking-wide group-hover:text-[#E2C98D] transition-colors">
                    {col.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-[#D8CFBE] line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                  <div className="pt-3 flex items-center space-x-1.5 text-xs text-[#E2C98D] font-semibold">
                    <span>Explore Collection</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 4 — BEST SELLERS (DARK LUXURY SECTION)
          Matching prompt specification
      =================================================== */}
      <section className="py-20 lg:py-28 bg-[#141312] text-[#F4EFE6] border-b border-[#252320]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase block mb-1">
                Curated Excellence
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE6]">
                {settings.bestSellersTitle || 'Customer Favorites'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A09A90] mt-2 max-w-xl">
                {settings.bestSellersSubtitle || 'Loved by thousands around the world.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/shop?filter=best-sellers')}
              className="mt-6 md:mt-0 self-start md:self-auto px-6 py-2.5 border border-[#C5A059] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs tracking-widest font-semibold rounded transition-colors"
            >
              VIEW ALL FAVORITES
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 5 — THE OLFACTORY PYRAMID MASTERCLASS
          Editorial scent architecture demonstration
      =================================================== */}
      <section className="py-16 lg:py-24 bg-[#F4EFE6] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
                The Science of Sillage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141312]">
                The Architecture of a Bespoke Note
              </h2>
              <p className="text-xs sm:text-sm text-[#7A756D] leading-relaxed">
                Like musical chords, a masterpiece fragrance unfurls in three deliberate movements. Our master perfumers compose each movement with unhurried precision.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-white rounded-lg border-l-4 border-[#C5A059] shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-serif font-bold text-sm text-[#141312]">TOP NOTES • 0 – 30 MIN</h4>
                    <span className="text-[10px] uppercase font-bold text-[#C5A059]">The First Impression</span>
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    Volatile citrus, aromatic herbs, and effervescent spices that greet the senses the instant the atomiser is pressed.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border-l-4 border-[#A37F38] shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-serif font-bold text-sm text-[#141312]">HEART NOTES • 30 MIN – 4 HRS</h4>
                    <span className="text-[10px] uppercase font-bold text-[#A37F38]">The Soul</span>
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    Lush botanical absolutes of centifolia rose, jasmine grandiflorum, and velvet saffron that form the personality.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border-l-4 border-[#141312] shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-serif font-bold text-sm text-[#141312]">BASE NOTES • 4 – 16+ HRS</h4>
                    <span className="text-[10px] uppercase font-bold text-[#141312]">The Memory</span>
                  </div>
                  <p className="text-xs text-[#7A756D]">
                    Heavy resins, Cambodian agarwood, roasted Madagascar vanilla, and musks that cling to skin and garments for days.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                <img
                  src="/images/oriental_scent.jpg"
                  alt="Raw botanical absolutes and resins"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 6 — LATEST FROM THE JOURNAL
      =================================================== */}
      <section className="py-16 lg:py-24 bg-[#FAF7F2] border-b border-[#E8E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase block mb-1">
                Editorial
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#141312]">
                The Perfumer's Journal
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/journal')}
              className="mt-4 md:mt-0 text-xs tracking-widest font-semibold text-[#C5A059] hover:text-[#141312] transition-colors flex items-center space-x-1"
            >
              <span>EXPLORE ALL ESSAYS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.slice(0, 2).map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/journal/${post.slug}`)}
                className="bg-white rounded-xl overflow-hidden border border-[#E8E2D7] shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="aspect-[16/9] overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={post.coverImage || '/images/hero_perfume.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-2.5">
                  <div className="text-[10px] tracking-widest text-[#C5A059] uppercase font-bold">
                    {post.author}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#141312] group-hover:text-[#C5A059] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#7A756D] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="pt-2 text-xs font-semibold text-[#141312] flex items-center space-x-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
