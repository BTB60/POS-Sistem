import React, { useState } from 'react';
import './DataManager.css';

const DataManager = ({ user, onBack }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [backupHistory, setBackupHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Load backup history from localStorage
  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('backupHistory') || '[]');
    setBackupHistory(history);
  }, []);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const data = {
        users: JSON.parse(localStorage.getItem('users') || '[]'),
        inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
        customers: JSON.parse(localStorage.getItem('customers') || '[]'),
        shifts: JSON.parse(localStorage.getItem('shifts') || '[]'),
        expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
        settings: JSON.parse(localStorage.getItem('settings') || '{}'),
        exportDate: new Date().toISOString(),
        exportedBy: user.name
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pos-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to backup history
      const backup = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'export',
        filename: a.download,
        size: blob.size,
        exportedBy: user.name
      };

      const updatedHistory = [backup, ...backupHistory];
      localStorage.setItem('backupHistory', JSON.stringify(updatedHistory));
      setBackupHistory(updatedHistory);

      alert('Məlumatlar uğurla ixrac edildi!');
    } catch (error) {
      alert('İxrac zamanı xəta baş verdi: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async () => {
    if (!selectedFile) {
      alert('Zəhmət olmasa fayl seçin!');
      return;
    }

    setIsImporting(true);
    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.users || !data.inventory || !data.customers) {
        throw new Error('Fayl düzgün formatda deyil!');
      }

      // Confirm import
      if (!confirm('Mövcud məlumatlar silinəcək. Davam etmək istəyirsiniz?')) {
        return;
      }

      // Import data
      localStorage.setItem('users', JSON.stringify(data.users));
      localStorage.setItem('inventory', JSON.stringify(data.inventory));
      localStorage.setItem('customers', JSON.stringify(data.customers));
      localStorage.setItem('shifts', JSON.stringify(data.shifts || []));
      localStorage.setItem('expenses', JSON.stringify(data.expenses || []));
      localStorage.setItem('settings', JSON.stringify(data.settings || {}));

      // Save to backup history
      const backup = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'import',
        filename: selectedFile.name,
        size: selectedFile.size,
        importedBy: user.name
      };

      const updatedHistory = [backup, ...backupHistory];
      localStorage.setItem('backupHistory', JSON.stringify(updatedHistory));
      setBackupHistory(updatedHistory);

      setSelectedFile(null);
      alert('Məlumatlar uğurla idxal edildi! Səhifə yenilənəcək...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      alert('İdxal zamanı xəta baş verdi: ' + error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const createBackup = async () => {
    try {
      const data = {
        users: JSON.parse(localStorage.getItem('users') || '[]'),
        inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
        customers: JSON.parse(localStorage.getItem('customers') || '[]'),
        shifts: JSON.parse(localStorage.getItem('shifts') || '[]'),
        expenses: JSON.parse(localStorage.getItem('expenses') || '[]'),
        settings: JSON.parse(localStorage.getItem('settings') || '{}'),
        backupDate: new Date().toISOString(),
        createdBy: user.name
      };

      // Save backup to localStorage (limited to last 10 backups)
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      const backup = {
        id: Date.now(),
        date: new Date().toISOString(),
        data: data,
        createdBy: user.name
      };

      const updatedBackups = [backup, ...backups].slice(0, 10);
      localStorage.setItem('backups', JSON.stringify(updatedBackups));

      // Save to backup history
      const historyEntry = {
        id: backup.id,
        date: backup.date,
        type: 'backup',
        filename: `backup-${new Date().toISOString().split('T')[0]}.json`,
        size: JSON.stringify(data).length,
        createdBy: user.name
      };

      const updatedHistory = [historyEntry, ...backupHistory];
      localStorage.setItem('backupHistory', JSON.stringify(updatedHistory));
      setBackupHistory(updatedHistory);

      alert('Backup uğurla yaradıldı!');
    } catch (error) {
      alert('Backup yaradılarkən xəta baş verdi: ' + error.message);
    }
  };

  const restoreBackup = (backupId) => {
    try {
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        alert('Backup tapılmadı!');
        return;
      }

      if (!confirm('Mövcud məlumatlar silinəcək. Davam etmək istəyirsiniz?')) {
        return;
      }

      const data = backup.data;
      localStorage.setItem('users', JSON.stringify(data.users));
      localStorage.setItem('inventory', JSON.stringify(data.inventory));
      localStorage.setItem('customers', JSON.stringify(data.customers));
      localStorage.setItem('shifts', JSON.stringify(data.shifts || []));
      localStorage.setItem('expenses', JSON.stringify(data.expenses || []));
      localStorage.setItem('settings', JSON.stringify(data.settings || {}));

      alert('Backup uğurla bərpa edildi! Səhifə yenilənəcək...');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      alert('Bərpa zamanı xəta baş verdi: ' + error.message);
    }
  };

  const deleteBackup = (backupId) => {
    if (!confirm('Bu backup-ı silmək istəyirsiniz?')) return;

    try {
      const backups = JSON.parse(localStorage.getItem('backups') || '[]');
      const updatedBackups = backups.filter(b => b.id !== backupId);
      localStorage.setItem('backups', JSON.stringify(updatedBackups));

      const updatedHistory = backupHistory.filter(h => h.id !== backupId);
      localStorage.setItem('backupHistory', JSON.stringify(updatedHistory));
      setBackupHistory(updatedHistory);

      alert('Backup silindi!');
    } catch (error) {
      alert('Backup silinərkən xəta baş verdi: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('az-AZ');
  };

  return (
    <div className="data-manager">
      <header className="data-manager-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={onBack} className="back-btn">← Geri</button>
            <h1>💾 Məlumat İdarəetməsi</h1>
          </div>
        </div>
      </header>

      <div className="data-manager-content">
        <div className="data-manager-grid">
          {/* Export/Import Section */}
          <div className="data-section">
            <div className="section-header">
              <h3>📤 İxrac və İdxal</h3>
              <p>Məlumatları fayl kimi ixrac edin və ya idxal edin</p>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={exportData} 
                disabled={isExporting}
                className="action-btn primary"
              >
                {isExporting ? '⏳ İxrac edilir...' : '📤 Məlumatları İxrac Et'}
              </button>
              
              <div className="import-section">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  id="import-file"
                  style={{ display: 'none' }}
                />
                <label htmlFor="import-file" className="file-input-label">
                  📁 Fayl Seç
                </label>
                {selectedFile && (
                  <span className="selected-file">{selectedFile.name}</span>
                )}
                <button 
                  onClick={importData}
                  disabled={!selectedFile || isImporting}
                  className="action-btn success"
                >
                  {isImporting ? '⏳ İdxal edilir...' : '📥 İdxal Et'}
                </button>
              </div>
            </div>
          </div>

          {/* Backup Section */}
          <div className="data-section">
            <div className="section-header">
              <h3>💿 Backup və Bərpa</h3>
              <p>Avtomatik backup yaradın və bərpa edin</p>
            </div>
            
            <div className="action-buttons">
              <button 
                onClick={createBackup}
                className="action-btn warning"
              >
                💾 Backup Yarat
              </button>
            </div>

            <div className="backup-list">
              <h4>Mövcud Backup-lar</h4>
              {(() => {
                const backups = JSON.parse(localStorage.getItem('backups') || '[]');
                return backups.length > 0 ? (
                  backups.map(backup => (
                    <div key={backup.id} className="backup-item">
                      <div className="backup-info">
                        <span className="backup-date">{formatDate(backup.date)}</span>
                        <span className="backup-creator">{backup.createdBy}</span>
                      </div>
                      <div className="backup-actions">
                        <button 
                          onClick={() => restoreBackup(backup.id)}
                          className="restore-btn"
                        >
                          🔄 Bərpa Et
                        </button>
                        <button 
                          onClick={() => deleteBackup(backup.id)}
                          className="delete-btn"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-message">Hələ backup yoxdur</p>
                );
              })()}
            </div>
          </div>

          {/* History Section */}
          <div className="data-section full-width">
            <div className="section-header">
              <h3>📋 Əməliyyat Tarixçəsi</h3>
              <p>Bütün ixrac, idxal və backup əməliyyatları</p>
            </div>
            
            <div className="history-list">
              {backupHistory.length > 0 ? (
                backupHistory.map(entry => (
                  <div key={entry.id} className="history-item">
                    <div className="history-icon">
                      {entry.type === 'export' && '📤'}
                      {entry.type === 'import' && '📥'}
                      {entry.type === 'backup' && '💾'}
                    </div>
                    <div className="history-info">
                      <span className="history-type">
                        {entry.type === 'export' && 'İxrac'}
                        {entry.type === 'import' && 'İdxal'}
                        {entry.type === 'backup' && 'Backup'}
                      </span>
                      <span className="history-filename">{entry.filename}</span>
                      <span className="history-size">{formatFileSize(entry.size)}</span>
                    </div>
                    <div className="history-meta">
                      <span className="history-user">{entry.exportedBy || entry.importedBy || entry.createdBy}</span>
                      <span className="history-date">{formatDate(entry.date)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">Hələ əməliyyat yoxdur</p>
              )}
            </div>
          </div>

          {/* System Info */}
          <div className="data-section">
            <div className="section-header">
              <h3>ℹ️ Sistem Məlumatları</h3>
              <p>Mövcud məlumatlar haqqında məlumat</p>
            </div>
            
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">İstifadəçilər:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('users') || '[]').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Məhsullar:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('inventory') || '[]').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Müştərilər:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('customers') || '[]').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Növbələr:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('shifts') || '[]').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Xərclər:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('expenses') || '[]').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;

