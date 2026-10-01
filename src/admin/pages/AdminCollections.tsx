import React, { useState } from 'react';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import { CollectionItem } from '../../types';

interface AdminCollectionsProps {
  collections: CollectionItem[];
  onSaveCollection: (col: CollectionItem) => Promise<void>;
  onDeleteCollection: (colId: string) => Promise<void>;
}

export const AdminCollections: React.FC<AdminCollectionsProps> = ({
  collections,
  onSaveCollection,
  onDeleteCollection,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionItem | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/hero_perfume.jpg');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingCol(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('/images/hero_perfume.jpg');
    setActive(true);
    setModalOpen(true);
  };

  const openEdit = (c: CollectionItem) => {
    setEditingCol(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description);
    setImage(c.image);
    setActive(c.active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const colId = editingCol ? editingCol.id : generatedSlug;
      await onSaveCollection({
        id: colId,
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim() || '/images/hero_perfume.jpg',
        active,
        createdAt: editingCol?.createdAt || new Date().toISOString(),
      });
      setModalOpen(false);
    } catch (e) {
      console.error('Error saving collection:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Olfactory Families
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Collections Management
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="px-5 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D7] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative bg-[#FAF7F2]">
                <img src={col.image} alt={col.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      col.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {col.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-xl font-semibold text-[#141312]">{col.name}</h3>
                <div className="text-[11px] font-mono text-[#7A756D]">Slug: {col.slug}</div>
                <p className="text-xs text-[#7A756D] leading-relaxed">{col.description}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#F4EFE6] flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => openEdit(col)}
                className="p-1.5 text-[#7A756D] hover:text-[#C5A059] rounded"
                title="Edit Collection"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete collection "${col.name}"?`)) {
                    onDeleteCollection(col.id);
                  }
                }}
                className="p-1.5 text-[#7A756D] hover:text-red-600 rounded"
                title="Delete Collection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E8E2D7] shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E2D7]">
              <h3 className="font-serif text-xl font-bold text-[#141312]">
                {editingCol ? 'Edit Collection' : 'Create Fragrance Collection'}
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
                <label className="block font-semibold mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amber & Spices"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="amber-spices"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sensory Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the aromatic mood of this family..."
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Active & Displayed on Storefront</span>
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
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
