import React from 'react';
import { X, DollarSign, Eye, Clock } from 'lucide-react';

const Rule = ({ rule, onRuleChange, onRemoveRule }) => {
  const handleFieldChange = (e) => {
    onRuleChange(rule.id, 'field', e.target.value);
  };

  const handleOperatorChange = (e) => {
    onRuleChange(rule.id, 'operator', e.target.value);
  };

  const handleValueChange = (e) => {
    onRuleChange(rule.id, 'value', e.target.value);
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'totalSpends': return <DollarSign className="w-4 h-4" />;
      case 'visitCount': return <Eye className="w-4 h-4" />;
      case 'lastVisit': return <Clock className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getFieldColor = (field) => {
    switch (field) {
      case 'totalSpends': return 'var(--success-500)';
      case 'visitCount': return 'var(--primary-500)';
      case 'lastVisit': return 'var(--warning-500)';
      default: return 'var(--success-500)';
    }
  };

  return (
    <div 
      className="card p-6"
      style={{ 
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-secondary)',
        marginBottom: 'var(--space-4)'
      }}
    >
      <div className="flex items-center gap-4 rule-mobile">
        {/* Field Icon */}
        <div 
          style={{
            width: '40px',
            height: '40px',
            background: getFieldColor(rule.field),
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {getFieldIcon(rule.field)}
        </div>

        {/* Rule Configuration */}
        <div className="flex-1">
          <div className="grid grid-3 gap-4 rule-grid-mobile">
            {/* Field Selection */}
            <div>
              <label className="text-muted text-xs font-medium uppercase tracking-wide mb-2 block">
                Field
              </label>
              <select 
                value={rule.field} 
                onChange={handleFieldChange}
                className="input select focus-ring"
                style={{ width: '100%' }}
              >
                <option value="totalSpends">Total Spends</option>
                <option value="visitCount">Visit Count</option>
                <option value="lastVisit">Last Visit (days ago)</option>
              </select>
            </div>

            {/* Operator Selection */}
            <div>
              <label className="text-muted text-xs font-medium uppercase tracking-wide mb-2 block">
                Condition
              </label>
              <select 
                value={rule.operator} 
                onChange={handleOperatorChange}
                className="input select focus-ring"
                style={{ width: '100%' }}
              >
                <option value=">">Greater Than (&gt;)</option>
                <option value="<">Less Than (&lt;)</option>
                <option value="=">Equal To (=)</option>
                <option value=">=">Greater Than or Equal (&gt;=)</option>
                <option value="<=">Less Than or Equal (&lt;=)</option>
              </select>
            </div>

            {/* Value Input */}
            <div>
              <label className="text-muted text-xs font-medium uppercase tracking-wide mb-2 block">
                Value
              </label>
              <input
                type="number"
                value={rule.value}
                onChange={handleValueChange}
                placeholder="Enter value"
                className="input focus-ring"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => onRemoveRule(rule.id)} 
          className="btn btn-ghost p-2"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-lg)',
            flexShrink: 0,
            color: 'var(--error-400)'
          }}
          title="Remove rule"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Rule Description */}
      <div 
        className="mt-4 p-3 rounded-lg text-sm"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)'
        }}
      >
        <strong className="text-primary">Rule: </strong>
        Customer {rule.field === 'totalSpends' ? 'spending' : rule.field === 'visitCount' ? 'visits' : 'last visit'} 
        {' '}
        {rule.operator === '>' ? 'greater than' : 
         rule.operator === '<' ? 'less than' : 
         rule.operator === '=' ? 'equal to' : 
         rule.operator === '>=' ? 'greater than or equal to' : 
         'less than or equal to'} 
        {' '}
        <span className="text-primary font-medium">
          {rule.value}{rule.field === 'totalSpends' ? ' INR' : rule.field === 'lastVisit' ? ' days' : ' times'}
        </span>
      </div>
    </div>
  );
};

export default Rule;