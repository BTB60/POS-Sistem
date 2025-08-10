import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import './BarcodeScanner.css';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [manualCode, setManualCode] = useState('');
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScanning]);

  const startScanner = () => {
    if (html5QrcodeScannerRef.current) return;

    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        supportedScanTypes: [
          Html5QrcodeScanType.SCAN_TYPE_CAMERA,
          Html5QrcodeScanType.SCAN_TYPE_FILE
        ]
      },
      false
    );

    html5QrcodeScannerRef.current.render(onScanSuccess, onScanFailure);
  };

  const stopScanner = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
      html5QrcodeScannerRef.current = null;
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    const newCode = {
      code: decodedText,
      type: decodedResult.result.format.formatName,
      timestamp: new Date().toLocaleString('az-AZ'),
      id: Date.now()
    };

    setScannedCodes(prev => [newCode, ...prev]);
    
    if (onScan) {
      onScan(newCode);
    }

    playBeepSound();
  };

  const onScanFailure = (error) => {
    console.log('Scan failed:', error);
  };

  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      const newCode = {
        code: manualCode.trim(),
        type: 'Manual Entry',
        timestamp: new Date().toLocaleString('az-AZ'),
        id: Date.now()
      };

      setScannedCodes(prev => [newCode, ...prev]);
      
      if (onScan) {
        onScan(newCode);
      }

      setManualCode('');
      playBeepSound();
    }
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showNotification('Kopyalandı!');
    } catch (error) {
      console.log('Clipboard not supported:', error);
    }
  };

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  };

  const clearHistory = () => {
    setScannedCodes([]);
  };

  return (
    <div className="barcode-scanner-overlay">
      <div className="barcode-scanner-modal">
        <div className="scanner-header">
          <h2>📱 Barkod Scanner</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="scanner-controls">
          <button 
            className={`scan-btn ${isScanning ? 'scanning' : ''}`}
            onClick={() => setIsScanning(!isScanning)}
          >
            {isScanning ? '🛑 Scanner Dayandır' : '📷 Scanner Başlat'}
          </button>
          
          <button className="clear-btn" onClick={clearHistory}>
            🗑️ Tarixçəni Təmizlə
          </button>
        </div>

        <div className="scanner-container">
          {isScanning ? (
            <div className="scanner-view">
              <div id="reader" ref={scannerRef}></div>
              <div className="scanner-overlay-text">
                Barkodu kameraya tutun
              </div>
            </div>
          ) : (
            <div className="scanner-placeholder">
              <div className="placeholder-icon">📷</div>
              <p>Scanner başlatmaq üçün düyməyə basın</p>
            </div>
          )}
        </div>

        <div className="manual-entry">
          <h3>✏️ Manual Daxil Etmə</h3>
          <form onSubmit={handleManualSubmit} className="manual-form">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Barkod kodunu daxil edin..."
              className="manual-input"
            />
            <button type="submit" className="manual-submit">
              ➕ Əlavə Et
            </button>
          </form>
        </div>

        <div className="scan-history">
          <h3>📋 Tarixçə ({scannedCodes.length})</h3>
          <div className="history-list">
            {scannedCodes.length === 0 ? (
              <div className="empty-history">
                <p>Hələ heç bir barkod skan edilməyib</p>
              </div>
            ) : (
              scannedCodes.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-content">
                    <div className="code-info">
                      <span className="code-text">{item.code}</span>
                      <span className="code-type">{item.type}</span>
                    </div>
                    <div className="code-time">{item.timestamp}</div>
                  </div>
                  <div className="history-actions">
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(item.code)}
                      title="Kopyala"
                    >
                      📋
                    </button>
                    <button 
                      className="use-btn"
                      onClick={() => onScan && onScan(item)}
                      title="İstifadə Et"
                    >
                      ✅
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
