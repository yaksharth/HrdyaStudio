import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import ProductForm from '../components/ProductForm';
import { Plus, Search, Edit2, Trash2, Tag, Percent, Layers, HelpCircle, Loader2, RefreshCw } from 'lucide-react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('hrdya_admin_token');
    
    try {
      const response = await fetch('/api/admin-products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('hrdya_admin_token');
        navigate('/admin/login');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        showNotification('Failed to load products.');
      }
    } catch (err) {
      showNotification('Error connecting to the API endpoints.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 7000);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleSave = (savedProduct) => {
    setIsModalOpen(false);
    fetchProducts();
    
    // Check if we are in production to show redeployment warning
    const isProd = process.env.NODE_ENV !== 'development';
    if (isProd) {
      showNotification(`🎉 Saved successfully! A Vercel rebuild has been triggered. Changes will reflect on the storefront in 1-2 minutes.`);
    } else {
      showNotification(`🎉 Saved successfully to products.json!`);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setIsDeletingId(id);
    const token = localStorage.getItem('hrdya_admin_token');

    try {
      const response = await fetch(`/api/admin-products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        const isProd = process.env.NODE_ENV !== 'development';
        if (isProd) {
          showNotification(`🗑️ Product deleted! Vercel redeployment triggered. Takes 1-2 minutes to apply to storefront.`);
        } else {
          showNotification(`🗑️ Product deleted from products.json!`);
        }
      } else {
        const data = await response.json();
        showNotification(`Error: ${data.error || 'Failed to delete product'}`);
      }
    } catch (err) {
      showNotification('Network error occurred while trying to delete.');
    } finally {
      setIsDeletingId(null);
    }
  };

  // Stats calculation
  const totalItems = products.length;
  const categories = [...new Set(products.map(p => p.category))];
  const maxPrice = products.length ? Math.max(...products.map(p => p.price)) : 0;
  const avgPrice = products.length ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.material && p.material.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Paginated Products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-champagne uppercase tracking-wider">Catalog Manager</h1>
            <p className="text-sm text-muted">View, search, edit, and add product designs to Hrdya Studio.</p>
          </div>
          
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-champagne hover:bg-gold-light text-void font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_14px_rgba(200,164,90,0.2)] cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Design</span>
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="bg-surface border border-champagne/30 text-champagne p-4 rounded-2xl flex items-center justify-between shadow-lg animate-fade-in">
            <span className="text-sm font-semibold">{notification}</span>
            <button onClick={() => setNotification('')} className="text-muted hover:text-offwhite text-xs cursor-pointer ml-4">
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-obsidian border border-trim p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-offwhite block">{totalItems}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Total Designs</span>
            </div>
          </div>

          <div className="bg-obsidian border border-trim p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-offwhite block">{categories.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Categories</span>
            </div>
          </div>

          <div className="bg-obsidian border border-trim p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-offwhite block">₹{avgPrice}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Average Price</span>
            </div>
          </div>

          <div className="bg-obsidian border border-trim p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-offwhite block">₹{maxPrice}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Highest Price</span>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-obsidian border border-trim p-4 rounded-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by ID, name, or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-trim rounded-xl py-3 pl-12 pr-4 text-offwhite placeholder:text-muted/50 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-muted font-bold hidden md:inline">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface border border-trim rounded-xl py-3 px-4 focus:outline-none focus:border-champagne focus:ring-1 focus:ring-champagne text-offwhite cursor-pointer min-w-[150px] transition-all"
            >
              <option value="All">All Categories</option>
              {['Bracelets', 'Rings', 'Necklaces', 'Jewellery Sets', 'Earrings'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchProducts}
            className="p-3 border border-trim rounded-xl text-muted hover:text-champagne hover:bg-surface transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Product List Table */}
        <div className="bg-obsidian border border-trim rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 text-muted">
              <Loader2 className="w-10 h-10 animate-spin text-champagne" />
              <span>Fetching product catalog...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted">
              <Layers className="w-12 h-12 stroke-[1.5] opacity-50 mb-2" />
              <p className="font-semibold text-lg">No products found</p>
              <p className="text-sm">Try modifying your search or filter options.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/50 border-b border-trim text-xs uppercase tracking-wider text-muted font-bold">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Occasion</th>
                    <th className="py-4 px-6 text-right">Price</th>
                    <th className="py-4 px-6 text-center">Badge</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-trim text-sm text-offwhite/90">
                  {currentItems.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/20 transition-colors">
                      {/* Image + Name */}
                      <td className="py-4 px-6 flex items-center gap-4 max-w-sm">
                        <div className="w-12 h-12 rounded-lg bg-surface border border-trim overflow-hidden flex-shrink-0">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted"><Tag size={16} /></div>
                          )}
                        </div>
                        <span className="font-semibold truncate" title={p.name}>{p.name}</span>
                      </td>

                      {/* ID */}
                      <td className="py-4 px-6 font-mono text-champagne/80 font-medium">{p.id}</td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface border border-trim text-offwhite/85">
                          {p.category}
                        </span>
                      </td>

                      {/* Occasion */}
                      <td className="py-4 px-6 text-muted">{p.occasion || 'Daily Wear'}</td>

                      {/* Prices */}
                      <td className="py-4 px-6 text-right font-medium">
                        <div className="flex flex-col items-end">
                          <span className="text-offwhite font-bold">₹{p.price}</span>
                          {p.mrp && p.mrp > p.price && (
                            <span className="text-xs text-muted line-through">₹{p.mrp}</span>
                          )}
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-4 px-6 text-center">
                        {p.badge ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-champagne/10 border border-champagne/30 text-champagne">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-muted/30">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-2 bg-surface hover:bg-trim hover:text-champagne border border-trim rounded-lg text-muted transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                handleDeleteConfirm(p.id);
                              }
                            }}
                            disabled={isDeletingId === p.id}
                            className="p-2 bg-surface/50 hover:bg-coral/20 hover:text-coral border border-trim rounded-lg text-muted transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Product"
                          >
                            {isDeletingId === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-coral" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-trim bg-surface/30">
              <span className="text-xs text-muted">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} items
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-trim rounded-xl text-xs font-semibold text-offwhite hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === idx + 1 
                        ? 'bg-champagne text-void' 
                        : 'border border-trim text-offwhite hover:bg-surface'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-4 py-2 border border-trim rounded-xl text-xs font-semibold text-offwhite hover:bg-surface disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </AdminLayout>
  );
}
