import React from 'react';
import { createRoot } from 'react-dom/client';
import '@atlaskit/css-reset';
import App from './App.jsx';
import './styles/popup.css';

createRoot(document.getElementById('root')).render(<App />);
