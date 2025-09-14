import React from 'react';

const Select = ({ children, className = '', ...props }) => {
  const style = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-300)',
    backgroundColor: 'white',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  };

  return (
    <select
      style={style}
      className={`focus-ring ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;