import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { SiVisa } from "react-icons/si";
import axios from "axios";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/newsletter", { email });
      setMessage(res.data.message); // Success message
      setEmail(""); // clear input
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <footer className="footer-container">
 
      <div className="footer">
        {/* Contact Us */}
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><FaMapMarkerAlt className="contact-icon" /> 21 Km Ferozpur Road Lahore, Pakistan.</p>
          <p><FaEnvelope className="contact-icon" /> nishatonline@nishatmills.com</p>
          <p><FaPhone className="contact-icon" /> +92 42 111 647 428</p>
        </div>

        {/* Information */}
        <div className="footer-section">
          <h4>Information</h4>
          <p><Link to="/blogs">Blogs</Link></p>
          <p><Link to="/about-us">About Us</Link></p>
          <p><Link to="/catalogues">Catalogues</Link></p>
          <p><Link to="/privacy-policy">Privacy Policy</Link></p>
          <p><Link to="/terms">Terms & Conditions</Link></p>
        </div>

        {/* Customer Services */}
        <div className="footer-section">
          <h4>Customer Services</h4>
          <p><Link to="/faqs">FAQs</Link></p>
          <p><Link to="/order-tracking">Order Tracking</Link></p>
          <p><Link to="/store-locator">Store Locator</Link></p>
          <p><Link to="/contact">Contact Us</Link></p>
          <p><Link to="/return-exchange">Return & Exchange Policy</Link></p>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-section">
          <h4>Newsletter Signup</h4>
          <p>Subscribe to our newsletter and get latest updates.</p>
          <div className="newsletter">
            <input 
              type="email" 
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe</button>
          </div>
          {message && <p style={{ marginTop: "5px", color: "lightgreen", fontSize: "14px" }}>{message}</p>}
          <div className="social-icon">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment */}
      <div className="fbottomcontainer">
      <div className="footer-bottom">
        <p>Copyright © 2025 Nishat. All rights reserved.</p>
        <div className="payment-logos">
          <SiVisa />
        </div>
      </div>
     </div>
    </footer>
  );
}
