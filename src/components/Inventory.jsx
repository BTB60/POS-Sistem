import React, { useState, useEffect } from 'react';
import './Inventory.css';

// Reusable Product Form Component
const ProductForm = ({ product, onSubmit, onCancel, title, submitText }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    description: product?.description || '',
    supplier: product?.supplier || '',
    minStock: product?.minStock || '',
    barcode: product?.barcode || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onCancel} className="close-btn">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Məhsul Adı:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Kateqoriya:</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Qiymət (AZN):</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Stok Miqdarı:</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Min. Stok:</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => handleChange('minStock', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Təchizatçı:</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>📱 Barkod:</label>
              <input
                type="text"
                placeholder="Barkod kodunu daxil edin..."
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>📝 Təsvir:</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows="3"
                placeholder="Məhsul haqqında ətraflı məlumat..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">{submitText}</button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Ləğv Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Inventory = ({ user, onBack }) => {
  const [inventory, setInventory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [filterStock, setFilterStock] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    const shouldOpen = localStorage.getItem('openAddProduct');
    if (shouldOpen === '1') {
      setShowAddForm(true);
      localStorage.removeItem('openAddProduct');
    }
  }, []);

  const loadInventory = () => {
    const storedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setInventory(storedInventory);
  };

  const handleAddProduct = (formData) => {
    const product = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const updatedInventory = [...inventory, product];
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
    setShowAddForm(false);
  };

  const handleEditProduct = (formData) => {
    const updatedInventory = inventory.map(product =>
      product.id === editingProduct.id
        ? {
            ...editingProduct,
            ...formData,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity),
            minStock: parseInt(formData.minStock),
            lastUpdated: new Date().toISOString()
          }
        : product
    );

    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) {
      const updatedInventory = inventory.filter(product => product.id !== productId);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      setInventory(updatedInventory);
    }
  };

  const handleStockAdjustment = (productId, adjustment) => {
    const updatedInventory = inventory.map(product =>
      product.id === productId
        ? {
            ...product,
            quantity: Math.max(0, product.quantity + adjustment),
            lastUpdated: new Date().toISOString()
          }
        : product
    );

    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);
  };

  const getCategories = () => {
    return [...new Set(inventory.map(product => product.category))];
  };

  const filteredInventory = inventory.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesPrice = (!filterPrice.min || product.price >= parseFloat(filterPrice.min)) &&
                        (!filterPrice.max || product.price <= parseFloat(filterPrice.max));
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'low' && product.quantity <= product.minStock) ||
                        (filterStock === 'out' && product.quantity === 0) ||
                        (filterStock === 'in' && product.quantity > product.minStock);
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'category':
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      case 'date':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const lowStockProducts = inventory.filter(product => product.quantity <= product.minStock);

  return (
    <div className="inventory">
      <header className="inventory-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Anbar Uçotu</h1>
          </div>
          <div className="header-right">
            <button onClick={() => setShowAddForm(true)} className="add-btn">
              + Məhsul Əlavə Et
            </button>
          </div>
        </div>
      </header>

      <div className="inventory-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Ümumi Məhsul</h3>
              <p>{inventory.length} ədəd</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Ümumi Dəyər</h3>
              <p>{inventory.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)} AZN</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>Aşağı Stok</h3>
              <p>{lowStockProducts.length} məhsul</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Kateqoriya</h3>
              <p>{getCategories().length} növ</p>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="🔍 Məhsul, təsvir, barkod və ya təchizatçı axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">📂 Bütün Kateqoriyalar</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="filter-select"
              >
                <option value="all">📦 Bütün Stoklar</option>
                <option value="low">⚠️ Aşağı Stok</option>
                <option value="out">❌ Stok Bitdi</option>
                <option value="in">✅ Yaxşı Stok</option>
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label>💰 Qiymət Aralığı:</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterPrice.min}
                  onChange={(e) => setFilterPrice({...filterPrice, min: e.target.value})}
                  className="price-input"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filterPrice.max}
                  onChange={(e) => setFilterPrice({...filterPrice, max: e.target.value})}
                  className="price-input"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>📊 Sıralama:</label>
              <div className="sort-controls">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="name">Ad</option>
                  <option value="price">Qiymət</option>
                  <option value="quantity">Stok</option>
                  <option value="category">Kateqoriya</option>
                  <option value="date">Tarix</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-btn"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
            
            <div className="filter-group">
              <label>👁️ Görünüş:</label>
              <div className="view-controls">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="low-stock-alert">
            <h3>⚠️ Aşağı Stok Xəbərdarlığı</h3>
            <div className="low-stock-list">
              {lowStockProducts.map(product => (
                <span key={product.id} className="low-stock-item">
                  {product.name} ({product.quantity} qaldı)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="inventory-table">
          <table>
            <thead>
              <tr>
                <th>Məhsul Adı</th>
                <th>Kateqoriya</th>
                <th>Qiymət</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>📱 Barkod</th>
                <th>Təchizatçı</th>
                <th>Son Yenilənmə</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {sortedInventory.map(product => (
                <tr key={product.id} className={product.quantity <= product.minStock ? 'low-stock-row' : ''}>
                  <td>
                    <div className="product-info">
                      <strong>{product.name}</strong>
                      {product.description && <small>{product.description}</small>}
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price} AZN</td>
                  <td>
                    <div className="stock-controls">
                      <button 
                        onClick={() => handleStockAdjustment(product.id, -1)}
                        className="stock-btn"
                      >
                        -
                      </button>
                      <span className={product.quantity <= product.minStock ? 'low-stock' : ''}>
                        {product.quantity}
                      </span>
                      <button 
                        onClick={() => handleStockAdjustment(product.id, 1)}
                        className="stock-btn"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{product.minStock}</td>
                  <td>
                    {product.barcode ? (
                      <span className="barcode-display" title={`Barkod: ${product.barcode}`}>
                        📱 {product.barcode}
                      </span>
                    ) : (
                      <span className="no-barcode">—</span>
                    )}
                  </td>
                  <td>{product.supplier}</td>
                  <td>{new Date(product.lastUpdated).toLocaleDateString('az-AZ')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => setEditingProduct(product)}
                        className="edit-btn"
                      >
                        Düzənlə
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="delete-btn"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <ProductForm
          product={null}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
          title="Yeni Məhsul Əlavə Et"
          submitText="Əlavə Et"
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleEditProduct}
          onCancel={() => setEditingProduct(null)}
          title="Məhsulu Düzənlə"
          submitText="Yadda Saxla"
        />
      )}
    </div>
  );
};

export default Inventory; 