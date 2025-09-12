import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Audience Builder</Link>
        <Link to="/campaigns">Campaign History</Link>
      </nav>
      <main style={{ padding: '1rem' }}>
        {/* The current page will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;