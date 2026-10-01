import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CollectionItem } from '../types';

interface CollectionsPageProps {
  collections: CollectionItem[];
  navigate: (route: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ collections, navigate }) => {
  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Olfactory Taxonomy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#141312] mt-2">
            The Scent Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#7A756D] mt-3 leading-relaxed">
            Every fragrance family represents an exploration of rare raw absolutes, from nocturnal agarwoods to sunlit blossoms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => navigate(`/shop?collection=${col.slug}`)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D7] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF7F2]">
                <img
                  src={col.image || '/images/hero_perfume.jpg'}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase text-[#141312]">
                    {col.name}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#141312] group-hover:text-[#C5A059] transition-colors">
                    The {col.name} Family
                  </h3>
                  <p className="text-xs text-[#7A756D] leading-relaxed mt-2">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between text-xs font-semibold text-[#C5A059]">
                  <span>Discover Flacons</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
