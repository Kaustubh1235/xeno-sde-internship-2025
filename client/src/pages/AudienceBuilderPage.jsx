import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Sparkles,
  Users,
  MessageCircle,
  Zap,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Corrected import paths for your UI library
import Rule from '../components/Rule.jsx'; // This is your original Rule component, assuming it's not in /ui
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import Input from '../components/input.jsx';
import Textarea from '../components/TextArea.jsx';
import Select from '../components/Select.jsx';
import Badge from '../components/Badge.jsx';

const AudienceBuilderPage = () => {
  // STATE MANAGEMENT
  const [query, setQuery] = useState({
    logic: 'AND',
    rules: [],
  });
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [audienceSize, setAudienceSize] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // --- FULLY IMPLEMENTED HANDLER FUNCTIONS ---

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

  // inside AudienceBuilderPage.jsx
const handleGenerateRules = async () => {
  if (!aiPrompt.trim()) return;
  setIsLoading(true);
  setError('');
  setSuccess('');
  try {
    const { data } = await axios.post('/api/ai/generate-rules', { text: aiPrompt });

    const rulesWithIds = (data?.rules ?? []).map((r) => ({
      ...r,
      id: Date.now() + Math.random(),
    }));

    setQuery((prev) => ({
      ...prev,
      logic: String(data?.logic || 'AND').toUpperCase(),
      rules: rulesWithIds,
    }));

    setSuccess('AI successfully generated your audience rules!');
  } catch (err) {
    setError('AI failed to generate rules. Please try a different prompt.');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  
  const handlePreview = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    setAudienceSize(null);
    try {
      const response = await axios.post('/api/audience/preview', { query });
      setAudienceSize(response.data.count);
      setSuccess(`Found ${response.data.count.toLocaleString()} matching customers!`);
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
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/campaigns', { query, message });
      setSuccess('Campaign created successfully! Redirecting...');
      setTimeout(() => navigate('/campaigns'), 1500);
    } catch(err) {
      const errorMessage = err.response?.data?.message || 'Failed to create campaign.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // --- UI RENDER (INTACT) ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Create Audience Segment
        </h1>
        <p className="text-gray-600 text-lg mt-2">
          Use our AI assistant or build rules manually to target the right customers.
        </p>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-secondary-500" />
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Rule Generation</h2>
          </div>
          <div className="flex gap-4">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'High-value customers who are inactive'"
              className="flex-1"
              icon={Zap}
            />
            <Button
              onClick={handleGenerateRules}
              disabled={isLoading || isSaving}
              loading={isLoading}
              variant="secondary"
            >
              Generate Rules
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Audience Rules</h2>
                </div>
                <Button onClick={addRule} icon={Plus} variant="outline">
                    Add Rule
                </Button>
            </div>
             {query.rules.length > 0 ? (
                <div className="space-y-4">
                <AnimatePresence>
                    {query.rules.map((rule, index) => (
                    <motion.div key={rule.id} initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, x: -20}}>
                        <Rule
                            rule={rule}
                            onRuleChange={handleRuleChange}
                            onRemoveRule={removeRule}
                        />
                        {index < query.rules.length - 1 && (
                            <div className="flex justify-center my-2">
                                <Badge variant="primary">{query.logic}</Badge>
                            </div>
                        )}
                    </motion.div>
                    ))}
                </AnimatePresence>

                {query.rules.length > 1 && (
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Logic:</span>
                    <Select
                        value={query.logic}
                        onChange={handleLogicChange}
                        size="sm"
                    >
                        <option value="AND">Match ALL conditions (AND)</option>
                        <option value="OR">Match ANY condition (OR)</option>
                    </Select>
                    </div>
                )}
                </div>
            ) : (
                 <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <p className="text-gray-500">No rules yet. Use the AI generator or add one manually.</p>
                </div>
            )}
        </div>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Campaign Message</h2>
                </div>
                <Textarea
                    hint="Use {name} to personalize the message."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi {name}, here's a special discount..."
                    rows={4}
                />
            </div>
        </Card>
        <Card>
            <div className="p-6 space-y-4">
                <Button
                    onClick={handlePreview}
                    disabled={isLoading || isSaving || query.rules.length === 0}
                    loading={isLoading}
                    variant="outline"
                    className="w-full"
                >
                    Preview Audience Size
                </Button>
                
                <Button
                    onClick={handleSaveCampaign}
                    disabled={isLoading || isSaving || query.rules.length === 0 || !message.trim()}
                    loading={isSaving}
                    className="w-full"
                    icon={ChevronRight}
                    iconPosition="right"
                >
                    Launch Campaign
                </Button>
            </div>
        </Card>
      </div>

      <AnimatePresence>
        {(error || success || audienceSize !== null) && (
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}} className="mt-4">
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-error-50 border border-error-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-error-600" />
                        <span className="text-error-700 font-medium">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 p-4 bg-success-50 border border-success-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success-600" />
                        <span className="text-success-700 font-medium">{success}</span>
                    </div>
                )}
                {audienceSize !== null && !success && !error && (
                     <div className="text-center p-4">
                        <div className="text-3xl font-bold text-gray-800">
                            {audienceSize.toLocaleString()}
                        </div>
                        <div className="text-gray-600">matching customers</div>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AudienceBuilderPage;

