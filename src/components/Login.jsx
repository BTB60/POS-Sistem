import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin, isDarkMode, onToggleDarkMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'cashier'
  });

  useEffect(() => {
    // Initialize default admin user if not exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          isAdmin: true,
          role: 'admin',
          name: 'Administrator',
          email: 'admin@pos.com',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Initialize sample inventory if not exists
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    if (inventory.length === 0) {
      const sampleInventory = [
        {
          id: 1,
          name: 'Kola',
          category: 'İçkilər',
          price: 1.50,
          quantity: 100,
          description: 'Coca Cola 330ml',
          supplier: 'Coca Cola Company',
          minStock: 10,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Çörək',
          category: 'Çörək məmulatları',
          price: 0.80,
          quantity: 50,
          description: 'Ağ çörək 500q',
          supplier: 'Bakı Çörək Zavodu',
          minStock: 5,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Süd',
          category: 'Süd məmulatları',
          price: 2.20,
          quantity: 30,
          description: 'Tam yağlı süd 1L',
          supplier: 'Məhsul Dairy',
          minStock: 8,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: 4,
          name: 'Alma',
          category: 'Meyvə-tərəvəz',
          price: 3.50,
          quantity: 25,
          description: 'Qırmızı alma 1kq',
          supplier: 'Təbii Meyvə',
          minStock: 5,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      localStorage.setItem('inventory', JSON.stringify(sampleInventory));
    }

    // Initialize sample customers if not exists
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    if (customers.length === 0) {
      const sampleCustomers = [
        {
          id: 1,
          name: 'Əli Məmmədov',
          phone: '+994501234567',
          email: 'ali@email.com',
          address: 'Bakı şəhəri, Nərimanov rayonu',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Fatma Əliyeva',
          phone: '+994507654321',
          email: 'fatma@email.com',
          address: 'Bakı şəhəri, Yasamal rayonu',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Həsən Vəliyev',
          phone: '+994551234567',
          email: 'hasan@email.com',
          address: 'Bakı şəhəri, Binəqədi rayonu',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        showSuccess('Uğurla daxil oldunuz!');
        setTimeout(() => onLogin(user), 1000);
      } else {
        showError('İstifadəçi adı və ya şifrə səhvdir!');
      }
    } catch (error) {
      showError('Giriş zamanı xəta baş verdi!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (registerData.password !== registerData.confirmPassword) {
        showError('Şifrələr uyğun gəlmir!');
        return;
      }

      if (registerData.password.length < 6) {
        showError('Şifrə ən azı 6 simvol olmalıdır!');
        return;
      }

      if (users.some(u => u.username === registerData.username)) {
        showError('Bu istifadəçi adı artıq mövcuddur!');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: registerData.username,
        password: registerData.password,
        isAdmin: false,
        role: registerData.role,
        name: registerData.username,
        email: '',
        createdAt: new Date().toISOString(),
        sales: [],
        inventory: []
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      showSuccess('İstifadəçi uğurla qeydiyyatdan keçdi!');
      setTimeout(() => {
        setIsRegistering(false);
        setRegisterData({ username: '', password: '', confirmPassword: '', role: 'cashier' });
      }, 1500);
    } catch (error) {
      showError('Qeydiyyat zamanı xəta baş verdi!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <button onClick={onToggleDarkMode} className="theme-btn" title="Tema dəyişdir">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">🏪</div>
            <div className="logo-glow"></div>
          </div>
          <div style={{background: 'red', color: 'white', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>
            🚀 YENİ VERSİYA YÜKLƏNDİ! 🚀
          </div>
          <h1>POS Sistem - YENİ VERSİYA</h1>
          <h2>Kassa və Satış İdarəetməsi</h2>
          <p className="login-subtitle">
            {!isRegistering ? 'Hesabınıza daxil olun' : 'Yeni hesab yaradın'}
          </p>
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            {successMessage}
          </div>
        )}
        
        {!isRegistering ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="İstifadəçi adınızı daxil edin"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrənizi daxil edin"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Giriş edilir...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Giriş Et
                </>
              )}
            </button>
            <div className="form-divider">
              <span>və ya</span>
            </div>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsRegistering(true)}
              disabled={isLoading}
            >
              <span className="btn-icon">📝</span>
              Qeydiyyatdan Keç
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                  placeholder="İstifadəçi adı"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  placeholder="Şifrə (ən azı 6 simvol)"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">✅</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  placeholder="Şifrəni təsdiqlə"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🎭</span>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  disabled={isLoading}
                >
                  <option value="cashier">Kassir</option>
                  <option value="manager">Menecer</option>
                  <option value="inventory">Anbar</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Qeydiyyat edilir...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Qeydiyyatdan Keç
                </>
              )}
            </button>
            <div className="form-divider">
              <span>və ya</span>
            </div>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => setIsRegistering(false)}
              disabled={isLoading}
            >
              <span className="btn-icon">⬅️</span>
              Girişə Qayıt
            </button>
          </form>
        )}

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>🚀 Demo Giriş Məlumatları:</h4>
          <div className="demo-buttons">
            <button 
              className="demo-btn"
              onClick={() => handleQuickLogin('admin', 'admin123')}
              disabled={isLoading}
            >
              <span className="demo-icon">👑</span>
              Admin Giriş
            </button>
          </div>
          <div className="demo-info">
            <p><strong>İstifadəçi adı:</strong> admin</p>
            <p><strong>Şifrə:</strong> admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 