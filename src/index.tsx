import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { AuthProvider } from './contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import App from './App';

const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripeKey) {
  throw new Error("Missing Stripe publishable key. Please set REACT_APP_STRIPE_PUBLISHABLE_KEY in your environment.");
}

const stripePromise = loadStripe(stripeKey);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
