import React, { useEffect, useState } from 'react';
import './Finance.css';

const Finance = ({ user, onBack }) => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'general' });

  useEffect(() => {
    setExpenses(JSON.parse(localStorage.getItem('expenses') || '[]'));
    setUsers(JSON.parse(localStorage.getItem('users') || '[]'));
  }, []);

  const totalSales = users.reduce((sum, u) => sum + (u.sales || []).reduce((s, sale) => s + sale.total, 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;

  const addExpense = (e) => {
    e.preventDefault();
    const expense = { id: Date.now(), title: newExpense.title, amount: parseFloat(newExpense.amount), category: newExpense.category, date: new Date().toISOString(), userId: user.id, userName: user.name };
    const updated = [expense, ...expenses];
    localStorage.setItem('expenses', JSON.stringify(updated));
    setExpenses(updated);
    setNewExpense({ title: '', amount: '', category: 'general' });
  };

  return (
    <div className="finance">
      <header className="finance-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>Maliyyə İdarəetməsi</h1>
          </div>
        </div>
      </header>

      <div className="finance-content">
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Ümumi Satış</h3>
            <p>{totalSales.toFixed(2)} AZN</p>
          </div>
          <div className="summary-card">
            <h3>Ümumi Xərc</h3>
            <p>{totalExpenses.toFixed(2)} AZN</p>
          </div>
          <div className={`summary-card ${netProfit >= 0 ? 'profit' : 'loss'}`}>
            <h3>Xalis Mənfəət</h3>
            <p>{netProfit.toFixed(2)} AZN</p>
          </div>
        </div>

        <div className="cards-grid">
          <div className="card">
            <h3>Xərc Əlavə Et</h3>
            <form onSubmit={addExpense} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Başlıq</label>
                  <input value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Məbləğ</label>
                  <input type="number" step="0.01" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Kateqoriya</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                  <option value="general">Ümumi</option>
                  <option value="rent">İcarə</option>
                  <option value="salary">Maaş</option>
                  <option value="utilities">Kommunal</option>
                  <option value="other">Digər</option>
                </select>
              </div>
              <button className="primary" type="submit">Əlavə Et</button>
            </form>
          </div>

          <div className="card">
            <h3>Son Xərclər</h3>
            <div className="list">
              {expenses.slice(0, 20).map(e => (
                <div key={e.id} className="list-item">
                  <div>
                    <strong>{e.title}</strong>
                    <div className="muted">{new Date(e.date).toLocaleString('az-AZ')} — {e.userName}</div>
                  </div>
                  <div className="amount">{e.amount.toFixed(2)} AZN</div>
                </div>
              ))}
              {expenses.length === 0 && <div>Hələ heç bir xərc yoxdur.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;

