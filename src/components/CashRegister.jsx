import React, { useState, useEffect } from 'react';
import './CashRegister.css';
import BarcodeScanner from './BarcodeScanner';
import PrintReceipt from './PrintReceipt';

const CashRegister = ({ user, onLogout, onViewChange }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    loadProducts();
    loadCustomers();
  };

  const loadProducts = () => {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    setProducts(inventory);
  };

  const loadCustomers = () => {
    const allCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    setCustomers(allCustomers);
  };

  const findProductByBarcode = (barcode) => {
    return products.find(p => 
      p.id.toString() === barcode || 
      p.barcode === barcode ||
      p.name.toLowerCase().includes(barcode.toLowerCase())
    );
  };

  const handleBarcodeScan = (scannedData) => {
    const product = findProductByBarcode(scannedData.code);
    
    if (product) {
      addToCart(product);
      setShowBarcodeScanner(false);
    } else {
      alert('Məhsul tapılmadı! Barkod: ' + scannedData.code);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: parseInt(quantity) }
          : item
      ));
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const saveSale = (sale) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      if (!users[userIndex].sales) users[userIndex].sales = [];
      users[userIndex].sales.push(sale);
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const updateInventory = () => {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    cart.forEach(cartItem => {
      const productIndex = inventory.findIndex(p => p.id === cartItem.id);
      if (productIndex !== -1) {
        inventory[productIndex].quantity -= cartItem.quantity;
      }
    });
    localStorage.setItem('inventory', JSON.stringify(inventory));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Səbət boşdur!');
      return;
    }

    const sale = {
      id: Date.now(),
      customerName: selectedCustomer || 'Ümumi Müştəri',
      items: cart,
      total: getTotal(),
      paymentMethod,
      date: new Date().toISOString(),
      cashier: user.name,
      userId: user.id
    };

    saveSale(sale);
    updateInventory();

    // Show success message and offer to print receipt
    setLastSale(sale);
    setShowPrintReceipt(true);
    
    // Reset form
    setCart([]);
    setSelectedCustomer('');
    setPaymentMethod('cash');
    loadProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="cash-register">
      <header className="cash-header">
        <div className="header-content">
          <h1>Kassa və Satışlar</h1>
          <div className="user-info">
            <span>Kassir: {user.name}</span>
            <button onClick={onLogout} className="logout-btn">Çıxış</button>
          </div>
        </div>
      </header>

      <div className="cash-content">
        <div className="cash-layout">
          {/* Products Section */}
          <div className="products-section">
            <div className="section-header">
              <h2>Məhsullar</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Məhsul, kateqoriya və ya barkod axtar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button 
                  className="barcode-btn"
                  onClick={() => setShowBarcodeScanner(true)}
                  title="Barkod Scanner"
                >
                  📱 Barkod
                </button>
              </div>
            </div>
            
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => addToCart(product)}
                >
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <div className="product-placeholder">📦</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">{product.price} AZN</p>
                    <p className="product-stock">Stok: {product.quantity}</p>
                    {product.barcode && (
                      <p className="product-barcode">📱 {product.barcode}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="cart-section">
            <div className="cart-header">
              <h2>Səbət ({cart.length} məhsul)</h2>
              <button 
                onClick={() => setCart([])} 
                className="clear-cart-btn"
                disabled={cart.length === 0}
              >
                Təmizlə
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>🛒 Səbət boşdur</p>
                  <small>Məhsul seçmək üçün yuxarıdakı siyahıdan seçin</small>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.price} AZN</p>
                    </div>
                    <div className="item-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <div className="total">
                <h3>Ümumi: {getTotal().toFixed(2)} AZN</h3>
              </div>

              <div className="checkout-form">
                <div className="form-group">
                  <label>Müştəri:</label>
                  <select 
                    value={selectedCustomer} 
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Ümumi Müştəri</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.name}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ödəniş Növü:</label>
                  <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Nağd</option>
                    <option value="card">Kart</option>
                    <option value="transfer">Köçürmə</option>
                  </select>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={cart.length === 0}
                >
                  Satışı Tamamla
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}

      {/* Print Receipt Modal */}
      {showPrintReceipt && lastSale && (
        <PrintReceipt
          sale={lastSale}
          onClose={() => setShowPrintReceipt(false)}
        />
      )}
    </div>
  );
};

export default CashRegister; 