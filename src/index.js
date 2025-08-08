import React from 'react';
import ReactDOM from 'react-dom/client';
import StorePicker from './components/StorePicker';
import App from './components/App';
import './css/style.css';

const root = ReactDOM.createRoot(document.getElementById('main'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
