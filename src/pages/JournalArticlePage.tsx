import React from 'react';
import { ArrowLeft, Calendar, User, Sparkles, Share2 } from 'lucide-react';
import { BlogPost, Product } from '../types';

interface JournalArticlePageProps {
  post: BlogPost;
  products: Product[];
  navigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const JournalArticlePage: React.FC<JournalArticlePageProps> = ({
  post,
  products,
  navigate,
  onSelectProduct,
}) => {
  const recommendedProduct = products[0];

  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button
          type="button"
          onClick={() => navigate('/journal')}
          className="text-xs font-semibold text-[#7A756D] hover:text-[#141312] flex items-center space-x-1 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Chronicles</span>
        </button>

        <article className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm p-6 sm:p-12 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs text-[#C5A059] uppercase tracking-wider font-semibold">
              <span>{post.tags?.join(' • ') || 'Haute Parfumerie'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#141312] leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-[#7A756D] pt-2 border-t border-[#E8E2D7]">
              <span className="flex items-center space-x-1.5 font-medium text-[#141312]">
                <User className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{post.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden aspect-[16/9] bg-[#FAF7F2]">
            <img
              src={post.coverImage || '/images/hero_perfume.jpg'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Formatted Content */}
          <div className="prose text-xs sm:text-sm text-[#252320] leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {post.content}
          </div>

          {/* Olfactory Recommendation */}
          {recommendedProduct && (
            <div className="mt-8 p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <img
                  src={recommendedProduct.images?.[0] || '/images/hero_perfume.jpg'}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg bg-white border border-[#E8E2D7]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] block">
                    Sensory Pairing Mentioned in Article
                  </span>
                  <h4 className="font-serif text-lg font-semibold text-[#141312]">
                    {recommendedProduct.name}
                  </h4>
                  <div className="text-xs font-semibold text-[#C5A059]">
                    ${recommendedProduct.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectProduct(recommendedProduct)}
                className="px-6 py-2.5 bg-[#141312] text-[#E2C98D] text-xs font-semibold rounded hover:bg-[#C5A059] hover:text-[#141312] transition-colors"
              >
                Inspect Flacon
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
