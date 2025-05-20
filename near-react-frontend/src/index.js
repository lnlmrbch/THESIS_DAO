import React from 'react';
import ReactDOM from 'react-dom/client'; // Ändere von 'react-dom' zu 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App';

// Verwende die neue createRoot API in React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
);