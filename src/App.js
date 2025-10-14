import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #f3e8ff, #ffffff, #dbeafe)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
            🎮 Gamification Hub
          </h1>
          <p style={{ color: '#666' }}>Powered by Whop</p>
        </div>
      </div>
    </div>
  );
}

export default App;

