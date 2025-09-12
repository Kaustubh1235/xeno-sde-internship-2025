import React from 'react';

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

  return (
    <div className="rule-row">
      <select value={rule.field} onChange={handleFieldChange}>
        <option value="totalSpends">Total Spends</option>
        <option value="visitCount">Visit Count</option>
        <option value="lastVisit">Last Visit (days ago)</option>
      </select>

      <select value={rule.operator} onChange={handleOperatorChange}>
        <option value=">">Greater Than (&gt;)</option>
        <option value="<">Less Than (&lt;)</option>
        <option value="=">Equal To (=)</option>
        <option value=">=">Greater Than or Equal To (&gt;=)</option>
        <option value="<=">Less Than or Equal To (&lt;=)</option>
      </select>

      <input
        type="number"
        value={rule.value}
        onChange={handleValueChange}
        placeholder="Value"
      />

      <button onClick={() => onRemoveRule(rule.id)} className="remove-btn">
        Remove
      </button>
    </div>
  );
};

export default Rule;