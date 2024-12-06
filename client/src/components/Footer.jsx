import React, { useState } from 'react';
import "../build/css/Footer.css";
const Footer = () => {
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    if (selectedLanguage === 'en') {
      alert('Language changed to English');
    } else if (selectedLanguage === 'fr') {
      alert('Langue changée en Français');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phone Number */}
        <div className="footer-item">
          <p><strong>Phone:</strong> +216 55 485 124</p>
        </div>

        {/* Copyright */}
        <div className="footer-item">
          <p>© 2024 by Mehdi Mahmoudi. All rights reserved.</p>
        </div>

        {/* Language Selector 
        <div className="footer-item">
          <select
            className="language-selector"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>*/}
      </div>
    </footer>
  );
};

export default Footer;
