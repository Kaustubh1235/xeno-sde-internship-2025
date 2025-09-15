import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`input focus-ring ${className}`}
      {...props}
    />
  );
};

export default Input;