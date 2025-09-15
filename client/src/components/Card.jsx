import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`card animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;