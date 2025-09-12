import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Rule from '../components/Rule';
import './AudienceBuilder.css';

const AudienceBuilderPage = () => {
  // New state structure
  const [query, setQuery] = useState({
    logic: 'AND',
    rules: [],
  });
  const [message, setMessage] = useState(''); // State for the campaign message
  const [audienceSize, setAudienceSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook for navigation

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      field: 'totalSpends',
      operator: '>',
      value: 0,
    };
    setQuery({ ...query, rules: [...query.rules, newRule] });
  };

  const removeRule = (id) => {
    setQuery({
      ...query,
      rules: query.rules.filter((rule) => rule.id !== id),
    });
  };

  const handleRuleChange = (id, key, value) => {
    setQuery({
      ...query,
      rules: query.rules.map((rule) =>
        rule.id === id ? { ...rule, [key]: value } : rule
      ),
    });
  };

  const handleLogicChange = (e) => {
    setQuery({ ...query, logic: e.target.value });
  };

  const handlePreview = async () => {
    setIsLoading(true);
    setError('');
    setAudienceSize(0);
    try {
      // Send the entire query object
      const response = await axios.post('/api/audience/preview', { query });
      setAudienceSize(response.data.count);
    } catch (err) {
      setError('Failed to fetch audience size.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCampaign = async () => {
    if (query.rules.length === 0) {
      setError('Please add at least one rule.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a campaign message.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await axios.post('/api/campaigns', { query, message });
      // On success, navigate to the campaign history page
      navigate('/campaigns');
    } catch(err) {
      setError('Failed to create campaign.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="audience-builder">
      <h2>Create Audience Segment</h2>

      <div className="rules-container">
        {query.rules.map((rule, index) => (
          <div key={rule.id}>
            <Rule
              rule={rule}
              onRuleChange={handleRuleChange}
              onRemoveRule={removeRule}
            />
            {index < query.rules.length - 1 && (
              <div className="logic-operator-display">{query.logic}</div>
            )}
          </div>
        ))}
      </div>

      <div className="controls-row">
        <button onClick={addRule} className="add-rule-btn">
          + Add Rule
        </button>
        {query.rules.length > 1 && (
          <select value={query.logic} onChange={handleLogicChange} className="logic-select">
            <option value="AND">Match ALL (AND)</option>
            <option value="OR">Match ANY (OR)</option>
          </select>
        )}
      </div>

      <div className="message-container">
        <h3>Campaign Message</h3>
        <p>Use {'{name}'} to personalize the message.</p>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="E.g., Hi {name}, here's a 10% discount for you!"
        />
      </div>

      <div className="audience-preview">
        <button onClick={handlePreview} className="preview-btn" disabled={isLoading || query.rules.length === 0}>
          {isLoading ? 'Loading...' : 'Preview Audience Size'}
        </button>
        <span className="audience-size">Audience Size: {audienceSize}</span>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleSaveCampaign} className="save-btn" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Segment & Create Campaign'}
      </button>
    </div>
  );
};

export default AudienceBuilderPage;