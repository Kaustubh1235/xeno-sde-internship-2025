import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Users, MessageCircle, Zap, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

import Rule from '../components/Rule.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/input.jsx';
import Textarea from '../components/TextArea.jsx';
import Select from '../components/Select.jsx';
import Badge from '../components/Badge.jsx';

// ---------- AXIOS CONFIG (Render base + cookies) ----------
const API_BASE =
  (import.meta.env?.VITE_API_BASE_URL || 'https://xeno-sde-internship-2025.onrender.com')
    .replace(/\/+$/, ''); // strip trailing slash

const api = axios.create({
  baseURL: API_BASE,              // e.g. https://xeno-sde-internship-2025.onrender.com
  withCredentials: true,          // send/receive cookies
  headers: { 'Content-Type': 'application/json' }
});

// Optional: tiny helper to log backend error payloads in dev
const getErr = (e) => e?.response?.data || e?.message || 'Request failed';

const AudienceBuilderPage = () => {
  const [query, setQuery] = useState({ logic: 'AND', rules: [] });
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [audienceSize, setAudienceSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const addRule = () => {
    const newRule = { id: Date.now(), field: 'totalSpends', operator: '>', value: 0 };
    setQuery({ ...query, rules: [...query.rules, newRule] });
  };

  const removeRule = (id) => {
    setQuery({ ...query, rules: query.rules.filter((r) => r.id !== id) });
  };

  const handleRuleChange = (id, key, value) => {
    setQuery({
      ...query,
      rules: query.rules.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    });
  };

  const handleLogicChange = (e) => setQuery({ ...query, logic: e.target.value });

  // ---------- USE RENDER API ----------
  const handleGenerateRules = async () => {
    if (!aiPrompt.trim()) return;
    setIsLoading(true); setError(''); setSuccess('');
    try {
      const { data } = await api.post('/api/ai/generate-rules', { text: aiPrompt });

      const rulesWithIds = (data?.rules ?? []).map((r) => ({ ...r, id: Date.now() + Math.random() }));
      setQuery((prev) => ({ ...prev, logic: String(data?.logic || 'AND').toUpperCase(), rules: rulesWithIds }));
      setSuccess('AI successfully generated your audience rules!');
    } catch (e) {
      console.error('generate-rules error:', getErr(e));
      setError('AI failed to generate rules. Please try a different prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true); setError(''); setSuccess(''); setAudienceSize(null);
    try {
      const { data } = await api.post('/api/audience/preview', { query });
      setAudienceSize(data.count);
      setSuccess(`Found ${data.count.toLocaleString()} matching customers!`);
    } catch (e) {
      console.error('preview error:', getErr(e));
      setError('Failed to fetch audience size.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCampaign = async () => {
    if (query.rules.length === 0) return setError('Please add at least one rule.');
    if (!message.trim()) return setError('Please enter a campaign message.');

    setIsSaving(true); setError(''); setSuccess('');
    try {
      await api.post('/api/campaigns', { query, message });
      setSuccess('Campaign created successfully! Redirecting...');
      setTimeout(() => navigate('/campaigns'), 1500);
    } catch (e) {
      console.error('save campaign error:', getErr(e));
      const msg = e.response?.data?.message || 'Failed to create campaign.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="container animate-fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div 
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Users className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-primary mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>Create Audience Segment</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Use our AI assistant or build rules manually to target the right customers with precision
        </p>
      </div>

      <div className="grid gap-8">
        {/* AI-Powered Rule Generation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div 
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, var(--accent-500), var(--pink-500))',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>AI-Powered Rule Generation</h3>
              <p className="text-secondary">Describe your target audience in natural language</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Input 
              value={aiPrompt} 
              onChange={(e) => setAiPrompt(e.target.value)} 
              placeholder="e.g., 'High-value customers who haven't visited in 30 days'" 
              className="flex-1" 
              style={{ fontSize: '0.875rem', padding: 'var(--space-4)' }}
            />
            <Button 
              onClick={handleGenerateRules} 
              disabled={isLoading || isSaving} 
              variant="primary"
              className="px-8"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div 
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate Rules
                </div>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Audience Rules */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-8 m-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--cyan-500))',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Audience Rules</h3>
                <p className="text-secondary">Define criteria to segment your audience</p>
              </div>
            </div>
            <Button onClick={addRule} variant="secondary" className="px-6">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Rule
              </div>
            </Button>
          </div>

          {query.rules.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {query.rules.map((rule, index) => (
                  <motion.div key={rule.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <Rule rule={rule} onRuleChange={handleRuleChange} onRemoveRule={removeRule} />
                    {index < query.rules.length - 1 && (
                      <div className="flex justify-center my-2">
                        <Badge variant="primary">{query.logic}</Badge>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {query.rules.length > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-6 rounded-xl border"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div 
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, var(--accent-500), var(--primary-500))',
                          borderRadius: 'var(--radius-lg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="text-white text-sm font-bold">
                          {query.logic === 'AND' ? '&' : '|'}
                        </span>
                      </div>
                      <div>
                        <label className="text-primary font-medium block mb-1">
                          Logic Operator
                        </label>
                        <p className="text-muted text-sm">
                          How should these rules be combined?
                        </p>
                      </div>
                    </div>
                    <div className="flex-1" style={{ maxWidth: '300px' }}>
                      <Select 
                        value={query.logic} 
                        onChange={handleLogicChange} 
                        style={{ width: '100%' }}
                      >
                        <option value="AND">Match ALL conditions (AND)</option>
                        <option value="OR">Match ANY condition (OR)</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div 
                    className="mt-4 p-3 rounded-lg text-sm"
                    style={{
                      background: query.logic === 'AND' ? 'var(--primary-bg)' : 'var(--warning-bg)',
                      border: `1px solid ${query.logic === 'AND' ? 'var(--primary-border)' : 'var(--warning-border)'}`,
                      color: query.logic === 'AND' ? 'var(--primary-400)' : 'var(--warning-400)'
                    }}
                  >
                    <strong>
                      {query.logic === 'AND' ? 'AND Logic' : 'OR Logic'}:
                    </strong>
                    {' '}
                    {query.logic === 'AND' 
                      ? 'Customers must match ALL of the above rules to be included.'
                      : 'Customers matching ANY of the above rules will be included.'
                    }
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div 
              className="text-center py-12 border-2 border-dashed rounded-xl"
              style={{ 
                borderColor: 'var(--border-primary)',
                background: 'var(--bg-tertiary)'
              }}
            >
              <div className="flex justify-center mb-4">
                <div 
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--bg-accent)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Users className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <p className="text-secondary mb-4">No rules defined yet</p>
              <p className="text-muted text-sm">Use the AI generator above or click "Add Rule" to get started</p>
            </div>
          )}
        </motion.div>

        {/* Message and Actions Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Campaign Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--orange-500), var(--warning-500))',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Campaign Message</h3>
                <p className="text-secondary">Craft your personalized message</p>
              </div>
            </div>
            <Textarea 
              hint="Use {name} to personalize the message." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Hi {name}, here's a special discount tailored just for you!" 
              rows={6}
              style={{ fontSize: '0.875rem' }}
            />
          </motion.div>

          {/* Campaign Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--success-500), var(--cyan-500))',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Campaign Actions</h3>
                <p className="text-secondary">Preview and launch your campaign</p>
              </div>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={handlePreview} 
                disabled={isLoading || isSaving || query.rules.length === 0} 
                variant="secondary" 
                className="w-full"
                style={{ padding: 'var(--space-4)' }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--text-secondary)',
                        borderTop: '2px solid var(--primary-500)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Preview Audience Size
                  </div>
                )}
              </Button>
              <Button 
                onClick={handleSaveCampaign} 
                disabled={isLoading || isSaving || query.rules.length === 0 || !message.trim()} 
                variant="primary"
                className="w-full"
                style={{ padding: 'var(--space-4)' }}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div 
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    Launching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    Launch Campaign
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {(error || success || audienceSize !== null) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              transition={{ duration: 0.3 }}
            >
              {error && (
                <div 
                  className="flex items-center gap-4 p-6 rounded-xl border"
                  style={{
                    background: 'var(--error-bg)',
                    borderColor: 'var(--error-border)',
                    color: 'var(--error-400)'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--error-500)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Error</h4>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
              {success && (
                <div 
                  className="flex items-center gap-4 p-6 rounded-xl border"
                  style={{
                    background: 'var(--success-bg)',
                    borderColor: 'var(--success-border)',
                    color: 'var(--success-400)'
                  }}
                >
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--success-500)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Success</h4>
                    <p className="text-sm">{success}</p>
                  </div>
                </div>
              )}
              {audienceSize !== null && !success && !error && (
                <div className="card p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div 
                      style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-primary mb-2" style={{ fontSize: '3rem', fontWeight: '700' }}>
                    {audienceSize.toLocaleString()}
                  </div>
                  <p className="text-secondary">matching customers found</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AudienceBuilderPage;
