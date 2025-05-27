'use client';

import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setSubmitted(true);
    setEmail('');

    // You can replace this with your backend/API call
    console.log('Subscribed email:', email);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">Subscribe to our Newsletter</h2>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
        Get the latest posts, updates, and tips right to your inbox.
      </p>

      {submitted ? (
        <p className="text-green-600 text-center font-medium">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      )}

      {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
    </div>
  );
}
