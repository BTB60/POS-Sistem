import React, { useEffect, useState } from 'react';
import './ShiftControl.css';

const ShiftControl = ({ user, onBack }) => {
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [startCash, setStartCash] = useState('');
  const [endCash, setEndCash] = useState('');

  useEffect(() => {
    const allShifts = JSON.parse(localStorage.getItem('shifts') || '[]');
    setShifts(allShifts);
    const open = allShifts.find(s => s.userId === user.id && !s.endTime);
    setCurrentShift(open || null);
  }, [user.id]);

  const saveShifts = (updated) => {
    localStorage.setItem('shifts', JSON.stringify(updated));
    setShifts(updated);
  };

  const openShift = (e) => {
    e.preventDefault();
    if (currentShift) { alert('Aktiv növbə mövcuddur.'); return; }
    const newShift = {
      id: Date.now(),
      userId: user.id,
      cashier: user.name,
      startTime: new Date().toISOString(),
      endTime: null,
      startCash: parseFloat(startCash || 0),
      endCash: null,
      totalSales: 0
    };
    const updated = [newShift, ...shifts];
    saveShifts(updated);
    setCurrentShift(newShift);
    setStartCash('');
  };

  const closeShift = (e) => {
    e.preventDefault();
    if (!currentShift) { alert('Aktiv növbə yoxdur.'); return; }

    // Calculate sales during shift for this user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const me = users.find(u => u.id === user.id);
    const sales = (me?.sales || []).filter(s => new Date(s.date) >= new Date(currentShift.startTime));
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);

    const updated = shifts.map(s => s.id === currentShift.id ? {
      ...s,
      endTime: new Date().toISOString(),
      endCash: parseFloat(endCash || 0),
      totalSales
    } : s);

    saveShifts(updated);
    setCurrentShift(null);
    setEndCash('');
  };

  const myShifts = shifts.filter(s => s.userId === user.id).slice(0, 10);

  return (
    <div className="shift">
      <header className="shift-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Növbə Nəzarəti</h1>
          </div>
        </div>
      </header>

      <div className="shift-content">
        <div className="shift-cards">
          <div className="card">
            <h3>{currentShift ? 'Aktiv Növbə' : 'Növbə Aç'}</h3>
            {!currentShift ? (
              <form onSubmit={openShift} className="shift-form">
                <label>Başlanğıc Kassa (AZN)</label>
                <input type="number" step="0.01" value={startCash} onChange={e => setStartCash(e.target.value)} />
                <button type="submit" className="primary">Növbəni Başlat</button>
              </form>
            ) : (
              <div className="active-shift">
                <div>Başlama: {new Date(currentShift.startTime).toLocaleString('az-AZ')}</div>
                <div>Başlanğıc Kassa: {currentShift.startCash?.toFixed?.(2) || currentShift.startCash} AZN</div>
                <form onSubmit={closeShift} className="shift-form">
                  <label>Bitmə Kassa (AZN)</label>
                  <input type="number" step="0.01" value={endCash} onChange={e => setEndCash(e.target.value)} />
                  <button type="submit" className="danger">Növbəni Bitir</button>
                </form>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Son Növbələr</h3>
            <div className="shift-list">
              {myShifts.map(s => (
                <div key={s.id} className="shift-item">
                  <div>
                    <div>{new Date(s.startTime).toLocaleString('az-AZ')} → {s.endTime ? new Date(s.endTime).toLocaleString('az-AZ') : '—'}</div>
                    <small>Satış: {s.totalSales?.toFixed?.(2) || s.totalSales} AZN</small>
                  </div>
                  <div className="cash-summary">
                    <span>Baş: {s.startCash}₼</span>
                    <span>Son: {s.endCash ?? '—'}₼</span>
                  </div>
                </div>
              ))}
              {myShifts.length === 0 && <div>Hələ heç bir növbə yoxdur.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftControl;

