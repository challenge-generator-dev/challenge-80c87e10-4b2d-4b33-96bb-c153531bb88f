import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const sizeStyles = {
  small: {
    width: '24px',
    height: '24px',
    borderWidth: '3px',
  },
  medium: {
    width: '48px',
    height: '48px',
    borderWidth: '4px',
  },
  large: {
    width: '64px',
    height: '64px',
    borderWidth: '5px',
  },
};

const spinnerContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const spinnerStyles: React.CSSProperties = {
  borderRadius: '50%',
  borderStyle: 'solid',
  borderColor: '#3b82f6',
  borderTopColor: 'transparent',
  animation: 'spin 1s linear infinite',
};

const messageStyles: React.CSSProperties = {
  fontSize: '14px',
  color: '#6b7280',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textAlign: 'center',
};

const fullScreenStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  zIndex: 9999,
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullScreen = false,
}) => {
  const sizeConfig = sizeStyles[size];
  
  const containerStyle: React.CSSProperties = fullScreen
    ? { ...spinnerContainerStyles, ...fullScreenStyles }
    : spinnerContainerStyles;
  
  const spinnerStyle: React.CSSProperties = {
    ...spinnerStyles,
    width: sizeConfig.width,
    height: sizeConfig.height,
    borderWidth: sizeConfig.borderWidth,
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} role="status" aria-label="Cargando" />
      {message && <span style={messageStyles}>{message}</span>}
    </div>
  );
};

export default LoadingSpinner;