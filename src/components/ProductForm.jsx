import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, ArrowLeft, ArrowRight, Loader2, Star } from 'lucide-react';

const CATEGORIES = ['Bracelets', 'Rings', 'Necklaces', 'Jewellery Sets', 'Earrings'];
const OCCASIONS = ['Daily Wear', 'Party', 'College', 'Gifting', 'Date Night', 'Festive'];
const BADGES = ['', 'New Drop', 'Bestseller', 'Trending', 'Limited Edition'];

const DEFAULT_CARE_INSTRUCTIONS = "Keep away from water, perfume, and sweat. Wipe with a soft dry cloth after use. Store in the pouch provided.";

export default function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bracelets',
    material: '',
    occasion: 'Daily Wear',
    price: '',
    mrp: '',
    badge: '',
    description: '',
    careInstructions: DEFAULT_CARE_INSTRUCTIONS,
    sizes: '',
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // If editing, populate the fields
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        category: product.category || 'Bracelets',
        material: product.material || '',
        occasion: product.occasion || 'Daily Wear',
        price: product.price || '',
        mrp: product.mrp || '',
        badge: product.badge || '',
        description: product.description || '',
        careInstructions: product.careInstructions || DEFAULT_CARE_INSTRUCTIONS,
        sizes: product.sizes ? product.sizes.join(', ') : '',
        images: product.images || []
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    const token = localStorage.getItem('hrdya_admin_token');

    for (const file of files) {
      try {
        const base64 = await convertToBase64(file);
        const response = await fetch('/api/admin-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            filename: file.name,
            content: base64
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, data.url]
          }));
        } else {
          setError(data.error || `Failed to upload image "${file.name}"`);
        }
      } catch (err) {
        setError(`Connection error while uploading "${file.name}"`);
      }
    }

    setUploading(false);
    // Reset file input value
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Image actions
  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const moveImage = (index, direction) => {
    const newImages = [...formData.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;

    // Swap
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const setPrimaryImage = (index) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const primary = newImages.splice(index, 1)[0];
    newImages.unshift(primary);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) return setError('Product Name is required');
    if (!formData.price || parseFloat(formData.price) <= 0) return setError('Selling Price must be a positive number');
    if (formData.mrp && parseFloat(formData.mrp) < parseFloat(formData.price)) {
      return setError('MRP (Original Price) must be greater than or equal to the Selling Price');
    }
    if (!formData.description.trim()) return setError('Product Description is required');
    if (formData.images.length === 0) return setError('At least one product image is required');

    setSubmitting(true);

    const processedData = {
      ...formData,
      price: parseFloat(formData.price),
      mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.price),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : null,
      rating: product ? product.rating : 4.8, // keep or set default mock rating
      reviewCount: product ? product.reviewCount : Math.floor(Math.random() * 30) + 5 // keep or generate reviews
    };

    // Clean up empty fields
    if (!processedData.badge) delete processedData.badge;
    if (!processedData.sizes) delete processedData.sizes;

    const token = localStorage.getItem('hrdya_admin_token');
    const method = product ? 'PUT' : 'POST';

    try {
      const response = await fetch('/api/admin-products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onSave(data.product);
      } else {
        setError(data.error || 'Failed to save product details.');
      }
    } catch (err) {
      setError('Connection error: Failed to reach the API server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-void/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto font-body">
      <div className="bg-obsidian border border-trim rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-trim bg-surface/50">
          <h2 className="font-heading text-2xl tracking-wider text-champagne uppercase font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-offwhite transition-colors cursor-pointer p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {error && (
            <div className="bg-coral/10 border border-coral/30 text-coral p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Core Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g., Bamboo Cuff Adjustable Bracelet"
                className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Occasion</label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                >
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Material *</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="E.g., Gold-toned stainless steel with anti-tarnish coating"
                className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="280"
                  className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block">MRP (₹)</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleChange}
                  placeholder="399"
                  className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Badge</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
                >
                  {BADGES.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Sizes</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="Comma separated, e.g. Adjustable, 6, 7, 8"
                className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
              />
              <span className="text-[10px] text-muted block">Leave blank if sizes do not apply to this item.</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Care Instructions</label>
              <textarea
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleChange}
                rows={2}
                placeholder={DEFAULT_CARE_INSTRUCTIONS}
                className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Product Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell customers about the design details, craftsmanship, and fits..."
              className="w-full bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all text-sm resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-muted font-semibold block">Product Images *</label>
              <span className="text-[10px] text-muted">First image is the primary storefront photo.</span>
            </div>

            {/* Drag Drop / Selector */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-trim hover:border-champagne hover:bg-surface/30 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-champagne animate-spin" />
                  <p className="text-sm font-medium text-champagne">Uploading images to server...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted group-hover:text-champagne transition-colors" />
                  <p className="text-sm font-semibold text-offwhite group-hover:text-champagne transition-colors">
                    Click to upload images
                  </p>
                  <p className="text-xs text-muted">Supports PNG, JPG, WEBP (Max 5MB per file)</p>
                </>
              )}
            </div>

            {/* Uploaded Images List */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                {formData.images.map((imgUrl, index) => (
                  <div 
                    key={imgUrl} 
                    className="relative bg-surface border border-trim rounded-xl overflow-hidden group/img aspect-square flex flex-col"
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Product preview ${index + 1}`} 
                      className="w-full h-full object-cover flex-grow"
                    />
                    
                    {/* Badge showing Primary */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-champagne text-void text-[9px] uppercase tracking-wider font-bold py-1 px-2 rounded-md flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-void" />
                        <span>Cover</span>
                      </div>
                    )}

                    {/* Image Controls Overlay */}
                    <div className="absolute inset-0 bg-void/75 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          className="bg-surface hover:bg-trim text-offwhite p-1.5 rounded-lg cursor-pointer transition-colors"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                      {index < formData.images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          className="bg-surface hover:bg-trim text-offwhite p-1.5 rounded-lg cursor-pointer transition-colors"
                          title="Move Right"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="bg-champagne hover:bg-gold-light text-void p-1.5 rounded-lg cursor-pointer transition-colors"
                          title="Make Cover Image"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-coral/20 hover:bg-coral text-coral hover:text-offwhite p-1.5 rounded-lg cursor-pointer transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-6 border-t border-trim bg-surface/50 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-trim rounded-xl text-offwhite font-semibold hover:bg-surface transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-champagne hover:bg-gold-light text-void font-semibold py-3 px-8 rounded-xl transition-all shadow-[0_4px_14px_rgba(200,164,90,0.15)] disabled:opacity-50 cursor-pointer"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{submitting ? 'Saving changes...' : 'Save Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
