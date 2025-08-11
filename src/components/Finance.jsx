import React, { useState, useEffect } from 'react';
import './Finance.css';

const Finance = ({ user, onBack, isDarkMode }) => {
  const [cashRegister, setCashRegister] = useState({
    openingBalance: 0,
    currentBalance: 0,
    totalSales: 0,
    totalRefunds: 0,
    cashIn: 0,
    cashOut: 0
  });
  
  const [paymentMethods, setPaymentMethods] = useState({
    cash: 0,
    card: 0,
    transfer: 0,
    mobile: 0
  });
  
  const [invoices, setInvoices] = useState([]);
  const [discountCoupons, setDiscountCoupons] = useState([]);
  const [taxRate, setTaxRate] = useState(18); // 18% VAT
  const [showCashModal, setShowCashModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [cashTransaction, setCashTransaction] = useState({
    type: 'in',
    amount: 0,
    description: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: 0,
    type: 'percentage', // percentage or fixed
    validFrom: '',
    validTo: '',
    maxUses: 100,
    usedCount: 0
  });

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = () => {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const storedCashRegister = JSON.parse(localStorage.getItem('cashRegister')) || {
      openingBalance: 1000,
      currentBalance: 1000,
      totalSales: 0,
      totalRefunds: 0,
      cashIn: 0,
      cashOut: 0
    };
    
    const storedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const storedCoupons = JSON.parse(localStorage.getItem('discountCoupons')) || [];
    
    // Calculate payment methods from sales
    const methods = sales.reduce((acc, sale) => {
      const method = sale.paymentMethod || 'cash';
      acc[method] = (acc[method] || 0) + sale.total;
      return acc;
    }, { cash: 0, card: 0, transfer: 0, mobile: 0 });
    
    setCashRegister(storedCashRegister);
    setPaymentMethods(methods);
    setInvoices(storedInvoices);
    setDiscountCoupons(storedCoupons);
  };

  const handleCashTransaction = () => {
    const { type, amount, description } = cashTransaction;
    const newBalance = type === 'in' 
      ? cashRegister.currentBalance + amount
      : cashRegister.currentBalance - amount;
    
    const updatedCashRegister = {
      ...cashRegister,
      currentBalance: newBalance,
      cashIn: type === 'in' ? cashRegister.cashIn + amount : cashRegister.cashIn,
      cashOut: type === 'out' ? cashRegister.cashOut + amount : cashRegister.cashOut
    };
    
    setCashRegister(updatedCashRegister);
    localStorage.setItem('cashRegister', JSON.stringify(updatedCashRegister));
    
    // Add transaction to history
    const transactions = JSON.parse(localStorage.getItem('cashTransactions')) || [];
    transactions.push({
      id: Date.now(),
      type,
      amount,
      description,
      date: new Date().toISOString(),
      userId: user.id
    });
    localStorage.setItem('cashTransactions', JSON.stringify(transactions));
    
    setShowCashModal(false);
    setCashTransaction({ type: 'in', amount: 0, description: '' });
  };

  const createInvoice = () => {
    const invoice = {
      id: Date.now(),
      ...newInvoice,
      date: new Date().toISOString(),
      status: 'pending',
      userId: user.id
    };
    
    const updatedInvoices = [...invoices, invoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    setShowInvoiceModal(false);
    setNewInvoice({
      customerName: '',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0
    });
  };

  const addCoupon = () => {
    const coupon = {
      id: Date.now(),
      ...newCoupon,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    const updatedCoupons = [...discountCoupons, coupon];
    setDiscountCoupons(updatedCoupons);
    localStorage.setItem('discountCoupons', JSON.stringify(updatedCoupons));
    
    setShowCouponModal(false);
    setNewCoupon({
      code: '',
      discount: 0,
      type: 'percentage',
      validFrom: '',
      validTo: '',
      maxUses: 100,
      usedCount: 0
    });
  };

  const calculateTax = (amount) => {
    return (amount * taxRate) / 100;
  };

  const getTotalRevenue = () => {
    return Object.values(paymentMethods).reduce((sum, amount) => sum + amount, 0);
  };

  const getProfitMargin = () => {
    // Simplified profit calculation (you can make this more complex)
    const totalRevenue = getTotalRevenue();
    const estimatedCost = totalRevenue * 0.6; // Assuming 60% cost
    return totalRevenue - estimatedCost;
  };

  return (
    <div className={`finance-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="finance-header">
        <button onClick={onBack} className="back-btn">← Geri</button>
        <h1>💰 Maliyyə İdarəetməsi</h1>
        <div className="header-actions">
          <button onClick={() => setShowCashModal(true)} className="action-btn">
            💵 Nağd Əməliyyat
          </button>
          <button onClick={() => setShowInvoiceModal(true)} className="action-btn">
            📄 Hesab-Faktura
          </button>
          <button onClick={() => setShowCouponModal(true)} className="action-btn">
            🎫 Endirim Kuponu
          </button>
        </div>
      </header>

      <div className="finance-content">
        {/* Cash Register Overview */}
        <div className="cash-register-section">
          <h2>🏦 Kassa Qutusu</h2>
          <div className="cash-stats">
            <div className="cash-stat">
              <span className="label">Açılış Balansı:</span>
              <span className="value">{cashRegister.openingBalance.toFixed(2)} AZN</span>
            </div>
            <div className="cash-stat">
              <span className="label">Cari Balans:</span>
              <span className="value">{cashRegister.currentBalance.toFixed(2)} AZN</span>
            </div>
            <div className="cash-stat">
              <span className="label">Nağd Giriş:</span>
              <span className="value positive">{cashRegister.cashIn.toFixed(2)} AZN</span>
            </div>
            <div className="cash-stat">
              <span className="label">Nağd Çıxış:</span>
              <span className="value negative">{cashRegister.cashOut.toFixed(2)} AZN</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods-section">
          <h2>💳 Ödəniş Növləri</h2>
          <div className="payment-methods-grid">
            <div className="payment-method">
              <div className="method-icon">💵</div>
              <div className="method-info">
                <h3>Nağd</h3>
                <p>{paymentMethods.cash.toFixed(2)} AZN</p>
              </div>
            </div>
            <div className="payment-method">
              <div className="method-icon">💳</div>
              <div className="method-info">
                <h3>Kart</h3>
                <p>{paymentMethods.card.toFixed(2)} AZN</p>
              </div>
            </div>
            <div className="payment-method">
              <div className="method-icon">🏦</div>
              <div className="method-info">
                <h3>Köçürmə</h3>
                <p>{paymentMethods.transfer.toFixed(2)} AZN</p>
              </div>
            </div>
            <div className="payment-method">
              <div className="method-icon">📱</div>
              <div className="method-info">
                <h3>Mobil</h3>
                <p>{paymentMethods.mobile.toFixed(2)} AZN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="financial-summary">
          <h2>📊 Maliyyə Xülasəsi</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>Ümumi Gəlir</h3>
                <p>{getTotalRevenue().toFixed(2)} AZN</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>Təxmini Mənfəət</h3>
                <p>{getProfitMargin().toFixed(2)} AZN</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📄</div>
              <div className="summary-content">
                <h3>Hesab-Faktura</h3>
                <p>{invoices.length} ədəd</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🎫</div>
              <div className="summary-content">
                <h3>Aktiv Kuponlar</h3>
                <p>{discountCoupons.filter(c => c.usedCount < c.maxUses).length} ədəd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="tax-settings">
          <h2>🏛️ Vergi Tənzimləmələri</h2>
          <div className="tax-control">
            <label>ƏDV Dərəcəsi (%):</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              min="0"
              max="100"
              step="0.1"
            />
            <span>Məhsul qiyməti: 100 AZN → Vergi: {calculateTax(100).toFixed(2)} AZN</span>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="recent-invoices">
          <h2>📄 Son Hesab-Fakturalar</h2>
          <div className="invoices-list">
            {invoices.slice(0, 5).map(invoice => (
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-info">
                  <span className="customer">{invoice.customerName}</span>
                  <span className="date">{new Date(invoice.date).toLocaleDateString('az-AZ')}</span>
                </div>
                <div className="invoice-amount">
                  <span className="total">{invoice.total.toFixed(2)} AZN</span>
                  <span className={`status ${invoice.status}`}>{invoice.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Coupons */}
        <div className="active-coupons">
          <h2>🎫 Aktiv Endirim Kuponları</h2>
          <div className="coupons-list">
            {discountCoupons.filter(c => c.usedCount < c.maxUses).slice(0, 5).map(coupon => (
              <div key={coupon.id} className="coupon-item">
                <div className="coupon-code">{coupon.code}</div>
                <div className="coupon-details">
                  <span className="discount">
                    {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount} AZN`}
                  </span>
                  <span className="usage">{coupon.usedCount}/{coupon.maxUses}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Transaction Modal */}
      {showCashModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>💵 Nağd Əməliyyat</h3>
            <div className="form-group">
              <label>Əməliyyat Növü:</label>
              <select
                value={cashTransaction.type}
                onChange={(e) => setCashTransaction({...cashTransaction, type: e.target.value})}
              >
                <option value="in">Nağd Giriş</option>
                <option value="out">Nağd Çıxış</option>
              </select>
            </div>
            <div className="form-group">
              <label>Məbləğ (AZN):</label>
              <input
                type="number"
                value={cashTransaction.amount}
                onChange={(e) => setCashTransaction({...cashTransaction, amount: Number(e.target.value)})}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Təsvir:</label>
              <input
                type="text"
                value={cashTransaction.description}
                onChange={(e) => setCashTransaction({...cashTransaction, description: e.target.value})}
                placeholder="Əməliyyatın təsviri..."
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCashModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={handleCashTransaction} className="confirm-btn">Təsdiq Et</button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📄 Yeni Hesab-Faktura</h3>
            <div className="form-group">
              <label>Müştəri Adı:</label>
              <input
                type="text"
                value={newInvoice.customerName}
                onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
                placeholder="Müştəri adını daxil edin..."
              />
            </div>
            <div className="form-group">
              <label>Məbləğ (AZN):</label>
              <input
                type="number"
                value={newInvoice.subtotal}
                onChange={(e) => {
                  const subtotal = Number(e.target.value);
                  const tax = calculateTax(subtotal);
                  const total = subtotal + tax - newInvoice.discount;
                  setNewInvoice({
                    ...newInvoice,
                    subtotal,
                    tax,
                    total
                  });
                }}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Endirim (AZN):</label>
              <input
                type="number"
                value={newInvoice.discount}
                onChange={(e) => {
                  const discount = Number(e.target.value);
                  const total = newInvoice.subtotal + newInvoice.tax - discount;
                  setNewInvoice({...newInvoice, discount, total});
                }}
                min="0"
                step="0.01"
              />
            </div>
            <div className="invoice-preview">
              <p>Alt məbləğ: {newInvoice.subtotal.toFixed(2)} AZN</p>
              <p>ƏDV ({taxRate}%): {newInvoice.tax.toFixed(2)} AZN</p>
              <p>Endirim: {newInvoice.discount.toFixed(2)} AZN</p>
              <p><strong>Ümumi: {newInvoice.total.toFixed(2)} AZN</strong></p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowInvoiceModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={createInvoice} className="confirm-btn">Yarad</button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🎫 Yeni Endirim Kuponu</h3>
            <div className="form-group">
              <label>Kupon Kodu:</label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                placeholder="Məsələn: SALE20"
              />
            </div>
            <div className="form-group">
              <label>Endirim Növü:</label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value})}
              >
                <option value="percentage">Faiz (%)</option>
                <option value="fixed">Sabit Məbləğ (AZN)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Endirim Dəyəri:</label>
              <input
                type="number"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({...newCoupon, discount: Number(e.target.value)})}
                min="0"
                step={newCoupon.type === 'percentage' ? 1 : 0.01}
                max={newCoupon.type === 'percentage' ? 100 : undefined}
              />
            </div>
            <div className="form-group">
              <label>Maksimum İstifadə:</label>
              <input
                type="number"
                value={newCoupon.maxUses}
                onChange={(e) => setNewCoupon({...newCoupon, maxUses: Number(e.target.value)})}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Etibarlılıq Tarixi:</label>
              <input
                type="date"
                value={newCoupon.validTo}
                onChange={(e) => setNewCoupon({...newCoupon, validTo: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowCouponModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={addCoupon} className="confirm-btn">Əlavə Et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;

