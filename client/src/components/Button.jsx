import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles = {
    padding: '0.5rem 1rem',
    fontWeight: '600',
    borderRadius: 'var(--radius-lg)',
    transition: 'background-color 0.2s, color 0.2s',
    cursor: 'pointer',
    border: 'none',
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--primary-600)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--gray-200)',
      color: 'var(--gray-800)',
    },
  };

  const disabledStyles = {
    opacity: '0.5',
    cursor: 'not-allowed',
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(disabled && disabledStyles),
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`focus-ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;