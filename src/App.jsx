import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import CashRegister from './components/CashRegister';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import EmployeeManagement from './components/EmployeeManagement';
import ShiftControl from './components/ShiftControl';
import InventoryCount from './components/InventoryCount';
import Finance from './components/Finance';
import Settings from './components/Settings';
import DataManager from './components/DataManager';
import { NotificationContainer, useNotifications } from './components/Notification';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { notifications, removeNotification, showSuccess, showError, showInfo } = useNotifications();

  useEffect(() => {
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      showSuccess('Qaranlıq rejim aktivləşdirildi');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      showSuccess('İşıqlı rejim aktivləşdirildi');
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentView(user.isAdmin ? 'dashboard' : 'cashier');
    showSuccess(`Xoş gəlmisiniz, ${user.name}!`);
  };

  const handleLogout = () => {
    showInfo('Çıxış edilir...');
    setTimeout(() => {
      setCurrentUser(null);
      setCurrentView('login');
      showSuccess('Uğurla çıxış edildi');
    }, 500);
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'dashboard':
        return <Dashboard user={currentUser} onLogout={handleLogout} onViewChange={setCurrentView} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'admin':
        return <AdminPanel user={currentUser} onLogout={handleLogout} onViewChange={setCurrentView} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'cashier':
        return <CashRegister user={currentUser} onLogout={handleLogout} onViewChange={setCurrentView} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'inventory':
        return <Inventory user={currentUser} onBack={() => setCurrentView(currentUser.isAdmin ? 'dashboard' : 'cashier')} isDarkMode={isDarkMode} />;
      case 'reports':
        return <Reports user={currentUser} onBack={() => setCurrentView(currentUser.isAdmin ? 'dashboard' : 'cashier')} isDarkMode={isDarkMode} />;
      case 'employees':
        return <EmployeeManagement user={currentUser} onBack={() => setCurrentView('dashboard')} isDarkMode={isDarkMode} />;
      case 'shift':
        return <ShiftControl user={currentUser} onBack={() => setCurrentView(currentUser.isAdmin ? 'dashboard' : 'cashier')} isDarkMode={isDarkMode} />;
      case 'inventory-count':
        return <InventoryCount user={currentUser} onBack={() => setCurrentView(currentUser.isAdmin ? 'dashboard' : 'cashier')} isDarkMode={isDarkMode} />;
      case 'finance':
        return <Finance user={currentUser} onBack={() => setCurrentView(currentUser.isAdmin ? 'dashboard' : 'cashier')} isDarkMode={isDarkMode} />;
      case 'settings':
        return <Settings user={currentUser} onBack={() => setCurrentView('dashboard')} isDarkMode={isDarkMode} />;
      case 'data-manager':
        return <DataManager user={currentUser} onBack={() => setCurrentView('dashboard')} isDarkMode={isDarkMode} />;
      default:
        return <Login onLogin={handleLogin} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
}

export default App;
