import React from 'react';
import { Star, Check, X, Trash2, ShieldCheck } from 'lucide-react';
import { Review } from '../../types';

interface AdminReviewsProps {
  reviews: Review[];
  onToggleApproval: (reviewId: string, approved: boolean) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({
  reviews,
  onToggleApproval,
  onDeleteReview,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
          Reputation & Sentiment
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
          Customer Fragrance Evaluations
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Title & Comment</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#7A756D]">
                    No reviews submitted yet.
                  </td>
                </tr>
              ) : (
                reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#141312]">{rev.userName}</div>
                      <div className="text-[10px] text-[#7A756D]">{rev.userEmail}</div>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-bold uppercase mt-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
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
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-serif font-bold text-sm text-[#141312]">{rev.title}</div>
                      <p className="text-xs text-[#7A756D] line-clamp-2 mt-0.5">{rev.comment}</p>
                    </td>

                    <td className="py-3 px-4 text-[#7A756D]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rev.approved ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {rev.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => onToggleApproval(rev.id, !rev.approved)}
                          className={`p-1.5 rounded transition-colors ${
                            rev.approved
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={rev.approved ? 'Hide Review' : 'Approve Review'}
                        >
                          {rev.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete review permanently?')) {
                              onDeleteReview(rev.id);
                            }
                          }}
                          className="p-1.5 text-[#7A756D] hover:text-red-600 rounded transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
