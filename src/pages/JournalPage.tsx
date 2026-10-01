import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { BlogPost } from '../types';

interface JournalPageProps {
  blogPosts: BlogPost[];
  navigate: (route: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ blogPosts, navigate }) => {
  return (
    <div className="w-full bg-[#FAF7F2] py-12 sm:py-20 border-b border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
            Olfactory Essays & Chronicles
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#141312] mt-2">
            The Perfumer's Journal
          </h1>
          <p className="text-xs sm:text-sm text-[#7A756D] mt-3 leading-relaxed">
            Delve into rare harvest chronicles, master layering rituals, and the deep historical philosophy of haute parfumerie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => navigate(`/journal/${post.slug}`)}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D7] shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#FAF7F2]">
                <img
                  src={post.coverImage || '/images/hero_perfume.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-3 text-[11px] text-[#A09A90]">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-[#C5A059]" />
                      <span>{post.author}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#C5A059]" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-[#141312] group-hover:text-[#C5A059] transition-colors leading-tight">
                    {post.title}
                  </h2>

                  <p className="text-xs text-[#7A756D] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between text-xs font-semibold text-[#141312]">
                  <span>Read Full Essay</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
