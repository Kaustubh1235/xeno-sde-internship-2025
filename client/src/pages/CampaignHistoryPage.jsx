import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CampaignHistory.css';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Sort newest first (optional)
  const items = [...campaigns].sort(
    (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
  );

  return (
    <div className="campaign-history-container">
      <h2>Campaign History</h2>
      {items.length === 0 ? (
        <p>No campaigns found. Go create one!</p>
      ) : (
        <div className="campaign-list">
          {items.map((c) => {
            const stats = c?.stats || {};
            const total = stats.total ?? 0;
            const sent = stats.sent ?? 0;
            const failed = stats.failed ?? 0;
            const when = c?.createdAt ? new Date(c.createdAt).toLocaleString() : 'Unknown date';

            return (
              <div key={c._id || when} className="campaign-card">
                <div className="campaign-card-header">
                  <h3>Campaign Sent on {when}</h3>
                </div>
                <div className="campaign-card-body">
                  <p><strong>Message:</strong> {c?.message || '-'}</p>
                  <p><strong>Audience Size:</strong> {total}</p>
                  <div className="stats-grid">
                    <div className="stat-item sent">
                      <span className="stat-number">{sent}</span>
                      <span className="stat-label">Sent</span>
                    </div>
                    <div className="stat-item failed">
                      <span className="stat-number">{failed}</span>
                      <span className="stat-label">Failed</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignHistoryPage;
