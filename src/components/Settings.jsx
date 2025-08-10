import React, { useEffect, useState } from 'react';
import './Settings.css';

const Settings = ({ user, onBack }) => {
  const [settings, setSettings] = useState({ storeName: 'POS Sistem', currency: 'AZN', taxRate: 0 });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('settings') || 'null');
    if (stored) setSettings(stored);
  }, []);

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Tənzimləmələr yadda saxlandı.');
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Sistem Tənzimləmələri</h1>
          </div>
        </div>
      </header>

      <div className="settings-content">
        <form onSubmit={save} className="settings-form">
          <div className="form-group">
            <label>Mağaza Adı</label>
            <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Valyuta</label>
            <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})}>
              <option value="AZN">AZN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="form-group">
            <label>ƏDV (%)</label>
            <input type="number" step="0.01" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})} />
          </div>
          <button className="primary" type="submit">Yadda Saxla</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;




