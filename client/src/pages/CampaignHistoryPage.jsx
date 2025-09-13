import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CampaignHistory.css';

const CampaignHistoryPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/campaigns');
        setCampaigns(response.data);
      } catch (err) {
        setError('Failed to fetch campaigns.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="campaign-history-container">
      <h2>Campaign History</h2>
      {campaigns.length === 0 ? (
        <p>No campaigns found. Go create one!</p>
      ) : (
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="campaign-card">
              <div className="campaign-card-header">
                <h3>Campaign Sent on {new Date(campaign.createdAt).toLocaleString()}</h3>
              </div>
              <div className="campaign-card-body">
                <p><strong>Message:</strong> {campaign.message}</p>
                <p><strong>Audience Size:</strong> {campaign.stats.total}</p>
                <div className="stats-grid">
                    <div className="stat-item sent">
                        <span className="stat-number">{campaign.stats.sent}</span>
                        <span className="stat-label">Sent</span>
                    </div>
                    <div className="stat-item failed">
                        <span className="stat-number">{campaign.stats.failed}</span>
                        <span className="stat-label">Failed</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignHistoryPage;