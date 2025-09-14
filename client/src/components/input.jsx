import React from 'react';

const Input = ({ className = '', ...props }) => {
  const style = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-300)',
    backgroundColor: 'white',
  };

  return (
    <input
      style={style}
      className={`focus-ring ${className}`}
      {...props}
    />
  );
};

export default Input;