import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ user, onLogout, onViewChange, isDarkMode, onToggleDarkMode }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalEmployees: 0
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    let totalSales = 0;
    let totalRevenue = 0;
    
    users.forEach(user => {
      if (user.sales) {
        totalSales += user.sales.length;
        user.sales.forEach(sale => {
          totalRevenue += (sale.productPrice * sale.productQuantity);
        });
      }
    });

    setStats({
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts: inventory.length,
      totalEmployees: users.filter(u => !u.isAdmin).length
    });
  };

  const handleViewChange = (view) => {
    onViewChange(view);
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Panel</h1>
          <div className="user-info">
            <span>Xoş gəlmisiniz, {user.name}</span>
            <button onClick={() => onViewChange('dashboard')} className="dashboard-btn">
              📊 Dashboard
            </button>
            <button onClick={onToggleDarkMode} className="theme-btn">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onLogout} className="logout-btn">Çıxış</button>
          </div>
        </div>
        <div className="quick-actions">
          <button
            className="quick-btn"
            onClick={() => {
              localStorage.setItem('openAddProduct', '1');
              onViewChange('inventory');
            }}
          >
            + Məhsul Əlavə Et
          </button>
          <button
            className="quick-btn"
            onClick={() => onViewChange('employees')}
          >
            + İşçi Əlavə Et
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Ümumi Satış</h3>
              <p>{stats.totalSales} əməliyyat</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>Ümumi Gəlir</h3>
              <p>{stats.totalRevenue} AZN</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Məhsul Sayı</h3>
              <p>{stats.totalProducts} ədəd</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>İşçi Sayı</h3>
              <p>{stats.totalEmployees} nəfər</p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card" onClick={() => handleViewChange('cashier')}>
            <div className="feature-icon">🛒</div>
            <h3>Kassa və Satışlar</h3>
            <p>Satış əməliyyatları və müştəri xidməti</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('inventory')}>
            <div className="feature-icon">📋</div>
            <h3>Anbar Uçotu</h3>
            <p>Məhsul inventarı və stok idarəetməsi</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('shift')}>
            <div className="feature-icon">⏰</div>
            <h3>Növbə Nəzarəti</h3>
            <p>İşçi növbələri və iş vaxtı izləmə</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('inventory-count')}>
            <div className="feature-icon">🔍</div>
            <h3>İnventarlaşdırma</h3>
            <p>Fiziki inventar yoxlaması</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('finance')}>
            <div className="feature-icon">💳</div>
            <h3>Maliyyə İdarəetməsi</h3>
            <p>Gəlir-xərc və maliyyə hesabatları</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('reports')}>
            <div className="feature-icon">📊</div>
            <h3>Hesabatlar</h3>
            <p>Detallı satış və maliyyə hesabatları</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('employees')}>
            <div className="feature-icon">👨‍💼</div>
            <h3>İşçi Rolları və Nəzarət</h3>
            <p>İşçi idarəetməsi və icazələr</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('settings')}>
            <div className="feature-icon">⚙️</div>
            <h3>Sistem Tənzimləmələri</h3>
            <p>Sistem parametrləri və konfiqurasiya</p>
          </div>

          <div className="feature-card" onClick={() => handleViewChange('data-manager')}>
            <div className="feature-icon">💾</div>
            <h3>Məlumat İdarəetməsi</h3>
            <p>Backup, bərpa və məlumat ixrac/idxal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 