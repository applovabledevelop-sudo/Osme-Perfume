import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';

interface AdminBlogProps {
  blogPosts: BlogPost[];
  onSaveBlogPost: (post: BlogPost) => Promise<void>;
  onDeleteBlogPost: (postId: string) => Promise<void>;
}

export const AdminBlog: React.FC<AdminBlogProps> = ({
  blogPosts,
  onSaveBlogPost,
  onDeleteBlogPost,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Master Perfumer');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('/images/hero_perfume.jpg');
  const [published, setPublished] = useState(true);
  const [tags, setTags] = useState('Haute Parfumerie, Layering, Notes');
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setAuthor('Jean-Luc Moreau, Master Perfumer');
    setExcerpt('');
    setContent('');
    setCoverImage('/images/hero_perfume.jpg');
    setPublished(true);
    setTags('Haute Parfumerie, Rare Notes');
    setModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditingPost(p);
    setTitle(p.title);
    setSlug(p.slug);
    setAuthor(p.author);
    setExcerpt(p.excerpt);
    setContent(p.content);
    setCoverImage(p.coverImage);
    setPublished(p.published);
    setTags(p.tags ? p.tags.join(', ') : '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const postId = editingPost ? editingPost.id : generatedSlug;
      await onSaveBlogPost({
        id: postId,
        title: title.trim(),
        slug: generatedSlug,
        author: author.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim() || '/images/hero_perfume.jpg',
        published,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        createdAt: editingPost?.createdAt || new Date().toISOString(),
      });
      setModalOpen(false);
    } catch (e) {
      console.error('Error saving blog post:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Editorial Publications
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            The Perfumer's Journal Manager
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Compose New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D7] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative bg-[#FAF7F2]">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      post.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase">
                  {post.author}
                </span>
                <h3 className="font-serif text-xl font-semibold text-[#141312] line-clamp-1">
                  {post.title}
                </h3>
                <p className="text-xs text-[#7A756D] line-clamp-2 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#F4EFE6] flex items-center justify-between text-xs text-[#7A756D]">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="p-1.5 hover:text-[#C5A059]"
                  title="Edit Article"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete article "${post.title}"?`)) {
                      onDeleteBlogPost(post.id);
                    }
                  }}
                  className="p-1.5 hover:text-red-600"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-[#E8E2D7] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-xl font-bold text-[#141312]">
                {editingPost ? 'Edit Journal Article' : 'Compose New Article'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-xs text-[#7A756D] hover:text-[#141312] p-1 font-semibold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Article Content (Markdown/Text)</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Layering, Notes, Grasse"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Published & Visible on Journal</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#E8E2D7] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8E2D7] rounded-lg text-[#7A756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
