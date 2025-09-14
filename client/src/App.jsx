import { Outlet, Link, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// A simple custom style for NavLink
const navLinkStyle = ({ isActive }) => {
  return {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-lg)',
    fontWeight: '500',
    color: isActive ? 'var(--primary-600)' : 'var(--gray-600)',
    backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
    textDecoration: 'none',
    transition: 'background-color 0.2s, color 0.2s'
  };
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/auth/current_user');
        if (data && Object.keys(data).length > 0) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed, setting user to null");
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  const renderAuthLinks = () => {
    if (isAuthLoading) {
      return <div style={{width: '120px', height: '38px', backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-lg)'}} />;
    }
    if (user) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{color: 'var(--gray-600)', fontSize: '0.9rem'}}>Welcome, {user.displayName}</span>
          <a href="http://localhost:8000/api/auth/logout" style={{color: 'var(--primary-600)', fontWeight: '500'}}>Logout</a>
        </div>
      );
    } else {
      return <a href="http://localhost:8000/api/auth/google" style={{color: 'var(--primary-600)', fontWeight: '500'}}>Login with Google</a>;
    }
  };

  const renderMainContent = () => {
    if (isAuthLoading) {
      return <h2 style={{textAlign: 'center', color: 'var(--gray-600)'}}>Authenticating...</h2>;
    }
    if (user) {
      return <Outlet />;
    }
    return <h2 style={{textAlign: 'center', color: 'var(--gray-600)'}}>Please log in to build your campaign.</h2>;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)'}}>
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 2rem' }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--gray-900)'}}>
              Xeno CRM
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <NavLink to="/" style={navLinkStyle} end>Audience Builder</NavLink>
              <NavLink to="/campaigns" style={navLinkStyle}>Campaign History</NavLink>
            </div>
          </div>
          <div>
            {renderAuthLinks()}
          </div>
        </nav>
      </header>
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;