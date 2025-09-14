import React from 'react';

const Textarea = ({ hint, className = '', ...props }) => {
  const style = {
    width: '100%',
    minHeight: '100px',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--gray-300)',
    backgroundColor: 'white',
    resize: 'vertical',
  };

  return (
    <div>
      <textarea
        style={style}
        className={`focus-ring ${className}`}
        {...props}
      />
      {hint && <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>{hint}</p>}
    </div>
  );
};

export default Textarea;