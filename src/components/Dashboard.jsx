import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onViewChange, isDarkMode, onToggleDarkMode }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalEmployees: 0,
    todaySales: 0,
    todayRevenue: 0,
    lowStockCount: 0,
    activeShifts: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    calculateStats();
    generateRecentActivity();
    generateTopProducts();
    generateSalesChart();
    setIsLoading(false);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refreshKey]);

  const calculateStats = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const shifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    
    let totalSales = 0;
    let totalRevenue = 0;
    let todaySales = 0;
    let todayRevenue = 0;
    
    const today = new Date().toDateString();
    
    users.forEach(user => {
      if (user.sales) {
        totalSales += user.sales.length;
        user.sales.forEach(sale => {
          const saleDate = new Date(sale.date).toDateString();
          totalRevenue += sale.total;
          
          if (saleDate === today) {
            todaySales++;
            todayRevenue += sale.total;
          }
        });
      }
    });

    const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;
    const activeShifts = shifts.filter(shift => !shift.endTime).length;

    setStats({
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      totalProducts: inventory.length,
      totalEmployees: users.filter(u => !u.isAdmin).length,
      todaySales,
      todayRevenue: todayRevenue.toFixed(2),
      lowStockCount,
      activeShifts
    });
  };

  const generateRecentActivity = () => {
    const activities = [];
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    
    // Get recent sales
    users.forEach(user => {
      if (user.sales) {
        user.sales.slice(0, 5).forEach(sale => {
          activities.push({
            id: `sale-${sale.id}`,
            type: 'sale',
            message: `${user.name} ${sale.total} AZN satış etdi`,
            time: sale.date,
            icon: '💰',
            color: 'success'
          });
        });
      }
    });
    
    // Get recent inventory updates
    inventory.forEach(item => {
      if (item.lastUpdated) {
        activities.push({
          id: `inventory-${item.id}`,
          type: 'inventory',
          message: `${item.name} məhsulu yeniləndi`,
          time: item.lastUpdated,
          icon: '📦',
          color: 'info'
        });
      }
    });
    
    // Sort by time and take latest 10
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    setRecentActivity(activities.slice(0, 10));
  };

  const generateTopProducts = () => {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const productSales = {};
    
    users.forEach(user => {
      if (user.sales) {
        user.sales.forEach(sale => {
          if (productSales[sale.productName]) {
            productSales[sale.productName] += sale.productQuantity;
          } else {
            productSales[sale.productName] = sale.productQuantity;
          }
        });
      }
    });
    
    const topProducts = Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    setTopProducts(topProducts);
  };

  const generateSalesChart = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const days = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
    const chartData = days.map(day => ({ day, sales: 0, revenue: 0 }));
    
    users.forEach(user => {
      if (user.sales) {
        user.sales.forEach(sale => {
          const saleDate = new Date(sale.date);
          const dayIndex = saleDate.getDay();
          chartData[dayIndex].sales++;
          chartData[dayIndex].revenue += sale.total;
        });
      }
    });
    
    setSalesChart(chartData);
  };

  const getMaxRevenue = () => {
    return Math.max(...salesChart.map(item => item.revenue));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'İndicə';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} dəqiqə əvvəl`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} saat əvvəl`;
    return date.toLocaleDateString('az-AZ');
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'addProduct':
        localStorage.setItem('openAddProduct', '1');
        onViewChange('inventory');
        break;
      case 'newSale':
        onViewChange('cashier');
        break;
      case 'viewReports':
        onViewChange('reports');
        break;
      case 'manageEmployees':
        onViewChange('employees');
        break;
      default:
        onViewChange(action);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner"></div>
        <p>Məlumatlar yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>📊 İdarəetmə Paneli</h1>
            <p>Xoş gəlmisiniz, {user.name}!</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button onClick={onToggleDarkMode} className="theme-btn">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={onLogout} className="logout-btn">Çıxış</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Bu Günkü Satış</h3>
              <p className="stat-value">{stats.todaySales} əməliyyat</p>
              <p className="stat-amount">{stats.todayRevenue} AZN</p>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>Ümumi Gəlir</h3>
              <p className="stat-value">{stats.totalRevenue} AZN</p>
              <p className="stat-subtitle">{stats.totalSales} satış</p>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Məhsul Sayı</h3>
              <p className="stat-value">{stats.totalProducts} ədəd</p>
              <p className="stat-subtitle">{stats.lowStockCount} az stok</p>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>İşçi Sayı</h3>
              <p className="stat-value">{stats.totalEmployees} nəfər</p>
              <p className="stat-subtitle">{stats.activeShifts} aktiv növbə</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-card">
            <div className="card-header">
              <h3>📊 Həftəlik Satışlar</h3>
              <button onClick={() => setRefreshKey(prev => prev + 1)} className="refresh-btn">
                🔄
              </button>
            </div>
            <div className="chart-content">
              {salesChart.map((item, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar-label">{item.day}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        height: `${(item.revenue / getMaxRevenue()) * 100}%`,
                        backgroundColor: `hsl(${200 + index * 30}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{item.revenue.toFixed(0)} AZN</div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-card">
            <div className="card-header">
              <h3>🕒 Son Fəaliyyətlər</h3>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className={`activity-item ${activity.color}`}>
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <span className="activity-time">{formatTime(activity.time)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Hələ fəaliyyət yoxdur</p>
                </div>
              )}
            </div>
          </div>

          <div className="products-card">
            <div className="card-header">
              <h3>🏆 Ən Çox Satılan Məhsullar</h3>
            </div>
            <div className="products-list">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.name} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.quantity} ədəd satılıb</p>
                    </div>
                    <div className="product-icon">📦</div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Hələ satış məlumatı yoxdur</p>
                </div>
              )}
            </div>
          </div>

          <div className="quick-actions-card">
            <div className="card-header">
              <h3>⚡ Sürətli Əməliyyatlar</h3>
            </div>
            <div className="quick-actions-grid">
              <button 
                onClick={() => handleQuickAction('addProduct')}
                className="quick-action-btn primary"
              >
                <span className="action-icon">➕</span>
                <span>Məhsul Əlavə Et</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('newSale')}
                className="quick-action-btn success"
              >
                <span className="action-icon">🛒</span>
                <span>Yeni Satış</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('viewReports')}
                className="quick-action-btn info"
              >
                <span className="action-icon">📊</span>
                <span>Hesabatlar</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('manageEmployees')}
                className="quick-action-btn warning"
              >
                <span className="action-icon">👥</span>
                <span>İşçi İdarəetməsi</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('inventory')}
                className="quick-action-btn secondary"
              >
                <span className="action-icon">📋</span>
                <span>Anbar</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('finance')}
                className="quick-action-btn danger"
              >
                <span className="action-icon">💳</span>
                <span>Maliyyə</span>
              </button>
              
              <button 
                onClick={() => handleQuickAction('data-manager')}
                className="quick-action-btn secondary"
              >
                <span className="action-icon">💾</span>
                <span>Məlumat İdarəetməsi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
