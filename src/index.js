import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Clear any existing tournament data
localStorage.removeItem('tournament_groups');
localStorage.removeItem('tournament_matches');
localStorage.removeItem('tournament_knockout');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 