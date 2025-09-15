import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Calendar, Mail, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// ---- AXIOS: use Render base + credentials ----
const API_BASE = (
  import.meta.env?.VITE_API_BASE_URL ||
  'https://xeno-sde-internship-2025.onrender.com'
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE,        // https://xeno-sde-internship-2025.onrender.com
  withCredentials: true,    // send/receive cookies
  headers: { 'Content-Type': 'application/json' },
});

const CampaignHistoryPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/api/campaigns', { signal: controller.signal });
        if (alive) setCampaigns(Array.isArray(data) ? data : []);
      } catch (e) {
        if (axios.isCancel?.(e) || e.name === 'CanceledError') return;
        if (alive) {
          setError(e?.response?.data?.message || 'Failed to fetch campaigns.');
          console.error('GET /api/campaigns error:', e);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  // Sort newest first
  const items = [...campaigns].sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );

  // Calculate totals for overview
  const totalCampaigns = items.length;
  const totalSent = items.reduce((sum, c) => sum + (c?.stats?.sent || 0), 0);
  const totalFailed = items.reduce((sum, c) => sum + (c?.stats?.failed || 0), 0);
  const totalAudience = items.reduce((sum, c) => sum + (c?.stats?.total || 0), 0);

  if (loading) {
    return (
      <div className="container flex justify-center items-center" style={{ minHeight: '60vh', paddingTop: 'var(--space-8)' }}>
        <div className="flex flex-col items-center gap-4">
          <div 
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--bg-tertiary)',
              borderTop: '3px solid var(--primary-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p className="text-secondary">Loading campaign history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div 
          className="flex items-center gap-4 p-6 rounded-xl border"
          style={{
            background: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error-400)',
            maxWidth: '600px',
            margin: '0 auto'
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
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Error Loading Campaigns</h4>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div 
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--primary-500), var(--cyan-500))',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <BarChart className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-primary mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>Campaign History</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto">
          Track performance and analyze results from your marketing campaigns
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-6">
            <div 
              style={{
                width: '80px',
                height: '80px',
                background: 'var(--bg-accent)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Mail className="w-10 h-10 text-secondary" />
            </div>
          </div>
          <h3 className="text-primary mb-4">No Campaigns Yet</h3>
          <p className="text-secondary mb-6">You haven't created any campaigns yet. Start building your first audience segment!</p>
          <a href="/" className="btn btn-primary">
            <Users className="w-4 h-4" />
            Create Your First Campaign
          </a>
        </div>
      ) : (
        <div className="grid gap-8">
          {/* Overview Stats */}
          <div className="grid grid-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="stat-card"
            >
              <div className="stat-number" style={{ color: 'var(--primary-400)' }}>{totalCampaigns}</div>
              <div className="stat-label">Total Campaigns</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="stat-card"
            >
              <div className="stat-number" style={{ color: 'var(--cyan-400)' }}>{totalAudience.toLocaleString()}</div>
              <div className="stat-label">Total Reach</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="stat-card"
            >
              <div className="stat-number" style={{ color: 'var(--success-400)' }}>{totalSent.toLocaleString()}</div>
              <div className="stat-label">Messages Sent</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="stat-card"
            >
              <div className="stat-number" style={{ color: totalFailed > 0 ? 'var(--error-400)' : 'var(--success-400)' }}>{totalFailed.toLocaleString()}</div>
              <div className="stat-label">Failed Deliveries</div>
            </motion.div>
          </div>

          {/* Campaign Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card p-0"
          >
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center gap-4">
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, var(--orange-500), var(--pink-500))',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-primary mb-1" style={{ fontSize: '1.5rem', fontWeight: '600' }}>Campaign Details</h3>
                  <p className="text-secondary">Performance metrics for all campaigns</p>
                </div>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Message Preview
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Audience
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Sent
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Failed
                      </div>
                    </th>
                    <th>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((campaign, index) => {
                    const stats = campaign?.stats || {};
                    const total = stats.total ?? 0;
                    const sent = stats.sent ?? 0;
                    const failed = stats.failed ?? 0;
                    const successRate = total > 0 ? ((sent / total) * 100).toFixed(1) : '0';
                    const when = campaign?.createdAt ? new Date(campaign.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown date';

                    return (
                      <motion.tr
                        key={campaign._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted" />
                            <span className="text-sm">{when}</span>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-xs">
                            <p className="text-sm text-primary truncate" title={campaign?.message}>
                              {campaign?.message || 'No message'}
                            </p>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-cyan">{total.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className="badge badge-success">{sent.toLocaleString()}</span>
                        </td>
                        <td>
                          <span className={`badge ${failed > 0 ? 'badge-error' : 'badge-success'}`}>
                            {failed.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div 
                              style={{
                                width: '80px',
                                height: '6px',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-full)',
                                overflow: 'hidden'
                              }}
                            >
                              <div 
                                style={{
                                  width: `${successRate}%`,
                                  height: '100%',
                                  background: parseFloat(successRate) >= 90 
                                    ? 'var(--success-500)' 
                                    : parseFloat(successRate) >= 70 
                                    ? 'var(--warning-500)' 
                                    : 'var(--error-500)',
                                  borderRadius: 'var(--radius-full)',
                                  transition: 'width 0.5s ease'
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-secondary">{successRate}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CampaignHistoryPage;
