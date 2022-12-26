import React from 'react';
import ReactDOM from 'react-dom/client';
import { Overlay } from './components/Overlay';

const root = document.createElement('div');
root.id = 'crx-root';
document.body.append(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Overlay />
  </React.StrictMode>,
);
