// import { Outlet, Link, NavLink } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// // A simple custom style for NavLink
// const navLinkStyle = ({ isActive }) => {
//   return {
//     padding: '0.5rem 1rem',
//     borderRadius: 'var(--radius-lg)',
//     fontWeight: '500',
//     color: isActive ? 'var(--primary-600)' : 'var(--gray-600)',
//     backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
//     textDecoration: 'none',
//     transition: 'background-color 0.2s, color 0.2s'
//   };
// };

// function App() {
//   const [user, setUser] = useState(null);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data } = await axios.get('/api/auth/current_user');
//         if (data && Object.keys(data).length > 0) {
//           setUser(data);
//         } else {
//           setUser(null);
//         }
//       } catch (err) {
//         console.error("Auth check failed, setting user to null");
//         setUser(null);
//       } finally {
//         setIsAuthLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const renderAuthLinks = () => {
//     if (isAuthLoading) {
//       return <div style={{width: '120px', height: '38px', backgroundColor: 'var(--gray-200)', borderRadius: 'var(--radius-lg)'}} />;
//     }
//     if (user) {
//       return (
//         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//           <span style={{color: 'var(--gray-600)', fontSize: '0.9rem'}}>Welcome, {user.displayName}</span>
//           <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`} style={{color: 'var(--primary-600)', fontWeight: '500'}}>Logout</a>
//         </div>
//       );
//     } else {
//       return <a href={`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`} style={{color: 'var(--primary-600)', fontWeight: '500'}}>Login with Google</a>;
//     }
//   };

//   const renderMainContent = () => {
//     if (isAuthLoading) {
//       return <h2 style={{textAlign: 'center', color: 'var(--gray-600)'}}>Authenticating...</h2>;
//     }
//     if (user) {
//       return <Outlet />;
//     }
//     return <h2 style={{textAlign: 'center', color: 'var(--gray-600)'}}>Please log in to build your campaign.</h2>;
//   };

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)'}}>
//       <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--gray-200)', padding: '0 2rem' }}>
//         <nav style={{ maxWidth: '1200px', margin: '0 auto', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//             <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', textDecoration: 'none', color: 'var(--gray-900)'}}>
//               Xeno CRM
//             </Link>
//             <div style={{ display: 'flex', gap: '0.5rem' }}>
//               <NavLink to="/" style={navLinkStyle} end>Audience Builder</NavLink>
//               <NavLink to="/campaigns" style={navLinkStyle}>Campaign History</NavLink>
//             </div>
//           </div>
//           <div>
//             {renderAuthLinks()}
//           </div>
//         </nav>
//       </header>
//       <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
//         {renderMainContent()}
//       </main>
//     </div>
//   );
// }

// export default App;


// App.jsx
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// ---- CONFIG ----
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, ''); // no trailing slash

// single axios client; always send cookies to API_BASE
const api = axios.create({
  baseURL: API_BASE || '/',
  withCredentials: true,
  // Never follow auth redirects in the browser; let server return 401 instead
  validateStatus: (s) => s >= 200 && s < 500,
});

// Dark theme navigation style
const navLinkStyle = ({ isActive }) => ({
  padding: 'var(--space-3) var(--space-5)',
  borderRadius: 'var(--radius-lg)',
  fontWeight: 500,
  fontSize: '0.875rem',
  color: isActive ? 'var(--primary-400)' : 'var(--text-secondary)',
  backgroundColor: isActive ? 'rgba(0, 128, 255, 0.1)' : 'transparent',
  border: isActive ? '1px solid rgba(0, 128, 255, 0.2)' : '1px solid transparent',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
  position: 'relative'
});

function App() {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Build login/logout URLs once
  const { loginUrl, logoutUrl } = useMemo(() => {
    const here = window.location.origin;
    return {
      loginUrl: `${API_BASE}/api/auth/google?redirect=${encodeURIComponent(here)}`,
      logoutUrl: `${API_BASE}/api/auth/logout?redirect=${encodeURIComponent(here)}`,
    };
  }, []);

  // Fetch current user once on mount
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setIsAuthLoading(true);
        // IMPORTANT: hit the API origin, not a relative path
        const res = await api.get('/api/auth/current_user');
        if (ignore) return;

        if (res.status === 200 && res.data && Object.keys(res.data).length) {
          setUser(res.data);
        } else {
          // 401/403/empty -> treated as logged out
          setUser(null);
        }
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setIsAuthLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const renderAuthLinks = () => {
    if (isAuthLoading) {
      return (
        <div
          style={{
            width: '120px',
            height: '40px',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      );
    }
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              {(user.displayName || user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {user.displayName || user.name || 'User'}
            </span>
          </div>
          <a 
            href={logoutUrl} 
            className="btn btn-ghost"
            style={{ fontSize: '0.875rem' }}
          >
            Sign Out
          </a>
        </div>
      );
    }
    return (
      <a href={loginUrl} className="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </a>
    );
  };

  const renderMainContent = () => {
    if (isAuthLoading) {
      return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
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
            <h2 className="text-secondary">Authenticating...</h2>
          </div>
        </div>
      );
    }
    if (user) return <Outlet />;
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="card p-8 text-center" style={{ maxWidth: '400px' }}>
          <div 
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto var(--space-6)',
              background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
              borderRadius: 'var(--radius-2xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h2 className="text-primary mb-4">Welcome to Xeno CRM</h2>
          <p className="text-secondary mb-6">
            Please sign in with your Google account to access the campaign builder and manage your marketing automation.
          </p>
          <a href={loginUrl} className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </a>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Background Effects */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, var(--bg-primary) 0%, #0a0a12 100%)',
          zIndex: -2
        }}
      />
      <div 
        style={{
          position: 'fixed',
          top: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 128, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: -1
        }}
      />
      <div 
        style={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(145, 102, 255, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: -1
        }}
      />

      <header className="glass-effect" style={{ borderBottom: '1px solid var(--border-primary)', padding: '0 var(--space-6)', position: 'sticky', top: 0, zIndex: 50 }}>
        <nav className="container flex items-center justify-between" style={{ height: '4rem' }}>
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-3 text-primary"
              style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, var(--primary-400), var(--accent-400))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              Xeno CRM
            </Link>
            <div className="flex gap-2">
              <NavLink to="/" end style={navLinkStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4V2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0 0 2h1v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 0 0 0-2h-4zM10 4V3h4v1H10z"/>
                </svg>
                Audience Builder
              </NavLink>
              <NavLink to="/campaigns" style={navLinkStyle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zm2 2h14v12H5V6zm2 2v2h2V8H7zm4 0v2h2V8h-2zm4 0v2h2V8h-2zm-8 4v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
                </svg>
                Campaign History
              </NavLink>
            </div>
          </div>
          <div>{renderAuthLinks()}</div>
        </nav>
      </header>
      <main className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
