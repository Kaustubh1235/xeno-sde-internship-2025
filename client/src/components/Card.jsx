import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-md ${className}`}
      style={{
        borderColor: 'var(--gray-200)',
        boxShadow: 'var(--shadow-md)',
        borderRadius: 'var(--radius-xl)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;