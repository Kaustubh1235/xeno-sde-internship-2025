import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Rule from '../components/Rule';
import './AudienceBuilder.css';

const AudienceBuilderPage = () => {
  // STATE MANAGEMENT
  const [query, setQuery] = useState({
    logic: 'AND',
    rules: [],
  });
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState(''); // State for the AI text input
  const [audienceSize, setAudienceSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // HANDLER FUNCTIONS

  // Adds a new blank rule manually
  const addRule = () => {
    const newRule = {
      id: Date.now(),
      field: 'totalSpends',
      operator: '>',
      value: 0,
    };
    setQuery({ ...query, rules: [...query.rules, newRule] });
  };

  // Removes a rule by its unique ID
  const removeRule = (id) => {
    setQuery({
      ...query,
      rules: query.rules.filter((rule) => rule.id !== id),
    });
  };

  // Updates a specific part (field, operator, value) of a rule
  const handleRuleChange = (id, key, value) => {
    setQuery({
      ...query,
      rules: query.rules.map((rule) =>
        rule.id === id ? { ...rule, [key]: value } : rule
      ),
    });
  };

  // Updates the AND/OR logic
  const handleLogicChange = (e) => {
    setQuery({ ...query, logic: e.target.value });
  };

  // Calls the AI backend to generate rules from text
  const handleGenerateRules = async () => {
    if (!aiPrompt.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/ai/generate-rules', { text: aiPrompt });
      // The AI response won't have the unique 'id' React needs for keys.
      // We map over the AI's rules and add a unique ID to each one.
      const rulesWithIds = response.data.rules.map(rule => ({
        ...rule,
        id: Date.now() + Math.random(),
      }));
      // Replace the current rules with the AI-generated ones
      setQuery({ ...query, rules: rulesWithIds });
    } catch (err) {
      setError('AI failed to generate rules. Please try a different prompt.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calls the backend to get a count of customers matching the current rules
  const handlePreview = async () => {
    setIsLoading(true);
    setError('');
    setAudienceSize(0);
    try {
      const response = await axios.post('/api/audience/preview', { query });
      setAudienceSize(response.data.count);
    } catch (err) {
      setError('Failed to fetch audience size.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Saves the segment and message, creates the campaign, and navigates
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
      navigate('/campaigns');
    } catch(err) {
      setError('Failed to create campaign.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // RENDER JSX
  return (
    <div className="audience-builder">
      <h2>Create Audience Segment</h2>

      <div className="ai-generator">
        <input 
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Describe your audience in plain English..."
        />
        <button onClick={handleGenerateRules} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Rules'}
        </button>
      </div>

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