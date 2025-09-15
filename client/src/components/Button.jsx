import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary', 
    ghost: 'btn btn-ghost',
    danger: 'btn btn-danger',
  };

  const buttonClass = `${variantClasses[variant] || variantClasses.primary} focus-ring ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;