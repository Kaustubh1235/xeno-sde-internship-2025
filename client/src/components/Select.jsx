import React from 'react';

const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`input select focus-ring ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;