import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = ({ user, onBack }) => {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allSales = [];
    allUsers.forEach(user => {
      if (user.sales) {
        allSales.push(...user.sales);
      }
    });
    setSales(allSales);
    setUsers(allUsers);

    const storedInventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setInventory(storedInventory);
  };

  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (dateRange) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        end = now;
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        end = now;
        break;
      case 'year':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        end = now;
        break;
      case 'custom':
        start = startDate ? new Date(startDate) : new Date(0);
        end = endDate ? new Date(endDate) : now;
        break;
      default:
        start = new Date(0);
        end = now;
    }

    return { start, end };
  };

  const filterSalesByDate = (sales) => {
    const { start, end } = getDateRange();
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= start && saleDate <= end;
    });
  };

  const generateSalesReport = () => {
    const filteredSales = filterSalesByDate(sales);
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = filteredSales.length;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    const salesByPaymentMethod = filteredSales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total;
      return acc;
    }, {});

    const topProducts = {};
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        topProducts[item.name] = (topProducts[item.name] || 0) + item.quantity;
      });
    });

    const topProductsList = Object.entries(topProducts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalRevenue,
      totalSales,
      averageOrderValue,
      salesByPaymentMethod,
      topProducts: topProductsList,
      sales: filteredSales
    };
  };

  const generateInventoryReport = () => {
    const totalProducts = inventory.length;
    const totalValue = inventory.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    const lowStockProducts = inventory.filter(product => product.quantity <= product.minStock);
    const outOfStockProducts = inventory.filter(product => product.quantity === 0);

    const categoryStats = inventory.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { count: 0, value: 0 };
      }
      acc[product.category].count++;
      acc[product.category].value += product.price * product.quantity;
      return acc;
    }, {});

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      categoryStats
    };
  };

  const generateEmployeeReport = () => {
    const employeeSales = users.filter(u => !u.isAdmin).map(employee => {
      const employeeSales = sales.filter(sale => sale.userId === employee.id);
      const totalRevenue = employeeSales.reduce((sum, sale) => sum + sale.total, 0);
      return {
        name: employee.name,
        role: employee.role,
        totalSales: employeeSales.length,
        totalRevenue,
        averageOrderValue: employeeSales.length > 0 ? totalRevenue / employeeSales.length : 0
      };
    });

    return employeeSales.sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const renderSalesReport = () => {
    const report = generateSalesReport();
    
    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-card">
            <h3>Ümumi Gəlir</h3>
            <p>{report.totalRevenue.toFixed(2)} AZN</p>
          </div>
          <div className="summary-card">
            <h3>Satış Sayı</h3>
            <p>{report.totalSales}</p>
          </div>
          <div className="summary-card">
            <h3>Orta Sifariş Dəyəri</h3>
            <p>{report.averageOrderValue.toFixed(2)} AZN</p>
          </div>
        </div>

        <div className="report-details">
          <div className="detail-section">
            <h3>Ödəniş Növləri</h3>
            <div className="payment-methods">
              {Object.entries(report.salesByPaymentMethod).map(([method, amount]) => (
                <div key={method} className="payment-method">
                  <span>{method === 'cash' ? 'Nağd' : method === 'card' ? 'Kart' : 'Köçürmə'}</span>
                  <span>{amount.toFixed(2)} AZN</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Ən Çox Satılan Məhsullar</h3>
            <div className="top-products">
              {report.topProducts.map(([product, quantity]) => (
                <div key={product} className="top-product">
                  <span>{product}</span>
                  <span>{quantity} ədəd</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Son Satışlar</h3>
            <div className="recent-sales">
              {report.sales.slice(0, 10).map(sale => (
                <div key={sale.id} className="sale-item">
                  <div className="sale-info">
                    <span>{sale.customerName}</span>
                    <span>{new Date(sale.date).toLocaleDateString('az-AZ')}</span>
                  </div>
                  <span className="sale-amount">{sale.total.toFixed(2)} AZN</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventoryReport = () => {
    const report = generateInventoryReport();
    
    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-card">
            <h3>Ümumi Məhsul</h3>
            <p>{report.totalProducts}</p>
          </div>
          <div className="summary-card">
            <h3>Ümumi Dəyər</h3>
            <p>{report.totalValue.toFixed(2)} AZN</p>
          </div>
          <div className="summary-card">
            <h3>Aşağı Stok</h3>
            <p>{report.lowStockProducts.length}</p>
          </div>
          <div className="summary-card">
            <h3>Stok Bitmiş</h3>
            <p>{report.outOfStockProducts.length}</p>
          </div>
        </div>

        <div className="report-details">
          <div className="detail-section">
            <h3>Kateqoriya Statistikası</h3>
            <div className="category-stats">
              {Object.entries(report.categoryStats).map(([category, stats]) => (
                <div key={category} className="category-stat">
                  <span>{category}</span>
                  <div className="category-details">
                    <span>{stats.count} məhsul</span>
                    <span>{stats.value.toFixed(2)} AZN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h3>Aşağı Stok Məhsulları</h3>
            <div className="low-stock-list">
              {report.lowStockProducts.map(product => (
                <div key={product.id} className="low-stock-item">
                  <span>{product.name}</span>
                  <span>{product.quantity} qaldı (min: {product.minStock})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeReport = () => {
    const report = generateEmployeeReport();
    
    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-card">
            <h3>İşçi Sayı</h3>
            <p>{report.length}</p>
          </div>
          <div className="summary-card">
            <h3>Ümumi Satış</h3>
            <p>{report.reduce((sum, emp) => sum + emp.totalSales, 0)}</p>
          </div>
          <div className="summary-card">
            <h3>Ümumi Gəlir</h3>
            <p>{report.reduce((sum, emp) => sum + emp.totalRevenue, 0).toFixed(2)} AZN</p>
          </div>
        </div>

        <div className="report-details">
          <div className="detail-section">
            <h3>İşçi Performansı</h3>
            <div className="employee-performance">
              {report.map(employee => (
                <div key={employee.name} className="employee-stat">
                  <div className="employee-info">
                    <span className="employee-name">{employee.name}</span>
                    <span className="employee-role">{employee.role}</span>
                  </div>
                  <div className="employee-metrics">
                    <span>{employee.totalSales} satış</span>
                    <span>{employee.totalRevenue.toFixed(2)} AZN</span>
                    <span>Orta: {employee.averageOrderValue.toFixed(2)} AZN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reports">
      <header className="reports-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Hesabatlar</h1>
          </div>
        </div>
      </header>

      <div className="reports-content">
        <div className="reports-controls">
          <div className="control-group">
            <label>Hesabat Növü:</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="sales">Satış Hesabatı</option>
              <option value="inventory">Anbar Hesabatı</option>
              <option value="employees">İşçi Hesabatı</option>
            </select>
          </div>

          <div className="control-group">
            <label>Tarix Aralığı:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Bu Gün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son Ay</option>
              <option value="year">Son İl</option>
              <option value="custom">Xüsusi</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="custom-date-controls">
              <div className="control-group">
                <label>Başlanğıc:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="control-group">
                <label>Bitmə:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="report-container">
          {reportType === 'sales' && renderSalesReport()}
          {reportType === 'inventory' && renderInventoryReport()}
          {reportType === 'employees' && renderEmployeeReport()}
        </div>
      </div>
    </div>
  );
};

export default Reports; 