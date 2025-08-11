import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [reportType, setReportType] = useState('sales');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    setSalesData(sales);
    setInventoryData(inventory);
    setCustomerData(customers);
  };

  const getFilteredSales = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      switch (selectedPeriod) {
        case 'today':
          return saleDate >= today;
        case 'week':
          return saleDate >= weekAgo;
        case 'month':
          return saleDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const getSalesStats = () => {
    const filteredSales = getFilteredSales();
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = filteredSales.reduce((sum, sale) => sum + sale.items.length, 0);
    const avgOrderValue = totalSales / (filteredSales.length || 1);

    return {
      totalSales: totalSales.toFixed(2),
      totalOrders: filteredSales.length,
      totalItems,
      avgOrderValue: avgOrderValue.toFixed(2)
    };
  };

  const getTopProducts = () => {
    const productSales = {};
    getFilteredSales().forEach(sale => {
      sale.items.forEach(item => {
        if (productSales[item.name]) {
          productSales[item.name] += item.quantity;
        } else {
          productSales[item.name] = item.quantity;
        }
      });
    });

    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return inventoryData
      .filter(product => product.quantity <= 10)
      .sort((a, b) => a.quantity - b.quantity);
  };

  const getCustomerStats = () => {
    const totalCustomers = customerData.length;
    const activeCustomers = customerData.filter(c => c.status === 'active').length;
    const totalSpent = customerData.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSpent = totalSpent / (totalCustomers || 1);

    return {
      totalCustomers,
      activeCustomers,
      totalSpent: totalSpent.toFixed(2),
      avgSpent: avgSpent.toFixed(2)
    };
  };

  const exportReport = () => {
    const stats = getSalesStats();
    const report = `
POS Sistem Hesabatı
Tarix: ${new Date().toLocaleDateString('az-AZ')}
Dövr: ${selectedPeriod === 'today' ? 'Bu gün' : selectedPeriod === 'week' ? 'Bu həftə' : 'Bu ay'}

Satış Statistikası:
- Ümumi satış: ${stats.totalSales} AZN
- Sifariş sayı: ${stats.totalOrders}
- Məhsul sayı: ${stats.totalItems}
- Orta sifariş: ${stats.avgOrderValue} AZN

Ən çox satılan məhsullar:
${getTopProducts().map((p, i) => `${i + 1}. ${p.name} - ${p.quantity} ədəd`).join('\n')}

Az stokda olan məhsullar:
${getLowStockProducts().map(p => `- ${p.name}: ${p.quantity} ədəd`).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hesabat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = getSalesStats();
  const customerStats = getCustomerStats();

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>📊 Hesabatlar və Analitika</h1>
        <div className="reports-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="today">Bu gün</option>
            <option value="week">Bu həftə</option>
            <option value="month">Bu ay</option>
            <option value="all">Bütün dövr</option>
          </select>
          <button onClick={exportReport} className="export-btn">
            📄 Hesabatı Yüklə
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Ümumi Satış</h3>
            <p className="stat-value">{stats.totalSales} AZN</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Sifariş Sayı</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Məhsul Sayı</h3>
            <p className="stat-value">{stats.totalItems}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Orta Sifariş</h3>
            <p className="stat-value">{stats.avgOrderValue} AZN</p>
          </div>
        </div>
      </div>

      <div className="reports-sections">
        <div className="report-section">
          <h2>🏆 Ən Çox Satılan Məhsullar</h2>
          <div className="top-products">
            {getTopProducts().map((product, index) => (
              <div key={index} className="product-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{product.name}</span>
                <span className="quantity">{product.quantity} ədəd</span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h2>⚠️ Az Stokda Olan Məhsullar</h2>
          <div className="low-stock">
            {getLowStockProducts().map((product, index) => (
              <div key={index} className="stock-item">
                <span className="name">{product.name}</span>
                <span className={`quantity ${product.quantity <= 5 ? 'critical' : 'warning'}`}>
                  {product.quantity} ədəd
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h2>👥 Müştəri Statistikası</h2>
          <div className="customer-stats">
            <div className="customer-stat">
              <span>Ümumi müştəri:</span>
              <strong>{customerStats.totalCustomers}</strong>
            </div>
            <div className="customer-stat">
              <span>Aktiv müştəri:</span>
              <strong>{customerStats.activeCustomers}</strong>
            </div>
            <div className="customer-stat">
              <span>Ümumi xərclər:</span>
              <strong>{customerStats.totalSpent} AZN</strong>
            </div>
            <div className="customer-stat">
              <span>Orta xərclər:</span>
              <strong>{customerStats.avgSpent} AZN</strong>
            </div>
          </div>
        </div>

        <div className="report-section">
          <h2>📅 Son Satışlar</h2>
          <div className="recent-sales">
            {getFilteredSales().slice(0, 10).map((sale, index) => (
              <div key={index} className="sale-item">
                <span className="date">{new Date(sale.date).toLocaleDateString('az-AZ')}</span>
                <span className="items">{sale.items.length} məhsul</span>
                <span className="total">{sale.total} AZN</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 