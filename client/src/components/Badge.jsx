import React from 'react';

const Badge = ({ children, variant = 'primary' }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '9999px',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-50)',
      color: 'var(--primary-700)',
    },
    secondary: {
      backgroundColor: 'var(--gray-100)',
      color: 'var(--gray-700)',
    },
  };

  return (
    <span style={{ ...baseStyle, ...variants[variant] }}>
      {children}
    </span>
  );
};

export default Badge;