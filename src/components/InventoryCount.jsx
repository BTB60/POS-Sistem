import React, { useEffect, useState } from 'react';
import './InventoryCount.css';

const InventoryCount = ({ user, onBack }) => {
  const [inventory, setInventory] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [countedQty, setCountedQty] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setInventory(JSON.parse(localStorage.getItem('inventory') || '[]'));
    setLogs(JSON.parse(localStorage.getItem('inventoryCounts') || '[]'));
  }, []);

  const saveLogs = (updated) => {
    localStorage.setItem('inventoryCounts', JSON.stringify(updated));
    setLogs(updated);
  };

  const submitCount = (e) => {
    e.preventDefault();
    const productIndex = inventory.findIndex(p => p.id === Number(selectedId));
    if (productIndex === -1) { alert('Məhsul seçin.'); return; }

    const product = inventory[productIndex];
    const counted = parseInt(countedQty);
    if (Number.isNaN(counted)) { alert('Keçərli say daxil edin.'); return; }

    const diff = counted - product.quantity;

    const updatedInventory = [...inventory];
    updatedInventory[productIndex] = { ...product, quantity: counted, lastUpdated: new Date().toISOString() };
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    setInventory(updatedInventory);

    const log = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      previousQty: product.quantity,
      countedQty: counted,
      difference: diff,
      userId: user.id,
      userName: user.name,
      date: new Date().toISOString(),
    };

    const updatedLogs = [log, ...logs];
    saveLogs(updatedLogs);
    setSelectedId('');
    setCountedQty('');
  };

  return (
    <div className="invcount">
      <header className="invcount-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>İnventarlaşdırma</h1>
          </div>
        </div>
      </header>

      <div className="invcount-content">
        <div className="card">
          <h3>Fiziki Sayım</h3>
          <form onSubmit={submitCount} className="count-form">
            <div className="form-row">
              <div className="form-group">
                <label>Məhsul</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
                  <option value="">Seçin</option>
                  {inventory.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.quantity})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sayım Miqdarı</label>
                <input type="number" value={countedQty} onChange={e => setCountedQty(e.target.value)} required />
              </div>
            </div>
            <button className="primary" type="submit">Yadda Saxla</button>
          </form>
        </div>

        <div className="card">
          <h3>Sayım Qeydləri</h3>
          <div className="logs">
            {logs.slice(0, 20).map(l => (
              <div key={l.id} className="log-item">
                <div>
                  <strong>{l.productName}</strong> — {new Date(l.date).toLocaleString('az-AZ')}
                  <div className="muted">Keçmiş: {l.previousQty}, Sayım: {l.countedQty}</div>
                </div>
                <div className={`diff ${l.difference === 0 ? '' : l.difference > 0 ? 'pos' : 'neg'}`}>
                  {l.difference > 0 ? '+' : ''}{l.difference}
                </div>
              </div>
            ))}
            {logs.length === 0 && <div>Hələ heç bir sayım qeydi yoxdur.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCount;

