import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import AudienceBuilderPage from './pages/AudienceBuilderPage.jsx';
import CampaignHistoryPage from './pages/CampaignHistoryPage.jsx';
//both paths are importatant to navigate between pages

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true, // This makes it the default child route
        element: <AudienceBuilderPage />,
      },
      {
        path: '/campaigns',
        element: <CampaignHistoryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);