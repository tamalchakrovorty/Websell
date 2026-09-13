import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-slate-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary inline-block px-8 py-3">← Back to Home</Link>
      </div>
    </div>
  );
}
