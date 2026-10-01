import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Check,
  X,
  AlertTriangle,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Product, CollectionItem, ProductVariant } from '../../types';

interface AdminProductsProps {
  products: Product[];
  collections: CollectionItem[];
  onSaveProduct: (product: Partial<Product> & { id: string }) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  collections,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(89);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(110);
  const [costPrice, setCostPrice] = useState<number | undefined>(25);
  const [category, setCategory] = useState('Extrait de Parfum');
  const [collectionId, setCollectionId] = useState('floral');
  const [gender, setGender] = useState<'unisex' | 'women' | 'men'>('unisex');
  const [fragranceFamily, setFragranceFamily] = useState('Floral');
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [stock, setStock] = useState(50);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(true);
  const [images, setImages] = useState<string[]>(['/images/hero_perfume.jpg']);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSku(`LUX-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice(89);
    setCompareAtPrice(110);
    setCostPrice(25);
    setCategory('Extrait de Parfum');
    setCollectionId(collections[0]?.id || 'floral');
    setGender('unisex');
    setFragranceFamily('Floral');
    setTopNotes('Mandarin, Neroli, Cardamom');
    setHeartNotes('Grasse Rose, Jasmine, Saffron');
    setBaseNotes('Bourbon Vanilla, Amber, Cedarwood');
    setStock(50);
    setLowStockThreshold(10);
    setShortDescription('An artisanal fragrance formulated with rare raw absolutes.');
    setDescription('A deeply refined olfactory composition designed for discerning patrons.');
    setIngredients('Alcohol Denat., Parfum (Fragrance), Aqua (Water).');
    setActive(true);
    setFeatured(false);
    setBestSeller(false);
    setNewArrival(true);
    setImages(['/images/hero_perfume.jpg']);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setSku(p.sku);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice);
    setCostPrice(p.costPrice);
    setCategory(p.category);
    setCollectionId(p.collectionId);
    setGender(p.gender);
    setFragranceFamily(p.fragranceFamily);
    setTopNotes(p.topNotes);
    setHeartNotes(p.heartNotes);
    setBaseNotes(p.baseNotes);
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold || 10);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description);
    setIngredients(p.ingredients || '');
    setActive(p.active);
    setFeatured(p.featured);
    setBestSeller(p.bestSeller);
    setNewArrival(p.newArrival);
    setImages(p.images && p.images.length > 0 ? p.images : ['/images/hero_perfume.jpg']);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p: Product) => {
    const newId = `${p.id}-copy-${Date.now().toString(36).substring(4)}`;
    const duplicateProduct: Partial<Product> & { id: string } = {
      ...p,
      id: newId,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy`,
      sku: `${p.sku}-CP`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onSaveProduct(duplicateProduct);
  };

  const handleToggleActive = async (p: Product) => {
    await onSaveProduct({
      id: p.id,
      active: !p.active,
    });
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const prodId = editingProduct ? editingProduct.id : generatedSlug;
      const matchedCollection = collections.find((c) => c.id === collectionId);

      const variants: ProductVariant[] = [
        { id: `v-${prodId}-30`, size: '30ml', sku: `${sku}-30`, price: Math.round(price * 0.75), stock: Math.round(stock * 0.4) },
        { id: `v-${prodId}-50`, size: '50ml', sku: `${sku}-50`, price, stock, compareAtPrice },
        { id: `v-${prodId}-100`, size: '100ml', sku: `${sku}-100`, price: Math.round(price * 1.6), stock: Math.round(stock * 0.3) },
      ];

      const productPayload: Partial<Product> & { id: string } = {
        id: prodId,
        name: name.trim(),
        slug: generatedSlug,
        sku: sku.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        category,
        collectionId,
        collection: matchedCollection ? matchedCollection.name : 'Haute Parfumerie',
        gender,
        fragranceFamily,
        topNotes,
        heartNotes,
        baseNotes,
        size: '50ml',
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        rating: editingProduct?.rating || 5.0,
        reviewCount: editingProduct?.reviewCount || 0,
        featured,
        bestSeller,
        newArrival,
        active,
        images: images.length > 0 ? images : ['/images/hero_perfume.jpg'],
        variants,
        shortDescription,
        description,
        ingredients,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSaveProduct(productPayload);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) => {
    if (selectedCollection !== 'all' && p.collectionId !== selectedCollection) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C5A059] uppercase font-bold">
            Catalog Management
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141312]">
            Fragrance Formulations
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] text-xs font-semibold rounded-lg flex items-center space-x-2 transition-colors shadow self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Flacon</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2D7] shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A09A90] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search flacon by name or SKU..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg focus:outline-none focus:border-[#C5A059]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-[#7A756D]">Collection:</span>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="text-xs bg-[#FAF7F2] border border-[#E8E2D7] p-2 rounded-lg"
          >
            <option value="all">All Collections</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E8E2D7] text-[#7A756D] uppercase text-[10px]">
                <th className="py-3 px-4">Flacon</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D7]">
              {filtered.map((p) => {
                const isLow = p.stock <= (p.lowStockThreshold || 10);
                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.images?.[0] || '/images/hero_perfume.jpg'}
                          alt=""
                          className="w-12 h-12 object-cover rounded-lg bg-white border border-[#E8E2D7]"
                        />
                        <div>
                          <div className="font-serif font-bold text-sm text-[#141312]">{p.name}</div>
                          <div className="text-[10px] text-[#C5A059] uppercase font-semibold">
                            {p.collection} • {p.fragranceFamily}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#7A756D]">{p.sku}</td>
                    <td className="py-3 px-4">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-[#141312]">${p.price.toFixed(2)}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className={`font-semibold ${isLow ? 'text-rose-600' : 'text-[#141312]'}`}>
                          {p.stock}
                        </span>
                        {isLow && (
                          <span title="Low Stock Threshold Reached">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          p.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {p.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-[#7A756D] hover:text-[#C5A059] rounded hover:bg-white"
                          title="Edit Flacon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-[#7A756D] hover:text-[#141312] rounded hover:bg-white"
                          title="Duplicate Formulation"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete flacon "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-[#7A756D] hover:text-red-600 rounded hover:bg-white"
                          title="Delete Flacon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#141312]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-[#E8E2D7] shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D7]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059]">
                  {editingProduct ? 'Update Formulation' : 'New Creation'}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#141312]">
                  {editingProduct ? editingProduct.name : 'Add New Fragrance Flacon'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[#7A756D] hover:text-[#141312] p-1 font-semibold"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Fragrance Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Compare-at Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Collection</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  >
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Concentration</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Extrait de Parfum"
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                </div>
              </div>

              {/* Scent Notes */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8E2D7] space-y-3">
                <span className="font-bold uppercase text-[10px] text-[#C5A059] block">
                  Olfactory Pyramid Notes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[11px]">Top Notes</label>
                    <input
                      type="text"
                      value={topNotes}
                      onChange={(e) => setTopNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E8E2D7] rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[11px]">Heart Notes</label>
                    <input
                      type="text"
                      value={heartNotes}
                      onChange={(e) => setHeartNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E8E2D7] rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[11px]">Base Notes</label>
                    <input
                      type="text"
                      value={baseNotes}
                      onChange={(e) => setBaseNotes(e.target.value)}
                      className="w-full p-2 bg-white border border-[#E8E2D7] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Image Manager */}
              <div className="space-y-2">
                <label className="block font-semibold">Image URLs</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Enter image URL (/images/hero_perfume.jpg or web url)"
                    className="flex-1 p-2 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#141312] text-[#E2C98D] rounded-lg font-semibold"
                  >
                    Add Image
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E8E2D7] group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Narrative Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D7] rounded-lg"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestSeller}
                    onChange={(e) => setBestSeller(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newArrival}
                    onChange={(e) => setNewArrival(e.target.checked)}
                    className="accent-[#C5A059]"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E8E2D7] rounded-lg text-[#7A756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 bg-[#141312] text-[#E2C98D] hover:bg-[#C5A059] hover:text-[#141312] font-semibold rounded-lg disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
