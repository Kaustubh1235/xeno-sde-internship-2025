import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  // Let's rename this for clarity
  const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
    const fetchUser = async () => {
      try {
      const { data } = await axios.get('/api/auth/current_user');
        // This is a more robust check.
        // It ensures data is not null and is a non-empty object.
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

  // Helper function to render the login/logout links in the navbar
  const renderAuthLinks = () => {
    if (isAuthLoading) {
        return null; // Don't show anything while we check
    }
    if (user) {
        return (
            <>
                <span style={{ marginRight: '1rem' }}>Welcome, {user.displayName}</span>
                <a href="http://localhost:8000/api/auth/logout">Logout</a>
            </>
        );
    } else {
       return <a href="http://localhost:8000/api/auth/google">Login with Google</a>;
    }
  };

  // Helper function to render the main content based on auth state
  const renderMainContent = () => {
      if (isAuthLoading) {
          return <h2>Authenticating...</h2>;
      }
      // If user is logged in, show the page content
      if (user) {
          return <Outlet />;
      }
      // If NOT logged in, decide what to show
      if (window.location.pathname === '/campaigns') {
          // Allow viewing campaign history even when logged out
          return <Outlet />;
      } else {
          // For all other protected pages (like the root '/'), show login prompt
          return <h2>Please log in to create a campaign.</h2>;
      }
  }

  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ marginRight: '1rem' }}>Audience Builder</Link>
          <Link to="/campaigns">Campaign History</Link>
        </div>
        <div>
          {renderAuthLinks()}
        </div>
      </nav>
      <main style={{ padding: '1rem' }}>
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;