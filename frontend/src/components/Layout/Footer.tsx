import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container-responsive">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} JAIIB-CAIIB Exam Prep Portal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary-600 transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:support@mockmaster.fun" className="hover:text-primary-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
