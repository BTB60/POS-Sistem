import React, { useState, useEffect } from 'react';
import './EmployeeManagement.css';

const EmployeeManagement = ({ user, onBack, isDarkMode }) => {
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: 0,
    hireDate: '',
    status: 'active',
    role: 'employee'
  });

  const [newShift, setNewShift] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'regular' // regular, overtime, holiday
  });

  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    type: 'vacation', // vacation, sick, personal, other
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending' // pending, approved, rejected
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    const storedShifts = JSON.parse(localStorage.getItem('shifts')) || [];
    const storedLeaves = JSON.parse(localStorage.getItem('leaves')) || [];
    
    setEmployees(storedEmployees);
    setShifts(storedShifts);
    setLeaves(storedLeaves);
  };

  const addEmployee = () => {
    const employee = {
      id: Date.now(),
      ...newEmployee,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      sales: [],
      totalSales: 0,
      performance: {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        customerSatisfaction: 0
      }
    };

    const updatedEmployees = [...employees, employee];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    setShowAddModal(false);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
      hireDate: '',
      status: 'active',
      role: 'employee'
    });
  };

  const addShift = () => {
    const shift = {
      id: Date.now(),
      ...newShift,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    const updatedShifts = [...shifts, shift];
    setShifts(updatedShifts);
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    
    setShowShiftModal(false);
    setNewShift({
      employeeId: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'regular'
    });
  };

  const addLeave = () => {
    const leave = {
      id: Date.now(),
      ...newLeave,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    const updatedLeaves = [...leaves, leave];
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
    
    setShowLeaveModal(false);
    setNewLeave({
      employeeId: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending'
    });
  };

  const updateEmployeeStatus = (employeeId, status) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === employeeId ? { ...emp, status } : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const updateLeaveStatus = (leaveId, status) => {
    const updatedLeaves = leaves.map(leave => 
      leave.id === leaveId ? { ...leave, status } : leave
    );
    setLeaves(updatedLeaves);
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
  };

  const calculateSalary = (employee) => {
    const baseSalary = employee.salary;
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const employeeSales = sales.filter(sale => sale.userId === employee.id);
    const totalRevenue = employeeSales.reduce((sum, sale) => sum + sale.total, 0);
    const commission = totalRevenue * 0.05; // 5% commission
    return baseSalary + commission;
  };

  const getFilteredEmployees = () => {
    let filtered = employees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp => emp.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'position':
          return a.position.localeCompare(b.position);
        case 'salary':
          return calculateSalary(b) - calculateSalary(a);
        case 'hireDate':
          return new Date(b.hireDate) - new Date(a.hireDate);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getEmployeeStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const totalSalary = employees.reduce((sum, emp) => sum + calculateSalary(emp), 0);
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    return {
      totalEmployees,
      activeEmployees,
      totalSalary: totalSalary.toFixed(2),
      avgSalary: avgSalary.toFixed(2)
    };
  };

  const getTodayShifts = () => {
    const today = new Date().toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === today);
  };

  const getPendingLeaves = () => {
    return leaves.filter(leave => leave.status === 'pending');
  };

  const stats = getEmployeeStats();

  return (
    <div className={`employee-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="employee-header">
        <button onClick={onBack} className="back-btn">← Geri</button>
        <h1>👥 İşçi İdarəetməsi</h1>
        <div className="header-actions">
          <button onClick={() => setShowAddModal(true)} className="action-btn">
            👤 İşçi Əlavə Et
          </button>
          <button onClick={() => setShowShiftModal(true)} className="action-btn">
            ⏰ Növbə Planla
          </button>
          <button onClick={() => setShowLeaveModal(true)} className="action-btn">
            📅 İcazə Əlavə Et
          </button>
        </div>
      </header>

      <div className="employee-content">
        {/* Employee Statistics */}
        <div className="stats-section">
          <h2>📊 İşçi Statistikası</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Ümumi İşçi</h3>
                <p>{stats.totalEmployees}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Aktiv İşçi</h3>
                <p>{stats.activeEmployees}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Ümumi Maaş</h3>
                <p>{stats.totalSalary} AZN</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Orta Maaş</h3>
                <p>{stats.avgSalary} AZN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-controls">
            <input
              type="text"
              placeholder="İşçi axtar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Bütün Statuslar</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Qeyri-aktiv</option>
              <option value="on_leave">İcazədə</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Ad ilə</option>
              <option value="position">Vəzifə ilə</option>
              <option value="salary">Maaş ilə</option>
              <option value="hireDate">İşə giriş tarixi ilə</option>
            </select>
          </div>
        </div>

        {/* Employee List */}
        <div className="employee-list-section">
          <h2>👥 İşçi Siyahısı</h2>
          <div className="employee-list">
            {getFilteredEmployees().map(employee => (
              <div key={employee.id} className="employee-card">
                <div className="employee-info">
                  <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="employee-details">
                    <h3>{employee.name}</h3>
                    <p className="position">{employee.position}</p>
                    <p className="department">{employee.department}</p>
                    <p className="email">{employee.email}</p>
                  </div>
                </div>
                <div className="employee-stats">
                  <div className="stat">
                    <span className="label">Maaş:</span>
                    <span className="value">{calculateSalary(employee).toFixed(2)} AZN</span>
                  </div>
                  <div className="stat">
                    <span className="label">İşə giriş:</span>
                    <span className="value">{new Date(employee.hireDate).toLocaleDateString('az-AZ')}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Status:</span>
                    <span className={`status ${employee.status}`}>{employee.status}</span>
                  </div>
                </div>
                <div className="employee-actions">
                  <select
                    value={employee.status}
                    onChange={(e) => updateEmployeeStatus(employee.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Qeyri-aktiv</option>
                    <option value="on_leave">İcazədə</option>
                  </select>
                  <button className="edit-btn">✏️</button>
                  <button className="delete-btn">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Shifts */}
        <div className="shifts-section">
          <h2>⏰ Bu Günkü Növbələr</h2>
          <div className="shifts-list">
            {getTodayShifts().map(shift => {
              const employee = employees.find(emp => emp.id === shift.employeeId);
              return (
                <div key={shift.id} className="shift-item">
                  <div className="shift-info">
                    <span className="employee-name">{employee?.name || 'Naməlum'}</span>
                    <span className="shift-time">{shift.startTime} - {shift.endTime}</span>
                  </div>
                  <span className={`shift-type ${shift.type}`}>{shift.type}</span>
                </div>
              );
            })}
            {getTodayShifts().length === 0 && (
              <p className="no-data">Bu gün növbə planlanmayıb</p>
            )}
          </div>
        </div>

        {/* Pending Leaves */}
        <div className="leaves-section">
          <h2>📅 Gözləyən İcazələr</h2>
          <div className="leaves-list">
            {getPendingLeaves().map(leave => {
              const employee = employees.find(emp => emp.id === leave.employeeId);
              return (
                <div key={leave.id} className="leave-item">
                  <div className="leave-info">
                    <span className="employee-name">{employee?.name || 'Naməlum'}</span>
                    <span className="leave-dates">
                      {new Date(leave.startDate).toLocaleDateString('az-AZ')} - 
                      {new Date(leave.endDate).toLocaleDateString('az-AZ')}
                    </span>
                    <span className="leave-reason">{leave.reason}</span>
                  </div>
                  <div className="leave-actions">
                    <button 
                      onClick={() => updateLeaveStatus(leave.id, 'approved')}
                      className="approve-btn"
                    >
                      ✅ Təsdiq Et
                    </button>
                    <button 
                      onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                      className="reject-btn"
                    >
                      ❌ Rədd Et
                    </button>
                  </div>
                </div>
              );
            })}
            {getPendingLeaves().length === 0 && (
              <p className="no-data">Gözləyən icazə yoxdur</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>👤 Yeni İşçi Əlavə Et</h3>
            <div className="form-group">
              <label>Ad Soyad:</label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                placeholder="İşçinin adı və soyadı..."
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>
            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="tel"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                placeholder="+994501234567"
              />
            </div>
            <div className="form-group">
              <label>Vəzifə:</label>
              <input
                type="text"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                placeholder="Kassir, Menecer, və s."
              />
            </div>
            <div className="form-group">
              <label>Şöbə:</label>
              <input
                type="text"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                placeholder="Satış, Anbar, və s."
              />
            </div>
            <div className="form-group">
              <label>Əsas Maaş (AZN):</label>
              <input
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>İşə Giriş Tarixi:</label>
              <input
                type="date"
                value={newEmployee.hireDate}
                onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={addEmployee} className="confirm-btn">Əlavə Et</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shift Modal */}
      {showShiftModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⏰ Növbə Planla</h3>
            <div className="form-group">
              <label>İşçi:</label>
              <select
                value={newShift.employeeId}
                onChange={(e) => setNewShift({...newShift, employeeId: e.target.value})}
              >
                <option value="">İşçi seçin...</option>
                {employees.filter(emp => emp.status === 'active').map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tarix:</label>
              <input
                type="date"
                value={newShift.date}
                onChange={(e) => setNewShift({...newShift, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Başlama Vaxtı:</label>
              <input
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bitmə Vaxtı:</label>
              <input
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Növbə Növü:</label>
              <select
                value={newShift.type}
                onChange={(e) => setNewShift({...newShift, type: e.target.value})}
              >
                <option value="regular">Adi növbə</option>
                <option value="overtime">Əlavə iş</option>
                <option value="holiday">Bayram növbəsi</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowShiftModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={addShift} className="confirm-btn">Planla</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Leave Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📅 İcazə Əlavə Et</h3>
            <div className="form-group">
              <label>İşçi:</label>
              <select
                value={newLeave.employeeId}
                onChange={(e) => setNewLeave({...newLeave, employeeId: e.target.value})}
              >
                <option value="">İşçi seçin...</option>
                {employees.filter(emp => emp.status === 'active').map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>İcazə Növü:</label>
              <select
                value={newLeave.type}
                onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
              >
                <option value="vacation">Məzuniyyət</option>
                <option value="sick">Xəstəlik</option>
                <option value="personal">Şəxsi</option>
                <option value="other">Digər</option>
              </select>
            </div>
            <div className="form-group">
              <label>Başlama Tarixi:</label>
              <input
                type="date"
                value={newLeave.startDate}
                onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Bitmə Tarixi:</label>
              <input
                type="date"
                value={newLeave.endDate}
                onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Səbəb:</label>
              <textarea
                value={newLeave.reason}
                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                placeholder="İcazə səbəbini yazın..."
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowLeaveModal(false)} className="cancel-btn">Ləğv Et</button>
              <button onClick={addLeave} className="confirm-btn">Əlavə Et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;

