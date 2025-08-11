import React, { useState, useEffect } from 'react';
import './CustomerManagement.css';

const CustomerManagement = ({ user, onBack }) => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const storedCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(storedCustomers);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const customer = {
      id: Date.now(),
      ...newCustomer,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalPurchases: 0,
      totalSpent: 0
    };

    const updatedCustomers = [...customers, customer];
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      status: 'active'
    });
    setShowAddForm(false);
  };

  const handleEditCustomer = (e) => {
    e.preventDefault();
    const updatedCustomers = customers.map(customer =>
      customer.id === editingCustomer.id
        ? {
            ...editingCustomer,
            lastUpdated: new Date().toISOString()
          }
        : customer
    );

    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Bu müştərini silmək istədiyinizə əminsiniz?')) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      setCustomers(updatedCustomers);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'totalSpent':
        return b.totalSpent - a.totalSpent;
      case 'totalPurchases':
        return b.totalPurchases - a.totalPurchases;
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const inactive = customers.filter(c => c.status === 'inactive').length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return { total, active, inactive, totalSpent };
  };

  const stats = getCustomerStats();

  return (
    <div className="customer-management">
      <header className="customer-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Müştəri İdarəetməsi</h1>
          </div>
          <div className="header-right">
            <button onClick={() => setShowAddForm(true)} className="add-btn">
              + Müştəri Əlavə Et
            </button>
          </div>
        </div>
      </header>

      <div className="customer-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Ümumi Müştəri</h3>
              <p>{stats.total} nəfər</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Aktiv Müştəri</h3>
              <p>{stats.active} nəfər</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Ümumi Satış</h3>
              <p>{stats.totalSpent.toFixed(2)} AZN</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Orta Satış</h3>
              <p>{stats.total > 0 ? (stats.totalSpent / stats.total).toFixed(2) : 0} AZN</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="🔍 Müştəri adı, telefon və ya email axtar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">📋 Bütün Statuslar</option>
                <option value="active">✅ Aktiv</option>
                <option value="inactive">❌ Qeyri-aktiv</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">📝 Ada görə</option>
                <option value="totalSpent">💰 Satışa görə</option>
                <option value="totalPurchases">🛒 Alış sayına görə</option>
                <option value="date">📅 Tarixə görə</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Müştəri Adı</th>
                <th>Telefon</th>
                <th>Email</th>
                <th>Ünvan</th>
                <th>Status</th>
                <th>Alış Sayı</th>
                <th>Ümumi Satış</th>
                <th>Son Yenilənmə</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-info">
                      <strong>{customer.name}</strong>
                      {customer.notes && <small>{customer.notes}</small>}
                    </div>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>
                    <span className={`status-badge ${customer.status}`}>
                      {customer.status === 'active' ? '✅ Aktiv' : '❌ Qeyri-aktiv'}
                    </span>
                  </td>
                  <td>{customer.totalPurchases}</td>
                  <td>{customer.totalSpent.toFixed(2)} AZN</td>
                  <td>{new Date(customer.lastUpdated).toLocaleDateString('az-AZ')}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => setEditingCustomer(customer)}
                        className="edit-btn"
                      >
                        Düzənlə
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(customer.id)}
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

      {/* Add Customer Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Yeni Müştəri Əlavə Et</h2>
              <button onClick={() => setShowAddForm(false)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleAddCustomer} className="customer-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Müştəri Adı:</label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefon:</label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Qeyri-aktiv</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Ünvan:</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Qeydlər:</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  rows="3"
                  placeholder="Müştəri haqqında əlavə məlumat..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">Əlavə Et</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="cancel-btn">
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Müştərini Düzənlə</h2>
              <button onClick={() => setEditingCustomer(null)} className="close-btn">✕</button>
            </div>
            <form onSubmit={handleEditCustomer} className="customer-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Müştəri Adı:</label>
                  <input
                    type="text"
                    value={editingCustomer.name}
                    onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Telefon:</label>
                  <input
                    type="tel"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    value={editingCustomer.status}
                    onChange={(e) => setEditingCustomer({...editingCustomer, status: e.target.value})}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Qeyri-aktiv</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>Ünvan:</label>
                <input
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Qeydlər:</label>
                <textarea
                  value={editingCustomer.notes}
                  onChange={(e) => setEditingCustomer({...editingCustomer, notes: e.target.value})}
                  rows="3"
                  placeholder="Müştəri haqqında əlavə məlumat..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">Yadda Saxla</button>
                <button type="button" onClick={() => setEditingCustomer(null)} className="cancel-btn">
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
