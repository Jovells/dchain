import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-40  text-center bg-gray-800 text-gray-200 py-5">
      <div className="footer-content flex flex-col items-center">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <nav className="footer-nav flex justify-center gap-4 mt-2">
          <a href="/about" className="text-gray-200 hover:text-gray-400">About Us</a>
          <a href="/contact" className="text-gray-200 hover:text-gray-400">Contact</a>
          <a href="/privacy" className="text-gray-200 hover:text-gray-400">Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;