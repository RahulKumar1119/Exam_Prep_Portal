import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
