import React from 'react';


const Footer = () => {

  return (
    <footer className="footer mt-40 mb-10" style={{ textAlign: 'center' }}>
      <div className="footer-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <nav className="footer-nav" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>

          <a href="/privacy">Privacy Policy</a>

        </nav>
      </div>
    </footer>
  );
}

export default Footer;