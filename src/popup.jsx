import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Netflix Filter Panel</h1>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);