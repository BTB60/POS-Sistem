import React, { useEffect, useState } from 'react';
import './EmployeeManagement.css';

const defaultRoles = [
  { value: 'cashier', label: 'Kassir' },
  { value: 'manager', label: 'Menecer' },
  { value: 'inventory', label: 'Anbar' },
];

const EmployeeManagement = ({ user, onBack }) => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    password: '',
    name: '',
    role: 'cashier',
    isAdmin: false,
  });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(stored);
  }, []);

  const saveUsers = (updated) => {
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const exists = users.some(u => u.username === newEmployee.username);
    if (exists) {
      alert('Bu istifadəçi adı artıq mövcuddur!');
      return;
    }
    const employee = {
      id: Date.now(),
      username: newEmployee.username,
      password: newEmployee.password,
      name: newEmployee.name || newEmployee.username,
      role: newEmployee.role,
      isAdmin: newEmployee.isAdmin,
      createdAt: new Date().toISOString(),
      sales: [],
    };
    saveUsers([...users, employee]);
    setShowAddForm(false);
    setNewEmployee({ username: '', password: '', name: '', role: 'cashier', isAdmin: false });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = users.map(u => u.id === editingUser.id ? editingUser : u);
    saveUsers(updated);
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('İstifadəçini silmək istəyirsiniz?')) return;
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
  };

  return (
    <div className="employees">
      <header className="employees-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>İşçi Rolları və Nəzarət</h1>
          </div>
          <div className="header-right">
            <button onClick={() => setShowAddForm(true)} className="add-btn">+ İşçi Əlavə Et</button>
          </div>
        </div>
      </header>

      <div className="employees-content">
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Ad</th>
                <th>İstifadəçi Adı</th>
                <th>Rol</th>
                <th>Admin</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.id !== 1).map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{defaultRoles.find(r => r.value === u.role)?.label || u.role}</td>
                  <td>{u.isAdmin ? 'Bəli' : 'Xeyr'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => setEditingUser({...u})}>Düzənlə</button>
                      <button className="delete-btn" onClick={() => handleDelete(u.id)}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Yeni İşçi</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>İstifadəçi Adı</label>
                  <input value={newEmployee.username} onChange={e => setNewEmployee({...newEmployee, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Şifrə</label>
                  <input type="password" value={newEmployee.password} onChange={e => setNewEmployee({...newEmployee, password: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ad Soyad</label>
                  <input value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select value={newEmployee.role} onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}>
                    {defaultRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input type="checkbox" checked={newEmployee.isAdmin} onChange={e => setNewEmployee({...newEmployee, isAdmin: e.target.checked})} />
                  Admin hüquqları
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Əlavə Et</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Ləğv Et</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>İşçini Düzənlə</h2>
              <button className="close-btn" onClick={() => setEditingUser(null)}>✕</button>
            </div>
            <form onSubmit={handleUpdate} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad Soyad</label>
                  <input value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})}>
                    {defaultRoles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input type="checkbox" checked={editingUser.isAdmin} onChange={e => setEditingUser({...editingUser, isAdmin: e.target.checked})} />
                  Admin hüquqları
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Yadda Saxla</button>
                <button type="button" className="cancel-btn" onClick={() => setEditingUser(null)}>Ləğv Et</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;

