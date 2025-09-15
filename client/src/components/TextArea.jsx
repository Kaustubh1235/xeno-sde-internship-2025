import React from 'react';

const Textarea = ({ hint, className = '', ...props }) => {
  return (
    <div>
      <textarea
        className={`input textarea focus-ring ${className}`}
        {...props}
      />
      {hint && <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>{hint}</p>}
    </div>
  );
};

export default Textarea;