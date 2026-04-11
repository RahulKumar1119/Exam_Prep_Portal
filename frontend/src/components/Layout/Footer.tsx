import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container-responsive">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} JAIIB-CAIIB Exam Prep Portal. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <button className="hover:text-primary-600 transition-colors cursor-pointer bg-none border-none p-0">
              Privacy Policy
            </button>
            <button className="hover:text-primary-600 transition-colors cursor-pointer bg-none border-none p-0">
              Terms of Service
            </button>
            <button className="hover:text-primary-600 transition-colors cursor-pointer bg-none border-none p-0">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
