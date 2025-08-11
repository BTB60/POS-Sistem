import React from 'react';
import './PrintReceipt.css';

const PrintReceipt = ({ sale, onClose }) => {
  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Satış Qəbzi</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .receipt {
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .title {
              font-size: 16px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              font-size: 10px;
              margin: 5px 0;
            }
            .items {
              margin: 15px 0;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .item-name {
              flex: 1;
            }
            .item-price {
              text-align: right;
              margin-left: 10px;
            }
            .total {
              border-top: 1px dashed #000;
              padding-top: 10px;
              margin-top: 10px;
              font-weight: bold;
              text-align: right;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1 class="title">POS SİSTEM</h1>
              <p class="subtitle">Satış Qəbzi</p>
              <p class="subtitle">Tarix: ${new Date(sale.date).toLocaleString('az-AZ')}</p>
              <p class="subtitle">Qəbz №: ${sale.id}</p>
              <p class="subtitle">Kassir: ${sale.cashier}</p>
              <p class="subtitle">Müştəri: ${sale.customerName}</p>
            </div>
            
            <div class="items">
              ${sale.items.map(item => `
                <div class="item">
                  <span class="item-name">${item.name} x${item.quantity}</span>
                  <span class="item-price">${(item.price * item.quantity).toFixed(2)} AZN</span>
                </div>
              `).join('')}
            </div>
            
            <div class="total">
              <div>Ümumi: ${sale.total.toFixed(2)} AZN</div>
              <div>Ödəniş: ${sale.paymentMethod === 'cash' ? 'Nağd' : sale.paymentMethod === 'card' ? 'Kart' : 'Köçürmə'}</div>
            </div>
            
            <div class="footer">
              <p>Təşəkkür edirik!</p>
              <p>Yenidən gözləyirik!</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="print-receipt-overlay">
      <div className="print-receipt-modal">
        <div className="print-header">
          <h2>🖨️ Satış Qəbzi</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="receipt-preview">
          <div className="receipt-content">
            <div className="receipt-header">
              <h3>POS SİSTEM</h3>
              <p>Satış Qəbzi</p>
              <p>Tarix: {new Date(sale.date).toLocaleString('az-AZ')}</p>
              <p>Qəbz №: {sale.id}</p>
              <p>Kassir: {sale.cashier}</p>
              <p>Müştəri: {sale.customerName}</p>
            </div>
            
            <div className="receipt-items">
              {sale.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <span className="item-name">{item.name} x{item.quantity}</span>
                  <span className="item-price">{(item.price * item.quantity).toFixed(2)} AZN</span>
                </div>
              ))}
            </div>
            
            <div className="receipt-total">
              <div>Ümumi: {sale.total.toFixed(2)} AZN</div>
              <div>Ödəniş: {sale.paymentMethod === 'cash' ? 'Nağd' : sale.paymentMethod === 'card' ? 'Kart' : 'Köçürmə'}</div>
            </div>
            
            <div className="receipt-footer">
              <p>Təşəkkür edirik!</p>
              <p>Yenidən gözləyirik!</p>
            </div>
          </div>
        </div>
        
        <div className="print-actions">
          <button onClick={printReceipt} className="print-btn">
            🖨️ Çap Et
          </button>
          <button onClick={onClose} className="cancel-btn">
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;
