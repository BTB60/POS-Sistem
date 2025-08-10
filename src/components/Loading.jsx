import React from 'react';
import './Loading.css';

const Loading = ({ 
  type = 'spinner', 
  size = 'medium', 
  color = 'primary', 
  text = 'Yüklənir...',
  fullScreen = false 
}) => {
  const renderSpinner = () => (
    <div className={`loading-spinner loading-${size} loading-${color}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
  );

  const renderDots = () => (
    <div className={`loading-dots loading-${size} loading-${color}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`loading-pulse loading-${size} loading-${color}`}>
      <div className="pulse-circle"></div>
    </div>
  );

  const renderBar = () => (
    <div className={`loading-bar loading-${size} loading-${color}`}>
      <div className="bar-fill"></div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bar':
        return renderBar();
      default:
        return renderSpinner();
    }
  };

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          {renderContent()}
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container">
      {renderContent()}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

// Loading overlay for components
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  type = 'spinner',
  size = 'medium',
  color = 'primary',
  text = 'Yüklənir...'
}) => {
  if (!isLoading) return children;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay-content">
        <Loading type={type} size={size} color={color} text={text} />
      </div>
      <div className="loading-overlay-backdrop">
        {children}
      </div>
    </div>
  );
};

// Skeleton loading for content
export const Skeleton = ({ 
  type = 'text', 
  lines = 1, 
  width = '100%',
  height = '1rem',
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`skeleton skeleton-text ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div 
                key={index} 
                className="skeleton-line"
                style={{ 
                  width: index === lines - 1 ? '80%' : '100%',
                  height: height
                }}
              ></div>
            ))}
          </div>
        );
      case 'avatar':
        return (
          <div 
            className={`skeleton skeleton-avatar ${className}`}
            style={{ width: width, height: height }}
          ></div>
        );
      case 'card':
        return (
          <div className={`skeleton skeleton-card ${className}`}>
            <div className="skeleton-avatar" style={{ width: '60px', height: '60px' }}></div>
            <div className="skeleton-content">
              <div className="skeleton-line" style={{ width: '70%', height: '1rem' }}></div>
              <div className="skeleton-line" style={{ width: '50%', height: '0.8rem' }}></div>
            </div>
          </div>
        );
      case 'table':
        return (
          <div className={`skeleton skeleton-table ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <div key={index} className="skeleton-row">
                <div className="skeleton-cell" style={{ width: '30%' }}></div>
                <div className="skeleton-cell" style={{ width: '40%' }}></div>
                <div className="skeleton-cell" style={{ width: '20%' }}></div>
                <div className="skeleton-cell" style={{ width: '10%' }}></div>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div 
            className={`skeleton skeleton-default ${className}`}
            style={{ width: width, height: height }}
          ></div>
        );
    }
  };

  return renderSkeleton();
};

export default Loading;

